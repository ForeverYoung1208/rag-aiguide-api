import { Module } from '@nestjs/common';
import { DialogsService } from './services/dialogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dialog } from '../../entities/dialog.entity';
import { DialogsController } from './controllers/dialogs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dialog])],
  controllers: [DialogsController],
  providers: [DialogsService],
  exports: [DialogsService],
})
export class DialogsModule {}
