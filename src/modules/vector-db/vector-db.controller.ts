import { Controller, Post } from '@nestjs/common';
import { VectorDbService } from './vector-db.service';
import { Product } from '../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

@Controller('vector-db')
export class VectorDbController {
  private readonly logger: Logger = new Logger(VectorDbController.name);
  constructor(
    private readonly vectorDbService: VectorDbService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @Post('ingest-data')
  async ingestData(): Promise<void> {
    const products = await this.productRepository.find();
    this.logger.log(
      `Found ${products.length} products, transforming to documents...`,
    );
    const documents =
      this.vectorDbService.transformProductsToDocuments(products);
    this.logger.log('Ingesting data...');
    await this.vectorDbService.ingestData({
      collectionName: 'products',
      documents,
    });
    this.logger.log('Data ingested successfully');
  }
}
