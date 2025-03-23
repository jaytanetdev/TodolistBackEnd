import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './repositories/notification.repo';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService,NotificationRepository],
    exports: [NotificationService],
})
export class NotificationModule {}
