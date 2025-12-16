import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ProductResponse } from './product.response';

@Exclude()
export class CartsProductsResponse {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  quantity!: number;

  @Expose()
  @ApiProperty()
  priceForOne!: number;

  @Expose()
  @ApiProperty()
  @Type(() => ProductResponse)
  product!: ProductResponse;

  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;
}
