import { Injectable } from '@nestjs/common';
import { DialogsService } from '../../dialogs/services/dialogs.service';
import { ModelMessage } from 'ai';
import { AiAgentService } from './ai-agent.service';
import {
  EEventTypes,
  LEAVE_ORIGINAL_MESSAGES,
  MAX_DIALOG_LENGTH,
} from '../constants';
import { MyMessageEventDto } from '../dto/message-event.dto';

@Injectable()
export class MessagesMonitoringService {
  constructor(
    private readonly aiAgentService: AiAgentService,
    private readonly dialogsService: DialogsService,
  ) {
    this.aiAgentService.aiStreamEvents$.subscribe(
      (event: MyMessageEventDto) => {
        if (event.type === EEventTypes.COMPLETE) {
          void this.addFilalMessageAndSummarize(event); // start adding message and summarizing and leave promise working
        }
      },
    );
  }

  private async addFilalMessageAndSummarize(event: MyMessageEventDto) {
    if (event.type !== EEventTypes.COMPLETE) return;
    await this.addMessageToDialog(event.data.dialogId, event.data.message);
    await this.dialogsService.clearSseToken(event.data.dialogId);
    void this.summarizeDialog(event.data.dialogId);
  }

  private async addMessageToDialog(dialogId: string, message: string) {
    const dialog = await this.dialogsService.getDialogById(dialogId);
    dialog.messages = [
      ...(dialog.messages || []),
      { role: 'assistant', content: message },
    ];
    await this.dialogsService.updateDialog(dialog);
  }

  private async summarizeDialog(dialogId: string) {
    const dialog = await this.dialogsService.getDialogById(dialogId);
    const messages = dialog.messages || [];
    if (messages.length > MAX_DIALOG_LENGTH) {
      const messagesToKeep = messages.slice(
        messages.length - LEAVE_ORIGINAL_MESSAGES,
      );
      const messagesToSummarize = messages.slice(
        0,
        messages.length - LEAVE_ORIGINAL_MESSAGES,
      );
      const summaryMessage: ModelMessage =
        await this.aiAgentService.askAiAgentSummary(messagesToSummarize);

      dialog.messages = [summaryMessage, ...messagesToKeep];
      await this.dialogsService.updateDialog(dialog);
    }
  }
}
