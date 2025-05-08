import { IsString } from "class-validator";
import { Book } from "src/books/entities/book.entity";
import { PrimaryGeneratedColumn, Index, Column, OneToMany } from "typeorm";

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
