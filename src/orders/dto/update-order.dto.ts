import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNumber, IsPositive, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  user_id?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  total_amount?: number;
}
