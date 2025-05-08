import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    const existingGenre = await this.genreRepository.findOne({
      where: { genre_name: createGenreDto.genre_name },
    });

    if (existingGenre) {
      throw new ConflictException('Genre with this name already exists');
    }

    const genre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.genreRepository.createQueryBuilder('genre');

    if (search) {
      query.andWhere('genre.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [genres, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: genres,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const genre = await this.genreRepository.findOneBy({
      genre_id: id, 
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);

    if (updateGenreDto.genre_name) {
      const existingGenre = await this.genreRepository.findOne({
        where: { genre_name: updateGenreDto.genre_name },
      });

      if (existingGenre && existingGenre.genre_id !== id) {
        throw new ConflictException('Genre with this name already exists');
      }
    }

    const updatedGenre = this.genreRepository.merge(genre, updateGenreDto);
    return this.genreRepository.save(updatedGenre);
  }

  async remove(id: number) {
    const result = await this.genreRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
  }
}

