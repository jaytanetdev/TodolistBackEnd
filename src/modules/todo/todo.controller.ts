import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {  CreateTodoRequestDto, CreateTodoResponseDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Todo } from './entities/todo.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'add todolist' })
  @ApiResponse({
    status: 201,
    description: 'Todo Created Successfully',
    type: CreateTodoResponseDto,
  })
  async create(
    @Body() createTodoDto: CreateTodoRequestDto,
  ): Promise<CreateTodoResponseDto> {
    const todo = await this.todoService.create(createTodoDto);
    return new CreateTodoResponseDto(todo)
  }

  // @Post('/')
  // @ApiOperation({ summary: 'Register my product' })
  // async createMyProduct(
  //   @CurrentUser() user: ICurrentUser,
  //   @Body() body: CreateMyProductRequestDto,
  //   @Locale() locale: string,
  //   @AcceptLanguage() language: string,
  // ): Promise<CreateMyProductResponseDto> {
  //   const result = await this.myProductSvc.createMyProduct(user, body, locale)
  //   return new CreateMyProductResponseDto(result)
  // }




  @Get()
  @ApiOperation({ summary: 'Get all todos with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    success: boolean;
    page: number;
    limit: number;
    result: Todo[];
    totalItemSize: number;
  }> {
    const { result, totalItemSize } = await this.todoService.findAll(
      page,
      limit,
    );
    return {
      success: true,
      page,
      limit,
      result,
      totalItemSize,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get  todos by ID' })
  async findOne(@Param('id') id: string): Promise<{
    success: boolean;
    result: Todo[];
  }> {
    const { result } = await this.todoService.findOne(id);
    return {
      success: true,
      result,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
