import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LineUserService {
  private readonly logger = new Logger(LineUserService.name);

  constructor(private readonly httpSvc: HttpService) {}

  async getUserInfo(accessToken: string) {
    const url = 'https://api.line.me/v2/profile';
    const request =  this.httpSvc.get<{
      userId: string;
      displayName: string;
      picture: string;
    }>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    try {
      const result = await lastValueFrom(request);
      console.log('infoUser', result);

      return result.data;
    } catch (e) {
      this.logger.error('Failed to get user info', e);
      throw e;
    }
  }

  async getFriendshipStatus(accessToken: string) {
    const url = 'https://api.line.me/friendship/v1/status';
    const request = this.httpSvc.get<{ friendFlag: boolean }>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    try {
      const result = await lastValueFrom(request);
      return result.data;
    } catch (e) {
      this.logger.error('Failed to get friendship status', e);
      throw e;
    }
  }

  async deAuthorize(accessToken: string, channelAccessToken: string) {
    const url = 'https://api.line.me/user/v1/deauthorize';
    const request = this.httpSvc.post(
      url,
      { userAccessToken: accessToken },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${channelAccessToken}`,
        },
      },
    );

    try {
      await lastValueFrom(request);
      this.logger.log('Successfully deauthorized user');
    } catch (e) {
      this.logger.error('Failed to deauthorize user', e);
      throw e;
    }
  }
}
