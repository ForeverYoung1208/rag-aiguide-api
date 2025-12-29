import { Injectable } from '@nestjs/common';
import { ChatOllama } from '@langchain/ollama';
import { DialogsService } from '../../dialogs/services/dialogs.service';
import { ConfigService } from '@nestjs/config';
import { ILLMConfig } from '../../../config/llm.config';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Observable, Subject } from 'rxjs';
import { ChunkEventDto } from '../../../dto/chunk-event.dto';
import {
  EEventCustomTypes,
  SUMMARIZE_MODEL_MAX_OUTPUT_TOKENS,
} from '../../../constants/system';
import { IAiService } from '../../../interfaces/ai-agent-service.interface';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { createAgent } from 'langchain';
import { ToolsService } from './tools.service';
import { MiddlewaresService } from './middlewares.service';
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
    private readonly middlewaresService: MiddlewaresService,
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
      {
        schema: this.llmConfig.dbMemorySchema,
      },
    );
    await checkpointer.setup();
    return checkpointer;
  }

  sendDialogToAiStreamed(dialogId: string): Observable<ChunkEventDto> {
    return new Observable<ChunkEventDto>((subscriber) => {
      void (async () => {
        const dialog = await this.dialogsService.getDialogById(dialogId);
        const phrase = dialog.phrase;
        const newMessage = new HumanMessage(phrase);
        const checkpointer = await this.initCheckpointer();

        // TODO: investigate delete message ability https://docs.langchain.com/oss/javascript/langchain/short-term-memory
        const agent = createAgent({
          model: this.chatModel,
          tools: [this.toolsService.getVectorSearchTool()],
          middleware: [
            // use custom summarization middleware because the default one uses HumanMessage and we need SystemMessage for summary message.
            this.middlewaresService.getCustomSummarizationMiddleware(
              this.askAiAgentSummary.bind(this),
            ),
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

  async askAiAgentSummary(messages: string[]): Promise<string> {
    const result = await this.summarizeModel.invoke([
      new SystemMessage(
        'You are a messages summarizer. Here are the messages to summarize: ',
      ),
      new SystemMessage('End of messages. Summarize these messages.'),
      ...messages,
    ]);

    return typeof result.content === 'string'
      ? result.content
      : JSON.stringify(result.content);
  }

  get aiStreamEvents$(): Observable<ChunkEventDto> {
    // expose readonly observable for other services to log or collect content
    return this.streamEvents$.asObservable();
  }
}
