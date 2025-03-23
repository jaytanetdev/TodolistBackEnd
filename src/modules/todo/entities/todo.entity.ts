import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from 'src/modules/users/entities/user.entity';
import { v4 as uuidV4 } from 'uuid';

@Entity()
export class Todo {
  @PrimaryKey({ type: 'uuid' })
  id: string;


  @Property({ type: 'text' })
  title: string;

  @Property({ type: 'timestamp' })
  dateTodoStart: Date;
  
  @Property({ type: 'timestamp' })
  dateTodoEnd: Date;

  @Property({ type: 'timestamp' })
  createdAt?: Date;

  @Property({ type: 'timestamp' })
  updatedAt?: Date;

  
  @ManyToOne(() => User)
  user!: User;

  constructor(dto: Partial<Todo>) {
    this.id = uuidV4().toUpperCase();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}


