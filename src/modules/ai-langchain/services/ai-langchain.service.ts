import { Injectable } from '@nestjs/common';
import { ChatOllama } from '@langchain/ollama';
import { DialogsService } from '../../dialogs/services/dialogs.service';
import { ConfigService } from '@nestjs/config';
import { ILLMConfig } from '../../../config/llm.config';
import {
  HumanMessage,
  SystemMessage,
  BaseMessage,
  AIMessage,
} from '@langchain/core/messages';
import { Observable, Subject } from 'rxjs';
import { ChunkEventDto } from '../../../dto/chunk-event.dto';
import {
  EEventCustomTypes,
  SUMMARIZE_MODEL_MAX_OUTPUT_TOKENS,
} from '../../../constants/system';
import { IAiService } from '../../../interfaces/ai-agent-service.interface';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { createAgent, summarizationMiddleware } from 'langchain';
import { ToolsService } from './tools.service';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';

@Injectable()
export class AiLangchainService implements IAiService {
  private readonly llmConfig: ILLMConfig;

  private readonly streamEvents$: Subject<ChunkEventDto> =
    new Subject<ChunkEventDto>();

  private chatModel: BaseChatModel;
  private summarizeModel: BaseChatModel;

  constructor(
    private readonly dialogsService: DialogsService,
    private readonly configService: ConfigService,
    private readonly toolsService: ToolsService,
  ) {
    this.llmConfig = this.configService.get<() => ILLMConfig>('llmConfig')!();
    this.chatModel = new ChatOllama({
      model: this.llmConfig.chatModel,
      baseUrl: this.llmConfig.ollamaBaseUrl,
      temperature: this.llmConfig.temperature,
      numPredict: 500,
    });
    this.summarizeModel = new ChatOllama({
      model: this.llmConfig.summarizeModel,
      baseUrl: this.llmConfig.ollamaBaseUrl,
      temperature: this.llmConfig.temperature,
      numPredict: SUMMARIZE_MODEL_MAX_OUTPUT_TOKENS,
    });
  }

  async initCheckpointer() {
    const checkpointer = PostgresSaver.fromConnString(
      this.llmConfig.dbMemoryUri,
    );
    await checkpointer.setup(); // Always safe, handles schema evolution
    return checkpointer;
  }

  sendDialogToAiStreamed(dialogId: string): Observable<ChunkEventDto> {
    return new Observable<ChunkEventDto>((subscriber) => {
      void (async () => {
        const dialog = await this.dialogsService.getDialogById(dialogId);
        const phrase = dialog.phrase;
        const newMessage = new HumanMessage(phrase);
        const checkpointer = await this.initCheckpointer();

        // TODO: investigate state middleware, investigate delete message ability https://docs.langchain.com/oss/javascript/langchain/short-term-memory
        const agent = createAgent({
          model: this.chatModel,
          tools: [this.toolsService.getVectorSearchTool()],
          middleware: [
            summarizationMiddleware({
              model: this.summarizeModel,
              keep: {
                messages: this.llmConfig.keepMessages,
              },
              trigger: {
                messages: this.llmConfig.triggerSummarize,
              },
            }),
          ],
          checkpointer,
        });

        const resultStream = await agent.stream(
          { messages: [newMessage] },
          {
            streamMode: 'messages',
            configurable: { thread_id: dialogId },
          },
        );

        for await (const chunk of resultStream) {
          const [token] = chunk;
          const data =
            token.content instanceof String
              ? String(token.content)
              : JSON.stringify(token.content);

          const event: ChunkEventDto = {
            data,
          };
          // emit next chunk to SSE
          subscriber.next(event);
          // emit next chunk to internal subject
          this.streamEvents$.next(event);
        }

        // emit finish to SSE to close stream
        subscriber.next({
          type: EEventCustomTypes.COMPLETE,
          data: '',
          dialogId,
        });
        subscriber.complete();
      })();
    });
  }

  async askAiAgentSummary<T>(messages: T[]): Promise<T> {
    // Runtime check: verify all messages are BaseMessage instances
    if (messages.some((message) => !(message instanceof BaseMessage))) {
      throw new Error('Invalid messages format');
    }

    // Type assertion is safe here because we validated at runtime
    const result = await this.summarizeModel.invoke([
      ...(messages as BaseMessage[]),
      new SystemMessage('summarize this conversation'),
    ]);

    return new AIMessage(result.text) as T;
  }

  get aiStreamEvents$(): Observable<ChunkEventDto> {
    // expose readonly observable for other services to log or collect content
    return this.streamEvents$.asObservable();
  }
}
