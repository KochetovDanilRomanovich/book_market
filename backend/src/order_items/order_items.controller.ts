import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get('detail')
  findOne(
    @Query('orderId', new ParseIntPipe({ optional: true })) orderId: number,
    @Query('productId', new ParseIntPipe({ optional: true })) productId: number,
  ) {
    return this.orderItemsService.findOne(orderId, productId);
  }

  @Patch()
  update(
    @Query('orderId', new ParseIntPipe({ optional: true })) orderId: number,
    @Query('productId', new ParseIntPipe({ optional: true })) productId: number,
    @Body() updateOrderItemsDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(
      orderId, 
      productId, 
      updateOrderItemsDto
    );
  }

  @Delete()
  remove(
    @Query('orderId', new ParseIntPipe({ optional: true })) orderId: number,
    @Query('productId', new ParseIntPipe({ optional: true })) productId: number,
  ) {
    return this.orderItemsService.remove(orderId, productId);
  }
}
