import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Index()
  user_id: number;

  @Column({ unique: true })
  @Index()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @Column()
  @IsString()
  first_name: string;

  @Column()
  @IsString()
  second_name: string;

  @Column({ unique: true })
  @Index()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. Must include uppercase, lowercase, and numbers/symbols',
  })
  password: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
