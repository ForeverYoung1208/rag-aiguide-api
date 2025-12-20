import { createOpenAI } from '@ai-sdk/openai';
import { Injectable, Logger } from '@nestjs/common';
import { generateText, ModelMessage, stepCountIs, streamText, tool } from 'ai';
import {
  EEventTypes,
  MAX_AI_STEP_COUNT,
  SUMMARIZE_MODEL_MAX_OUTPUT_TOKENS,
} from '../constants';
import { Observable, Subject } from 'rxjs';
import { DialogsService } from '../../dialogs/services/dialogs.service';
import { IdStringDto } from '../../../dto/id-string.dto';
import { LanguageModel } from 'ai'; // Add this import
import z from 'zod';
import { MyMessageEventDto } from '../dto/message-event.dto';
import { CartsService } from '../../carts/services/carts.service';

@Injectable()
export class AiAgentService {
  private readonly summarizeModel: LanguageModel;
  private readonly mainModel: LanguageModel;
  private readonly logger: Logger = new Logger(AiAgentService.name);
  private readonly streamEvents$: Subject<MyMessageEventDto> =
    new Subject<MyMessageEventDto>();

  constructor(
    private readonly dialogsService: DialogsService,
    private readonly cartService: CartsService,
  ) {
    const aiProvider = createOpenAI({});
    this.mainModel = aiProvider('gpt-4.1-mini-2025-04-14');
    this.summarizeModel = aiProvider('gpt-4.1-nano');
  }

  async askAiAgentSummary(messages: ModelMessage[]): Promise<ModelMessage> {
    const result = await generateText({
      model: this.summarizeModel,
      messages: [
        ...messages,
        {
          role: 'system',
          content: 'summarize this conversation',
        },
      ],
      maxOutputTokens: SUMMARIZE_MODEL_MAX_OUTPUT_TOKENS,
      temperature: 0.1,
      topP: 1,
    });
    return {
      role: 'assistant',
      content: result.text,
    };
  }

  sendDialogToAiStreamed(dialogId: string): Observable<MyMessageEventDto> {
    return new Observable<MyMessageEventDto>((subscriber) => {
      void (async () => {
        const dialog = await this.dialogsService.getDialogById(dialogId);
        dialog.messages = [
          ...(dialog.messages || []),
          { role: 'user', content: dialog.phrase },
        ];
        dialog.phrase = '';
        void this.dialogsService.updateDialog(dialog);

        const messages: ModelMessage[] = [
          {
            role: 'system',
            content:
              "use tool addItemToCart(code) to add items to cart. Use product's code as parameter for addItemToCart(code)",
          },
          ...dialog.messages,
        ];

        const resultStream = streamText({
          model: this.mainModel,
          messages,
          stopWhen: stepCountIs(MAX_AI_STEP_COUNT),
          onError: (error) => {
            this.logger.error(error);
          },

          onFinish: (result) => {
            // emit final event with complete final text to internal subject
            this.streamEvents$.next({
              type: EEventTypes.COMPLETE,
              data: { dialogId, message: result.text },
            });
          },
          tools: {
            addItemToCart: tool({
              description:
                'Add item to cart using product code, result is updated cart JSON',
              inputSchema: z.object({
                productCode: z.string(),
              }),
              execute: async (params: {
                productCode: string;
              }): Promise<string> => {
                console.log(
                  '=====================addItemToCart',
                  params.productCode,
                );
                const dialog =
                  await this.dialogsService.getDialogById(dialogId);
                const cart = await this.cartService.addItemToCartByCode(
                  dialog.userId,
                  params.productCode,
                  dialogId,
                );
                console.log('=cart', cart);
                return JSON.stringify(cart);
              },
            }),
          },
          maxOutputTokens: 8000,
          temperature: 0.7,
          topP: 1,
        });

        for await (const chunk of resultStream.fullStream) {
          if (chunk.type === 'text-delta') {
            const event: MyMessageEventDto = {
              data: { dialogId, message: chunk.text },
            };
            // emit next chunk to SSE
            subscriber.next(event);
            // emit next chunk to internal subject
            this.streamEvents$.next(event);
          }
        }

        // emit finish to SSE to close stream
        subscriber.next({
          type: EEventTypes.COMPLETE,
          data: { dialogId, message: '' }, // empty message to close stream, all chunks are already emitted
        });
        subscriber.complete();
      })();
    });
  }

  async addUserPhrase(
    userId: string,
    phrase: string,
    continueDialogId?: string,
  ): Promise<IdStringDto> {
    if (continueDialogId) {
      return await this.dialogsService.continueDialog(continueDialogId, phrase);
    }
    return await this.dialogsService.createDialog(userId, phrase);
  }

  get aiStreamEvents$(): Observable<MyMessageEventDto> {
    // expose readonly observable for other services to log or collect content
    return this.streamEvents$.asObservable();
  }
}
