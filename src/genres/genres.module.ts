import { forwardRef, Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from 'src/books/books.module';
import { Genre } from './entities/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Genre]),
    forwardRef(() => BooksModule)
  ],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService, TypeOrmModule],
})
export class GenresModule {}
