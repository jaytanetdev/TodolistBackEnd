import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'

import { v4 as uuidV4 } from 'uuid'
import { AuthPassword } from './auth-password.entity'
import { AuthMethodRepository } from 'src/modules/repositories/auth-method.repo'
import { User } from 'src/modules/users/entities/user.entity'

export enum AuthMethodEnum {
  PASSWORD = 'PASSWORD',
  SOCIAL = 'SOCIAL',
}


@Entity({ tableName: 'auth_methods', repository: () => AuthMethodRepository })
export class AuthMethod {
  [EntityRepositoryType]?: AuthMethodRepository

  @PrimaryKey({ type: 'uuid' })
  id: string

  @Property({ type: 'text', length: 50 })
  methodType: AuthMethodEnum

  @Property({ type: 'timestamp' })
  createdAt: Date

  @Property({ type: 'timestamp' })
  updatedAt: Date

  @Property({ type: 'text', length: 2000, nullable: true })
  refreshToken?: string

  @ManyToOne(() => User, { cascade: [Cascade.ALL] })
  user?: User

  @OneToMany(() => AuthPassword, (authPassword) => authPassword.authMethod)
  authPassword? = new Collection<AuthPassword>(this, undefined, true)



  constructor() {
    this.id = uuidV4().toUpperCase()
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
