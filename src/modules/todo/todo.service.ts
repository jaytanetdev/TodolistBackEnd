import { Injectable } from '@nestjs/common';
import { CreateTodoRequestDto, CreateTodoResponseDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { EntityManager } from '@mikro-orm/core';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TodoRepository } from './repositories/user-product.repo';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: TodoRepository,
    private readonly em: EntityManager,
  ) {}

  async create(createTodoDto: CreateTodoRequestDto): Promise<CreateTodoResponseDto> {

    const result = this.todoRepository.create({
      uuidUser: createTodoDto.uuidUser,
      title: createTodoDto.title,
      dateTodoStart: createTodoDto.dateTodoStart,
      dateTodoEnd: createTodoDto.dateTodoEnd,
    });
  
    await this.em.persistAndFlush(result);
  
    return {
      success: true,
      result: {
        id:result.id,
        uuidUser: result.uuidUser,
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
    const [result, totalItemSize] = await this.em.findAndCount(
      Todo,
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );

    return { result, totalItemSize };
  }

  async findOne(
    id: string,
  ): Promise<{ result: Todo[]; }> {
    const result = await this.em.find(Todo, { uuidUser: id });
    return  {result} ;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
