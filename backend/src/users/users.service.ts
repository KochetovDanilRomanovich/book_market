import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  async findAll(page: number = 1, limit: number = 8) {
    limit = Math.min(limit, 100);

    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ user_id: id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      });

      if (existingUser && existingUser.user_id !== id) {
        throw new ConflictException(
          'User with this email or username already exists',
        );
      }
    }

    const user = await this.findOne(id);
    const updatedUser = this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(updatedUser);
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
