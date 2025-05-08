import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsInt } from 'class-validator';


export class CreateOrderDto {
    @IsInt()
    @IsPositive()
    @Transform(({ value }) => parseInt(value, 10))
    user_id: number;

    @IsNumber()
    @IsPositive()
    @Transform(({ value }) => parseFloat(value))
    total_amount: number;
}
