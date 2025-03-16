import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.em.create(User, createUserDto);
    await this.em.persistAndFlush(user);
    return user;
  }

  async findAll(page: number, limit: number): Promise<{ result: User[]; totalItemSize: number }> {
    const [result, totalItemSize] = await this.em.findAndCount(User, {}, {
      limit,
      offset: (page - 1) * limit,
    });
  
    return { result, totalItemSize };
  }
  
  async findOne(id: string): Promise<User | null> { 
    return this.em.findOne(User, { id });
  }
  

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
