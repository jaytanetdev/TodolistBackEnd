
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';

@Entity()
export class Notification {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ type: 'text' })
  responseLineNoti: string;

  @Property({ type: 'timestamp' })
  createdAt?: Date;

  @Property({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(dto: Partial<Notification>) {
    this.id = uuidV4().toUpperCase();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}


