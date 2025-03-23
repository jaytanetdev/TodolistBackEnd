import { Injectable } from '@nestjs/common'
import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { AuthMethod } from '../auth/entities/auth-method.entity'

@Injectable()
export class AuthMethodRepository extends EntityRepository<AuthMethod> {
  constructor(protected readonly em: EntityManager) {
    super(em, AuthMethod)
  }
}
