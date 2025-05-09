import { IsPositive } from 'class-validator';
import { Order } from '../../orders/entities/order.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryColumn({ type: 'bigint', name: 'order_id' })
  order_id: number;

  @PrimaryColumn({ type: 'bigint', name: 'product_id' })
  product_id: number;

  @Column({ type: 'int' })
  @IsPositive()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsPositive()
  price_at_order: number;

  @ManyToOne(() => Order, (order) => order.order_id)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
