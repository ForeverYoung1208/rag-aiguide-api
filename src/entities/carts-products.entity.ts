import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Dialog } from './dialog.entity';
import { Product } from './product.entity';

@Entity()
export class CartsProducts {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'cart_id', nullable: false })
  cartId!: string;

  @ManyToOne(() => Cart, (cart) => cart.cartsProducts)
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart;

  @Column({ name: 'product_id', nullable: false })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.cartsProducts, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ name: 'quantity', nullable: false })
  quantity!: number;

  @Column({ name: 'price_for_one', nullable: false })
  priceForOne!: number;

  @Column({ name: 'dialog_id', nullable: true })
  dialogId?: string;

  @ManyToOne(() => Dialog, (dialog) => dialog.cartsProducts)
  @JoinColumn({ name: 'dialog_id' })
  dialog?: Dialog;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
