import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Todo } from './entities/todo.entity';
@Module({
  imports: [MikroOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
