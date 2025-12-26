import { Module } from '@nestjs/common';
import { AiLangchainService } from './services/ai-langchain.service';
import { AiLangchainController } from './ai-langchain.controller';
import { UsersModule } from '../users/users.module';
import { MessagesMonitoringService } from './services/messages-monitoring.service';
import { DialogsModule } from '../dialogs/dialogs.module';

@Module({
  imports: [UsersModule, DialogsModule],
  providers: [AiLangchainService, MessagesMonitoringService],
  exports: [AiLangchainService],
  controllers: [AiLangchainController],
})
export class AiLangchainModule {}
