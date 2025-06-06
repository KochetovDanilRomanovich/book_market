import { forwardRef, Module } from '@nestjs/common';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from 'src/authors/authors.module';
import { GenresModule } from 'src/genres/genres.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    forwardRef(() => AuthorsModule),
    forwardRef(() => GenresModule),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, TypeOrmModule],
})
export class BooksModule {}
