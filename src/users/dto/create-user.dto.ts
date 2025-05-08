import { IsString, IsEmail, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @Transform(({ value }) => value.trim())
  username: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  first_name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  second_name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. Must include uppercase, lowercase, and numbers/symbols',
  })
  password: string;
}
