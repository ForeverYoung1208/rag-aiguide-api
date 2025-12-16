import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { Dialog } from './dialog.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'users' })
export class User {
  @IsString()
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
    unique: true,
    generated: 'uuid',
  })
  id!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email!: string;

  @OneToMany(() => Dialog, (dialog) => dialog.user)
  dialogs!: Dialog[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Cart[];
}
