import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createMiddleware, SystemMessage } from 'langchain';
import { ILLMConfig } from '../../../config/llm.config';

@Injectable()
export class MiddlewaresService {
  constructor(private readonly configService: ConfigService) {}

  getCustomSummarizationMiddleware(
    summarizeStrings: (messages: string[]) => Promise<string>,
  ) {
    const llmConfig: ILLMConfig =
      this.configService.get<() => ILLMConfig>('llmConfig')!();
    return createMiddleware({
      name: 'custom-summarization',
      async afterAgent(state) {
        if (state.messages.length < llmConfig.triggerSummarize) {
          return { messages: state.messages };
        }
        const messagesToSummarize = state.messages.slice(
          0,
          -llmConfig.keepMessages,
        );
        const messagesToKeep = state.messages.slice(-llmConfig.keepMessages);

        const summary = await summarizeStrings(
          messagesToSummarize.map((msg) => {
            if (typeof msg.content !== 'string') {
              return JSON.stringify(msg.content);
            }
            return msg.content;
          }),
        );

        return {
          messages: [new SystemMessage(summary), ...messagesToKeep],
        };
      },
    });
  }
}
