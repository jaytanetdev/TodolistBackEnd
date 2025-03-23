import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './repositories/user-product.repo';
@Module({
  imports: [MikroOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService,TodoRepository],
  exports: [TodoService],
})
export class TodoModule {}
