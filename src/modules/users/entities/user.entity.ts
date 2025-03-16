import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id?: string;

  @Property({ type: 'text' })
  firstName?: string;

  @Property({ type: 'text' })
  lastName?: string;

  @Property({ type: 'text' })
  username?: string;

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

  constructor(dto?: Partial<User>) {
    this.id = uuidV4().toUpperCase();
    this.firstName = dto?.firstName;
    this.username = dto?.username;
    this.passwordHash = dto?.passwordHash ?? '';
    this.isActive = dto?.isActive ?? false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
