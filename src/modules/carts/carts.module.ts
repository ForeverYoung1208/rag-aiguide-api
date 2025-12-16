import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../../entities/cart.entity';
import { CartsService } from './services/carts.service';
import { CartsController } from './controllers/carts.controller';
import { Product } from '../../entities/product.entity';
import { CartsProducts } from '../../entities/carts-products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, CartsProducts])],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
