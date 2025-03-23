import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  CreateUserResultDto,
  CreatUserResponseDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from '@mikro-orm/core';
import { UserRepository } from './repositories/user.repo';
import { CreateTodoResponseDto } from '../todo/dto/create-todo.dto';

@Injectable()
export class UsersService {
  constructor(private readonly UserRepo: UserRepository) {}
  async create(createUserDto: CreateUserDto): Promise<CreatUserResponseDto> {
    const user = this.UserRepo.create(createUserDto);
    await this.UserRepo.getEntityManager().persistAndFlush(user);

    return {
      success: true,
      result: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ result: User[]; totalItemSize: number }> {
    const [result, totalItemSize] = await this.UserRepo.findAndCount(
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );

    return { result, totalItemSize };
  }

  async findOne(id: string): Promise<User | null> {
    return this.UserRepo.findOne({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
