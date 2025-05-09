import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  author_name?: string;
}
