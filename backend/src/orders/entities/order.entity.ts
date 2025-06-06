import { IsPositive } from 'class-validator';
import { OrderItem } from '../../order_items/entities/order_item.entity';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Index()
  order_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsPositive()
  total_amount: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];
}
