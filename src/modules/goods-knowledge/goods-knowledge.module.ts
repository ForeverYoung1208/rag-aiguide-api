import { Module } from '@nestjs/common';
import { GoodsKnowledgeService } from './services/goods-knowledge.service';
import { GoodsController } from './controllers/goods.controller';
import { GoodsSqlRepository } from './services/goods-sql.repository';
import { GoodsService } from './services/goods.service';
import { GOODS_KNOWLEDGE_BASE_SERVICE_TOKEN } from './constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // todo: if ever i create Products module, move this logic there
  controllers: [GoodsController],
  providers: [
    GoodsKnowledgeService,
    GoodsSqlRepository,
    GoodsService,
    {
      provide: GOODS_KNOWLEDGE_BASE_SERVICE_TOKEN,
      useClass: GoodsKnowledgeService,
    },
  ],
  exports: [
    GoodsKnowledgeService,
    GoodsService,
    GOODS_KNOWLEDGE_BASE_SERVICE_TOKEN,
  ],
})
export class GoodsModule {}
