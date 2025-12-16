import { Module } from '@nestjs/common';
import { DialogsService } from './services/dialogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dialog } from '../../entities/dialog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dialog])],
  controllers: [],
  providers: [DialogsService],
  exports: [DialogsService],
})
export class DialogsModule {}
