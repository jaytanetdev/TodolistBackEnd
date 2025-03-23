import { Injectable } from '@nestjs/common'
import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { Notification } from '../entities/notification.entity'

@Injectable()
export class NotificationRepository extends EntityRepository<Notification> {
  constructor(protected readonly em: EntityManager) {
    super(em, Notification)
  }
}
