import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  title: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  current_price: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  stock_quantity: number;

  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  author_id: number;

  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  genre_id: number;
}