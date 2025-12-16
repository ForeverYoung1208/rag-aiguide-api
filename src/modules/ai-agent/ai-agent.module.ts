import { Module } from '@nestjs/common';
import { AiAgentController } from './controllers/ai-agent.controller';
import { AiAgentService } from './services/ai-agent.service';
import { GoodsModule } from '../goods-knowledge/goods-knowledge.module';
import { GOODS_KNOWLEDGE_BASE_SERVICE_TOKEN } from '../goods-knowledge/constants';
import { KNOWLEDGE_BASE_SERVICE_TOKEN } from './constants';
import { DialogsModule } from '../dialogs/dialogs.module';
import { MessagesMonitoringService } from './services/messages-monitoring.service';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [GoodsModule, DialogsModule, CartsModule],
  controllers: [AiAgentController],
  providers: [
    AiAgentService,
    MessagesMonitoringService,
    {
      provide: KNOWLEDGE_BASE_SERVICE_TOKEN,
      useExisting: GOODS_KNOWLEDGE_BASE_SERVICE_TOKEN,
    },
  ],
  exports: [AiAgentService],
})
export class AiAgentModule {}
