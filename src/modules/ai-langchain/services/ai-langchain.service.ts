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
import { createAgent } from 'langchain';
import { ToolsService } from './tools.service';

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
      model: this.llmConfig.chatModel,
      baseUrl: this.llmConfig.ollamaBaseUrl,
      temperature: this.llmConfig.temperature,
      numPredict: SUMMARIZE_MODEL_MAX_OUTPUT_TOKENS,
    });
  }

  sendDialogToAiStreamed(dialogId: string): Observable<ChunkEventDto> {
    return new Observable<ChunkEventDto>((subscriber) => {
      void (async () => {
        const dialog = await this.dialogsService.getDialogById(dialogId);
        const storedMessages = dialog.messages || [];
        const newMessage = new HumanMessage(dialog.phrase);
        dialog.phrase = '';
        dialog.messages = [...storedMessages, newMessage];
        await this.dialogsService.updateDialog(dialog);

        const agent = createAgent({
          model: this.chatModel,
          tools: [this.toolsService.getVectorSearchTool()],
        });

        const resultStream = await agent.stream(
          { messages: [...storedMessages, newMessage] },
          { streamMode: 'messages' },
        );

        let fullResponse = '';
        for await (const chunk of resultStream) {
          const [token] = chunk;
          const data = String(token.content);
          fullResponse += data;

          const event: ChunkEventDto = {
            data,
          };
          // emit next chunk to SSE
          subscriber.next(event);
          // emit next chunk to internal subject
          this.streamEvents$.next(event);
        }

        // emit finish to internal subject
        const finalEvent: ChunkEventDto = {
          type: EEventCustomTypes.COMPLETE,
          data: fullResponse,
          dialogId,
        };
        this.streamEvents$.next(finalEvent);

        // emit finish to SSE to close stream
        subscriber.next({ ...finalEvent, data: '' });
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
