import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Order } from './entities/order.entity';
import { OrderItemsModule } from 'src/order_items/order_items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]), 
    forwardRef(() => UsersModule),
    forwardRef(() => OrderItemsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
