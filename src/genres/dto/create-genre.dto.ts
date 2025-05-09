import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGenreDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  genre_name: string;
}
