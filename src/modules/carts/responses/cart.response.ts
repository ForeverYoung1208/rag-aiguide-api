import { ApiProperty } from '@nestjs/swagger';
import { CartsProductsResponse } from './carts-products.response';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponse } from '../../users/responses/user.response';

@Exclude()
export class CartResponse {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  @Type(() => UserResponse)
  user!: UserResponse;

  @Expose()
  @ApiProperty()
  @Type(() => CartsProductsResponse)
  cartsProducts!: CartsProductsResponse[];

  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;
}
