import {
  Cascade,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { AuthMethod } from './auth-method.entity'
import { v4 as uuidV4 } from 'uuid'
import { AuthPasswordRepository } from 'src/modules/repositories/auth-password.repo'

@Entity({
  tableName: 'auth_password',
  repository: () => AuthPasswordRepository,
})
export class AuthPassword {
  [EntityRepositoryType]?: AuthPasswordRepository

  @PrimaryKey({ type: 'uuid' })
  id?: string

  @Property({ type: 'text', length: 2000 })
  passwordHash: string

  @Property({ type: 'timestamp' })
  createdAt: Date

  @Property({ type: 'uuid', nullable: true })
  jwtId: string

  @ManyToOne(() => AuthMethod, { cascade: [Cascade.ALL] })
  authMethod?: AuthMethod

  constructor(dto: { passwordHash: string }) {
    this.id = uuidV4().toUpperCase()
    this.passwordHash = dto.passwordHash
    this.createdAt = new Date()
  }
}
