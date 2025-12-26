import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Dialog } from '../../../entities/dialog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { DialogIdentifiersDto } from '../dto/dialog-identifiers.dto';
import { DataProcessingException } from '../../../exceptions/data-exceptions';
import { IdStringDto } from '../../../dto/id-string.dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(Dialog)
    private readonly dialogRepository: Repository<Dialog>,
  ) {}

  async createDialog(
    userId: string,
    phrase: string,
  ): Promise<DialogIdentifiersDto> {
    const sseToken = v4();
    const dialog = this.dialogRepository.create({
      userId,
      phrase,
      sseToken,
    });
    const res = await this.dialogRepository.save(dialog);
    if (!res.sseToken) {
      throw new DataProcessingException('SSE token is not set');
    }
    return { id: res.id, sseToken: res.sseToken };
  }

  async continueDialog(
    dialogId: string,
    phrase: string,
  ): Promise<DialogIdentifiersDto> {
    const dialog = await this.dialogRepository.findOneByOrFail({
      id: dialogId,
    });
    dialog.phrase = phrase;
    dialog.sseToken = v4();
    const res = await this.dialogRepository.save(dialog);
    if (!res.sseToken) {
      throw new DataProcessingException('SSE token is not set');
    }
    return { id: res.id, sseToken: res.sseToken };
  }

  async checkSseToken(dialogIdentifiers: DialogIdentifiersDto): Promise<void> {
    const dialog = await this.dialogRepository.findOne({
      where: {
        id: dialogIdentifiers.id,
        sseToken: dialogIdentifiers.sseToken,
      },
    });
    if (!dialog) {
      throw new DataProcessingException('SSE token not found');
    }
  }

  async clearSseToken(dialogId: string): Promise<void> {
    const dialog = await this.dialogRepository.findOneByOrFail({
      id: dialogId,
    });
    dialog.sseToken = null;
    await this.dialogRepository.save(dialog);
  }

  async getDialogById(id: string): Promise<Dialog> {
    return this.dialogRepository.findOneByOrFail({ id });
  }

  async getLastDialogForUserId(userId: string): Promise<Dialog | null> {
    return this.dialogRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async addUserPhrase(
    userId: string,
    phrase: string,
    continueDialogId?: string,
  ): Promise<IdStringDto> {
    if (continueDialogId) {
      return await this.continueDialog(continueDialogId, phrase);
    }
    return await this.createDialog(userId, phrase);
  }

  async updateDialog(
    dialog: Partial<Dialog> & { id: string },
  ): Promise<Dialog> {
    return this.dialogRepository.save(dialog);
  }
}
