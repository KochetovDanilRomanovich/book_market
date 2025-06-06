import { IsString } from 'class-validator';
import { Book } from '../../books/entities/book.entity';
import { PrimaryGeneratedColumn, Index, Column, OneToMany, Entity } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Index()
  genre_id: number;

  @Column({ unique: true })
  @Index()
  @IsString()
  genre_name: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
