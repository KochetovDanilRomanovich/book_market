import { IsString } from 'class-validator';
import { Book } from '../../books/entities/book.entity';
import { PrimaryGeneratedColumn, Index, Column, OneToMany, Entity } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Index()
  author_id: number;

  @Column({ unique: true })
  @Index()
  @IsString()
  author_name: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
