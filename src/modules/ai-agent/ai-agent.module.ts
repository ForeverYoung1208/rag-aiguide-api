import { Module } from '@nestjs/common';
import { AiAgentController } from './controllers/ai-agent.controller';
import { AiAgentService } from './services/ai-agent.service';
import { DialogsModule } from '../dialogs/dialogs.module';
import { MessagesMonitoringService } from './services/messages-monitoring.service';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [DialogsModule, CartsModule],
  controllers: [AiAgentController],
  providers: [AiAgentService, MessagesMonitoringService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
