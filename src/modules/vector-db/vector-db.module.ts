import { Module } from '@nestjs/common';
import { VectorDbService } from './vector-db.service';
import { VectorDbController } from './vector-db.controller';
import { Product } from '../../entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [VectorDbService],
  controllers: [VectorDbController],
  exports: [VectorDbService],
})
export class VectorDbModule {}
