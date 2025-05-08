import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt } from "class-validator";
import { Transform } from "class-transformer";

export class CreateBookDto {   
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  title: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  price: number; 

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  quantity: number;

  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  author_id: number;

  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  genre_id: number;
}
