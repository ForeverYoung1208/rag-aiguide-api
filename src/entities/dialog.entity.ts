import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CartsProducts } from './carts-products.entity';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';

@Entity('dialog')
export class Dialog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', nullable: false })
  userId!: string;

  @ManyToOne(() => User, (user) => user.dialogs)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'phrase', nullable: false })
  phrase!: string;

  @Column({ name: 'messages', type: 'jsonb', nullable: true })
  messages?: (HumanMessage | AIMessage | SystemMessage | ToolMessage)[];

  @Column({ name: 'sse_token', type: 'uuid', nullable: true })
  sseToken?: string | null;

  @OneToMany(() => CartsProducts, (cartsProducts) => cartsProducts.dialog)
  cartsProducts?: CartsProducts[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
