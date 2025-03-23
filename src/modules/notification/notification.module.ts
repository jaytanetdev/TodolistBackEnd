import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './repositories/notification.repo';
import { UserRepository } from '../users/repositories/user.repo';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService,NotificationRepository,UserRepository],
    exports: [NotificationService,UserRepository],
})
export class NotificationModule {}
