import { forwardRef, Module } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { OrderItemsController } from './order_items.controller';
import { OrderItem } from './entities/order_item.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    forwardRef(() => OrdersModule),
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService, TypeOrmModule],
})
export class OrderItemsModule {}
