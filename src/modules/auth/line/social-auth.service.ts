import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager, wrap } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';
import { TAppConfig } from 'src/config/app.config';
import { UserRepository } from 'src/modules/users/repositories/user.repo';
import * as argon2 from 'argon2';
import { LineTokenService } from './line-token.service';
import { AuthMethodEnum } from '../entities/auth-method.entity';
import { TAuthConfig } from 'src/config/auth.config';
import { TokenService } from './token.service';
@Injectable()
export class SocialAuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly configSvc: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    return hash;
  }

  async lineCallback(params: {
    userId: string;
    profilePicture: string;
    name: string;
  }) {
    console.log('paramsparams', params);

    const authLine = await this.userRepo.findOne({ userIdLine: params.userId });
    const user = this.userRepo.create({
      firstName: params.name,
      lastName: '',
      email: `${params.userId}@ahmember.line`,
      passwordHash: 'passwordLine',
      userIdLine: params.userId,
    });
    if (!authLine) {
      await this.userRepo.getEntityManager().persistAndFlush([user]);
    }

    const credential = await this.tokenService.generateLoginCredential(
      user.id,
      AuthMethodEnum.SOCIAL,
      user.firstName,
    );

    const appConfig = this.configSvc.get<TAppConfig>('app');
    const redirectUri = `${appConfig!.frontendHost}/todo`;

    return {
      accessToken: credential.accessToken,
      refreshToken: credential.refreshToken,
      redirectUri,
    };
  }
}
