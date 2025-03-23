import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
} from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Todo } from './entities/todo.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import ICurrentUser from '../auth/interfaces/current-user.interface';
@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'add todolist' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Todo Created Successfully',
    type: CreateTodoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @CurrentUser() user: ICurrentUser,
    @Body() createTodoDto: CreateTodoRequestDto,
  ): Promise<CreateTodoResponseDto> {
    const todo = await this.todoService.create(user, createTodoDto);
    return new CreateTodoResponseDto(todo);
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
  async findOne(@CurrentUser() user: ICurrentUser): Promise<{
    success: boolean;
    result: Todo[];
  }> {
    const { result } = await this.todoService.findOne(user);
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
