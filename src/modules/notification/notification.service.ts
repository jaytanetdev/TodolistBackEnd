import { Injectable } from '@nestjs/common';

import * as line from '@line/bot-sdk';
import { NotificationRepository } from './repositories/notification.repo';
import { TAuthConfig } from 'src/config/auth.config';
import { ConfigService } from '@nestjs/config';
import { CreateNotificationRequestDto } from './dto/create-notification.dto';
import { UserRepository } from '../users/repositories/user.repo';
@Injectable()
export class NotificationService {
  private client: line.Client;
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly configSvc: ConfigService,
    private readonly UserRepo: UserRepository,
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

  async notifyToUser(dto: CreateNotificationRequestDto): Promise<string> {
    const messageBody: line.TextMessage = {
      type: 'text',
      text: dto.message, // ข้อความที่ต้องการส่ง
    };

    try {
      // ส่งข้อความไปยัง userId ที่ระบุ
      await this.client.pushMessage(dto.userId, messageBody);
      console.log(`Message sent to ${dto.userId}`);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    return `Message sent to user: ${dto.userId}`;
  }

  async notifyWebHook(body: any): Promise<string> {
    const result = this.notificationRepository.create({
      responseLineNoti: body.events[0].source.userId,
    });

    const user = await this.UserRepo.findOne(
      {
        userIdLine: body.events[0].source.userId,
      },
      {
        populate: ['todos'], 
      },
    );
    
    console.log(user);
    await this.notificationRepository
      .getEntityManager()
      .persistAndFlush(result);

    return `Message sent to user: ${body ?? 123}`;
  }
}
