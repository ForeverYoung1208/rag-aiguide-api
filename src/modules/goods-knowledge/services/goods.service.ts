import { Injectable } from '@nestjs/common';
import { GoodsSqlRepository } from './goods-sql.repository';
import { plainToInstance } from 'class-transformer';
import { GoodsItemResponse } from '../responses/goodsItem.response';
import { Product } from '../../../entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GoodsService {
  constructor(
    private readonly goodsKnowledgeRepository: GoodsSqlRepository,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<{ total: number; data: GoodsItemResponse[] }> {
    const allGoodsSqlResult = await this.goodsKnowledgeRepository.executeSqlRaw(
      'SELECT * FROM item;',
    );
    const total = allGoodsSqlResult.rows.length;
    const goods = plainToInstance(
      GoodsItemResponse,
      allGoodsSqlResult.rows as unknown[],
    );

    return {
      total,
      data: goods,
    };
  }

  // todo: if ever i create Products module, move this logic there
  async copyToMainDb(): Promise<Product[]> {
    const allGoods = await this.goodsKnowledgeRepository.executeSqlRaw(
      'SELECT * FROM item;',
    );
    const products = allGoods.rows.map((row) => {
      const product: Product = {
        id: row.id,
        brand: row.brand,
        code: row.code,
        name: row.name,
        price: row.price,
        description: row.description,
      };
      return product;
    });
    return this.productsRepository.save(products);
  }
}
