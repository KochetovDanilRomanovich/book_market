import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from 'src/authors/entities/author.entity';
import { Genre } from 'src/genres/entities/genre.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const author = await this.authorRepository.findOneBy({
      author_id: createBookDto.author_id,
    });
    const genre = await this.genreRepository.findOneBy({
      genre_id: createBookDto.genre_id,
    });
    
    if (!author || !genre) {
      throw new NotFoundException(
        'One of the related entities (Author/Genre) not found',
      );
    }

    const book = this.bookRepository.create({
      ...createBookDto,
      author,
      genre,
      });
    return this.bookRepository.save(book);
  }

  async findAll(    
    page: number = 1,
    limit: number = 10,
    authorIds?: number[],
    genreIds?: number[],
  ) {
    const where = {};

    limit = Math.min(limit, 100);

    if (authorIds?.length) {
      where['author'] = { author_id: In(authorIds) };
    }

    if (genreIds?.length) {
      where['genre'] = { genre_id: In(genreIds) };
    }

    const [books, total] = await this.bookRepository.findAndCount({
      where,
      relations: ['author', 'genre'],
      skip: (page - 1) * limit,
      take: limit,
      order: { book_id: 'DESC' },
    });

    return {
      data: books,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { book_id: id },
      relations: ['author', 'genre'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) { 
    if (Object.keys(updateBookDto).length === 0) {
      throw new BadRequestException('No fields to update');
    }
    
    const book = await this.findOne(id);

    if (updateBookDto.author_id !== undefined) {
      const author = await this.authorRepository.findOneBy({
        author_id: updateBookDto.author_id,
      });
      if (!author) {
        throw new NotFoundException(
          `Author with ID ${updateBookDto.author_id} not found`,
        );
      }
      book.author = author;
    }

    if (updateBookDto.genre_id !== undefined) {
      const genre = await this.genreRepository.findOneBy({
        genre_id: updateBookDto.genre_id,
      });
      if (!genre) {
        throw new NotFoundException(
          `Genre with ID ${updateBookDto.genre_id} not found`,
        );
      }
      book.genre = genre;
    }

    this.bookRepository.merge(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async remove(id: number) {
    const result = await this.bookRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
}

