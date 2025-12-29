import { Module } from '@nestjs/common';
import { AiLangchainService } from './services/ai-langchain.service';
import { AiLangchainController } from './ai-langchain.controller';
import { UsersModule } from '../users/users.module';
import { DialogsModule } from '../dialogs/dialogs.module';
import { ToolsService } from './services/tools.service';
import { MiddlewaresService } from './services/middlewares.service';

@Module({
  imports: [UsersModule, DialogsModule],
  providers: [AiLangchainService, ToolsService, MiddlewaresService],
  exports: [AiLangchainService],
  controllers: [AiLangchainController],
})
export class AiLangchainModule {}
