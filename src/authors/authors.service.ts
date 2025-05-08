import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const existingAuthor = await this.authorRepository.findOne({
      where: { author_name: createAuthorDto.author_name } 
    });

    if (existingAuthor) {
      throw new ConflictException('Author with this name already exists');
    }

    const author = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(author);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.authorRepository.createQueryBuilder('author');

    if (search) {
      query.andWhere('author.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [authors, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: authors,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: number) {
    const author = await this.authorRepository.findOneBy({
      author_id: id
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findOne(id);

    if (updateAuthorDto.author_name) {
      const existingAuthor = await this.authorRepository.findOne({
        where: { author_name: updateAuthorDto.author_name }
      });

      if (existingAuthor && existingAuthor.author_id !== id) {
        throw new ConflictException('Author with this name already exists');
      }
    }

    const updatedAuthor = this.authorRepository.merge(
      author, 
      updateAuthorDto
    );
    return this.authorRepository.save(updatedAuthor);
  }

  async remove(id: number) {
    const result = await this.authorRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }
}

