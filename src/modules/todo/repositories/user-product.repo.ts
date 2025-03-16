import { Injectable } from '@nestjs/common'
import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { Todo } from '../entities/todo.entity'

@Injectable()
export class TodoRepository extends EntityRepository<Todo> {
  constructor(protected readonly em: EntityManager) {
    super(em, Todo)
  }
}
