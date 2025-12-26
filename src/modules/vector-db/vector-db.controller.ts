import { Controller, Post, Get, Query } from '@nestjs/common';
import { VectorDbService } from './vector-db.service';
import { Product } from '../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Document } from '@langchain/core/documents';

@Controller('vector-db')
export class VectorDbController {
  private readonly logger: Logger = new Logger(VectorDbController.name);
  constructor(
    private readonly vectorDbService: VectorDbService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @Post('ingest-data')
  async ingestData(): Promise<string[]> {
    const products = await this.productRepository.find();
    const documents =
      this.vectorDbService.transformProductsToDocuments(products);
    return this.vectorDbService.ingestData({
      collectionName: 'products',
      documents,
    });
  }

  @Get('search')
  async searchInVectorStore(
    @Query('query') query: string,
  ): Promise<Document[]> {
    return this.vectorDbService.searchInVectorStore({
      collectionName: 'products',
      query,
    });
  }
}
