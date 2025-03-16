import { PartialType } from '@nestjs/swagger';
import {  CreateTodoRequestDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoRequestDto) {}
