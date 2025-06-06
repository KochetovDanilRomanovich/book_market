import { forwardRef, Module } from '@nestjs/common';
import { Author } from './entities/author.entity';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Author]),
    forwardRef(() => BooksModule),
  ],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService, TypeOrmModule],
})
export class AuthorsModule {}
