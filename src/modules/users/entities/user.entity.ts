import { Collection, Entity, EntityRepositoryType, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';
import { UserRepository } from '../repositories/user.repo'
import { AuthMethod } from 'src/modules/auth/entities/auth-method.entity';
@Entity()
export class User {
  [EntityRepositoryType]?: UserRepository
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ type: 'text' })
  firstName: string;

  @Property({ type: 'text' })
  lastName: string;

  @Property({ type: 'text' })
  email: string;

  @Property({ type: 'text', length: 2000 })
  passwordHash: string

  @Property({ type: 'timestamp' })
  createdAt?: Date;

  @Property({ type: 'timestamp' })
  updatedAt?: Date;

  @Property({ type: 'boolean' })
  isActive?: boolean;

  @Property({ type: 'text', nullable: true })
  refreshToken?: string;

  @OneToMany(() => AuthMethod, (authMethod) => authMethod.user)
  authMethods? = new Collection<AuthMethod>(this, undefined, true)


  constructor(dto?: Partial<User>) {
    this.id = uuidV4().toUpperCase();
    this.isActive = dto?.isActive ?? true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
