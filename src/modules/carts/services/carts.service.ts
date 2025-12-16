import { Repository } from 'typeorm';
import { Cart } from '../../../entities/cart.entity';
import {
  DataNotFoundException,
  DataProcessingException,
} from '../../../exceptions/data-exceptions';
import { Product } from '../../../entities/product.entity';
import { CartsProducts } from '../../../entities/carts-products.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CartsProducts)
    private readonly cartProductRepository: Repository<CartsProducts>,
  ) {}

  async getCartForUser(userId: string): Promise<Cart | null> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartsProducts', 'cartsProducts.product'],
    });
    return cart;
  }

  async getCart(id: string): Promise<Cart | null> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartsProducts', 'cartsProducts.product'],
    });
    return cart;
  }

  async addItemToCartByCode(
    userId: string,
    code: string,
    dialogId?: string,
  ): Promise<Cart> {
    const product = await this.productRepository.findOne({
      where: { code },
    });
    if (!product) {
      throw new DataNotFoundException('Product not found');
    }
    return this.addItemToCart(userId, product.id, dialogId);
  }

  async addItemToCart(
    userId: string,
    productId: string,
    dialogId?: string,
  ): Promise<Cart> {
    let cart = await this.getCartForUser(userId);
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new DataNotFoundException('Product not found');
    }
    if (!cart) {
      cart = await this.createCart(userId);
    }
    let cartProduct = await this.cartProductRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });
    if (cartProduct) {
      cartProduct.quantity++;
    } else {
      cartProduct = this.cartProductRepository.create({
        cart,
        product,
        quantity: 1,
        priceForOne: product.price,
        dialogId,
      });
    }
    await this.cartProductRepository.save(cartProduct);
    const newCart = await this.getCartForUser(userId);
    if (!newCart) {
      throw new DataProcessingException(
        'Something went wrong, updated cart not found',
      );
    }
    return newCart;
  }

  async createCart(userId: string): Promise<Cart> {
    const cart = this.cartRepository.create({ user: { id: userId } });
    return this.cartRepository.save(cart);
  }

  async deleteItem(cartId: string, itemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['cartsProducts'],
    });
    if (!cart) {
      throw new DataNotFoundException('Cart not found');
    }
    const res = await this.cartProductRepository.delete({
      id: itemId,
      cart: { id: cartId },
    });
    if (!res.affected) {
      throw new DataNotFoundException('Item not found in cart');
    }
    const resultCart = await this.getCart(cartId);
    if (!resultCart) {
      throw new DataProcessingException(
        'Something went wrong, updated cart not found',
      );
    }
    return resultCart;
  }
}
