import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthorDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  author_name: string;
}
