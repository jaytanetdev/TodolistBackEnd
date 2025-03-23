import { User } from '../entities/user.entity'
import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(protected readonly em: EntityManager) {
    super(em, User)
  }
}
