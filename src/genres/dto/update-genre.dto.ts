import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  genre_name?: string;
}
