import { Injectable } from '@nestjs/common';

import * as line from '@line/bot-sdk';
import { NotificationRepository } from './repositories/notification.repo';
import { TAuthConfig } from 'src/config/auth.config';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NotificationService {
  private client: line.Client;
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly configSvc: ConfigService,
  ) {
    const authConfig = this.configSvc.get<TAuthConfig>('auth');
    const config: line.ClientConfig = {
      channelAccessToken: authConfig!.channelAccessToken,
      channelSecret: authConfig!.channelSecret, 
    };

    // สร้าง instance ของ LINE client
    this.client = new line.Client(config);
  }

  async notifyBoardcash() {
    const messageBody: line.TextMessage = {
      type: 'text',
      text: 'ทดสอบระบบ',
    };

    try {
      await this.client.broadcast(messageBody);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
    return `This action updates todo`;
  }

  async notifyToUser(userId: string, message: string): Promise<string> {
    const messageBody: line.TextMessage = {
      type: 'text',
      text: message, // ข้อความที่ต้องการส่ง
    };

    try {
      // ส่งข้อความไปยัง userId ที่ระบุ
      await this.client.pushMessage(userId, messageBody);
      console.log(`Message sent to ${userId}`);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    return `Message sent to user: ${userId}`;
  }

  async notifyWebHook(body: any): Promise<string> {
    const result = this.notificationRepository.create({
      responseLineNoti: body ?? '123',
    });

    await this.notificationRepository
      .getEntityManager()
      .persistAndFlush(result);

    return `Message sent to user: ${body ?? 123}`;
  }
}
