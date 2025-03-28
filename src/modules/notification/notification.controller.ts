import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationRequestDto } from './dto/create-notification.dto';
import { ApiOperation } from '@nestjs/swagger';

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
  async notifyToUser(@Body() dto: CreateNotificationRequestDto): Promise<{
    success: boolean;
  }> {
    await this.notificationService.notifyToUser(dto);
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
