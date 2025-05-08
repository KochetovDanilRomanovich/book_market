import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order_item.dto';
import { IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    product_id?: number;
  
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    order_id?: number;
  
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    quantity?: number;
  
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    price_at_order?: number;
}
