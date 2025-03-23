import { Injectable } from '@nestjs/common';

import * as line from '@line/bot-sdk';
import { NotificationRepository } from './repositories/notification.repo';
@Injectable()
export class NotificationService {
  private client: line.Client;
  constructor(private readonly notificationRepository: NotificationRepository) {
    const config: line.ClientConfig = {
      channelAccessToken:
        'rrzDW6aFx2jqdIv5lSQ9tyU5wTZC3WRHM26fvW6znHerpCoa+rqcykMzapjzRvrz6mnXeNJtLkHCUFQ+UQD4CCLABI8IF94nYK+bN4S6EF7sNYyRAayskVNrg5NHsgxH2vdQ7EpN+eqgPMNQJQ0togdB04t89/1O/w1cDnyilFU=', // Access Token ที่ได้จาก LINE Developer
      channelSecret: '71f344e2918cb97f731e26b6a1472c8e', // Channel Secret ที่ได้จาก LINE Developer
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
      responseLineNoti: body??'123',
    });

    await this.notificationRepository
      .getEntityManager()
      .persistAndFlush(result);

    return `Message sent to user: ${body??123}`;
  }
}
