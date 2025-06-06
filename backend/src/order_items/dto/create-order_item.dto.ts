import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  product_id: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  order_id: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  price_at_order: number;
}
