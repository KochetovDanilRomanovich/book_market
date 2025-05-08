import { IsPositive, IsString } from "class-validator";
import { Author } from "src/authors/entities/author.entity";
import { Genre } from "src/genres/entities/genre.entity";
import { Column, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


export class Book {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    @Index()
    book_id: number;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    @IsString()
    title: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsPositive()
    current_price: number;

    @Column({ type: 'int' })
    @IsPositive()
    stock_quantity: number;
    
    @ManyToOne(() => Author, (author) => author.books)
    @JoinColumn({ name: 'author_id' })
    author: Author;

    @ManyToOne(() => Genre, (genre) => genre.books)
    @JoinColumn({ name: 'genre_id' })
    genre: Genre;
}
