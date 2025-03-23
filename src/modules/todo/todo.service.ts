import { Injectable } from '@nestjs/common';
import {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
} from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './repositories/user-product.repo';
import ICurrentUser from '../auth/interfaces/current-user.interface';
@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(
    user: ICurrentUser,
    createTodoDto: CreateTodoRequestDto,
  ): Promise<CreateTodoResponseDto> {
    
    const result = this.todoRepository.create({
      user: user.id,
      title: createTodoDto.title,
      dateTodoStart: createTodoDto.dateTodoStart,
      dateTodoEnd: createTodoDto.dateTodoEnd,
    });

    await this.todoRepository.getEntityManager().persistAndFlush(result);

    return {
      success: true,
      result: {
        id: result.id,
        user: result.user.id,
        title: result.title,
        dateTodoStart: result.dateTodoStart,
        dateTodoEnd: result.dateTodoEnd,
      },
    };
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ result: Todo[]; totalItemSize: number }> {
    const [result, totalItemSize] = await this.todoRepository.findAndCount(
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );

    return { result, totalItemSize };
  }

  async findOne(user: ICurrentUser): Promise<{ result: Todo[] }> {
    const result = await this.todoRepository.find({ user: user.id });
    return { result };
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
