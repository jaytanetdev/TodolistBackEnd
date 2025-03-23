import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import ICurrentUser from '../auth/interfaces/current-user.interface';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/notify/boardcash')
  @ApiOperation({ summary: 'notify board cash ' })
  async notifyBoardcash(): Promise<{
    success: boolean;
  }> {
    await this.notificationService.notifyBoardcash();
    return {
      success: true,
    };
  }

  @Post('/notify/to/user')
  @ApiOperation({ summary: 'notify to user' })
  async notifyToUser(
    @CurrentUser() userId: string,
    message: string,
  ): Promise<{
    success: boolean;
  }> {
    await this.notificationService.notifyToUser(userId, message);
    return {
      success: true,
    };
  }

  @Post('/webhook')
  @ApiOperation({ summary: 'Handle incoming webhook events from LINE' })
  async handleWebhook(@Body() body: any) {
    const result = await this.notificationService.notifyWebHook(body);
    return { success: true, result: result };
  }
}
