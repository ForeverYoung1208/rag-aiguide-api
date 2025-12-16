import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartsProducts } from './carts-products.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, unique: true })
  code!: string;

  @Column({ nullable: false })
  price!: number;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({ nullable: false })
  brand!: string;

  @OneToMany(() => CartsProducts, (cartsProducts) => cartsProducts.product)
  cartsProducts?: CartsProducts[];
}
