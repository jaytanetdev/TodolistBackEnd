import { Injectable } from '@nestjs/common'
import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { AuthPassword } from '../auth/entities/auth-password.entity'

@Injectable()
export class AuthPasswordRepository extends EntityRepository<AuthPassword> {
  constructor(protected readonly em: EntityManager) {
    super(em, AuthPassword)
  }
}
