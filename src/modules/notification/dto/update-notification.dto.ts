import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationRequestDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationRequestDto) {}
