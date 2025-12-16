import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { WithAuth } from '../../../decorators/with-auth.decorator';
import { AuthUser } from '../../../decorators/auth-user.decorator';
import { IdStringDto } from '../../../dto/id-string.dto';
import { CartsService } from '../services/carts.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartResponse } from '../responses/cart.response';
import { UseResponse } from '../../../decorators/use-response.decorator';
import { Cart } from '../../../entities/cart.entity';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({
    description: 'Get cart by user id',
  })
  @ApiResponse({
    status: 200,
    description: 'Get cart by user id',
    type: CartResponse,
  })
  @UseResponse(CartResponse)
  @Get()
  @WithAuth()
  getCart(@AuthUser() user: IdStringDto): Promise<Cart | null> {
    return this.cartsService.getCartForUser(user.id);
  }

  @Delete(':cartId/:itemId')
  @WithAuth()
  deleteItem(
    @Param() params: { cartId: string; itemId: string },
  ): Promise<Cart> {
    return this.cartsService.deleteItem(params.cartId, params.itemId);
  }
}
