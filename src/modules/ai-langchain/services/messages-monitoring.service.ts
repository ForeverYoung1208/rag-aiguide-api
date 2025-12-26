import { Injectable } from '@nestjs/common';
import { DialogsService } from '../../dialogs/services/dialogs.service';
import {
  EEventCustomTypes,
  LEAVE_ORIGINAL_MESSAGES,
  MAX_DIALOG_LENGTH,
} from '../../../constants/system';
import {
  BaseMessage,
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { TLangchainMessagesTypes } from '../types';
import { AiLangchainService } from './ai-langchain.service';
import { Logger } from '@nestjs/common';
import { ChunkEventDto } from '../../../dto/chunk-event.dto';

@Injectable()
export class MessagesMonitoringService {
  private readonly logger = new Logger(MessagesMonitoringService.name);

  constructor(
    private readonly aiLangchainService: AiLangchainService,
    private readonly dialogsService: DialogsService,
  ) {
    this.aiLangchainService.aiStreamEvents$.subscribe(
      (chunk: ChunkEventDto) => {
        // Check here for final chunk which must contain full message content
        if (chunk.type === EEventCustomTypes.COMPLETE) {
          void this.addFinalChunk(chunk, AIMessage);
        }
      },
    );
  }

  private async addFinalChunk(
    event: ChunkEventDto,
    messageConstructor:
      | typeof AIMessage
      | typeof HumanMessage
      | typeof SystemMessage,
  ): Promise<void> {
    if (event.type !== EEventCustomTypes.COMPLETE) return;
    if (!event.dialogId) {
      this.logger.error(`dialogId not found in event`);
      return;
    }
    await this.addMessageToDialog(
      event.dialogId,
      new messageConstructor(event.data),
    );
    await this.dialogsService.clearSseToken(event.dialogId);
    void this.summarizeDialog(event.dialogId);
  }

  private async addMessageToDialog(
    dialogId: string,
    message: TLangchainMessagesTypes,
  ): Promise<void> {
    const dialog = await this.dialogsService.getDialogById(dialogId);
    dialog.messages = [...(dialog.messages || []), message];
    await this.dialogsService.updateDialog(dialog);
  }

  private async summarizeDialog(dialogId: string): Promise<void> {
    const dialog = await this.dialogsService.getDialogById(dialogId);
    const messages: TLangchainMessagesTypes[] =
      dialog.messages && dialog.messages.every((m) => m instanceof BaseMessage)
        ? dialog.messages
        : [];
    if (messages.length > MAX_DIALOG_LENGTH) {
      const messagesToKeep = messages.slice(
        messages.length - LEAVE_ORIGINAL_MESSAGES,
      );
      const messagesToSummarize = messages.slice(
        0,
        messages.length - LEAVE_ORIGINAL_MESSAGES,
      );
      const summaryMessage =
        await this.aiLangchainService.askAiAgentSummary<TLangchainMessagesTypes>(
          messagesToSummarize,
        );

      dialog.messages = [summaryMessage, ...messagesToKeep];
      await this.dialogsService.updateDialog(dialog);
    }
  }
}
