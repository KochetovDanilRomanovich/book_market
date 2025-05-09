import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  quantity?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  author_id?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  genre_id?: number;
}
