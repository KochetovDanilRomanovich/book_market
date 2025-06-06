import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order_item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const order = await this.orderRepository.findOneBy({
      order_id: createOrderItemDto.order_id,
    });
    if (!order) throw new NotFoundException('Order not found');

    const existing = await this.orderItemRepository.findOne({
      where: {
        order_id: createOrderItemDto.order_id,
        product_id: createOrderItemDto.product_id,
      },
    });
    if (existing) {
      throw new ConflictException(
        'Order item for this product already exists',
      );
    }

    const orderItem = this.orderItemRepository.create({
      order_id: createOrderItemDto.order_id,
      product_id: createOrderItemDto.product_id,
      quantity: createOrderItemDto.quantity,
      price_at_order: createOrderItemDto.price_at_order,
      order,
    });

    return this.orderItemRepository.save(orderItem);
  }

  async findAll(page: number = 1, limit: number = 8) {
    limit = Math.min(limit, 100);

    const [items, total] = await this.orderItemRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(orderId: number, productId: number) {
    const orderItem = await this.orderItemRepository.findOne({
      where: {
        order_id: orderId,
        product_id: productId,
      },
      relations: ['order'],
    });

    if (!orderItem) {
      throw new NotFoundException(
        `Order item not found for order ${orderId}, product ${productId}`,
      );
    }

    return orderItem;
  }

  async update(
    orderId: number,
    productId: number,
    updateDto: UpdateOrderItemDto,
  ) {
    if (Object.keys(updateDto).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const orderItem = await this.findOne(orderId, productId);

    if (updateDto.quantity !== undefined) {
      orderItem.quantity = updateDto.quantity;
    }

    if (updateDto.price_at_order !== undefined) {
      orderItem.price_at_order = updateDto.price_at_order;
    }

    return this.orderItemRepository.save(orderItem);
  }

  async remove(orderId: number, productId: number) {
    const result = await this.orderItemRepository.delete({
      order_id: orderId,
      product_id: productId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Order item not found for order ${orderId}, product ${productId}`,
      );
    }
  }
}

