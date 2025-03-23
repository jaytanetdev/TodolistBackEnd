import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthDto, LoginRequestDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repo';
import { v4 as uuidV4 } from 'uuid';
import { AuthMethod, AuthMethodEnum } from './entities/auth-method.entity';
import { AuthMethodRepository } from '../repositories/auth-method.repo';
import { AuthPasswordRepository } from '../repositories/auth-password.repo';
import { InjectRepository } from '@mikro-orm/nestjs';
import * as argon2 from 'argon2';
import { TAuthConfig } from 'src/config/auth.config';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly authMethodRepo: AuthMethodRepository,
    private readonly configSvc: ConfigService,
    private readonly jwtSvc: JwtService,
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
  async validatePassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  async generateLoginCredential(
    userId: string,
    methodType: AuthMethodEnum,
    displayName: string,
  ) {
    const refreshTokenId = uuidV4().toUpperCase();
    const accessTokenId = uuidV4().toUpperCase();

    const refreshToken = await this.generateRefreshToken({
      userId,
      displayName,
      jwtId: refreshTokenId,
      methodType,
    });

    const accessToken = await this.generateAccessToken({
      userId,
      displayName,
      jwtId: accessTokenId,
      methodType,
      authTime: new Date(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  async generateAccessToken(payload: {
    userId: string;
    displayName: string;
    jwtId: string;
    methodType: AuthMethodEnum;
    authTime: Date;
  }) {
    return this.jwtSvc.signAsync(
      {
        name: payload.displayName,
        method: payload.methodType,
        auth_time: payload.authTime
          ? Math.floor(payload.authTime.getTime() / 1000)
          : undefined,
      },
      {
        jwtid: payload.jwtId,
        subject: payload.userId,
      },
    );
  }

  async generateRefreshToken(payload: {
    userId: string;
    displayName: string;
    jwtId: string;
    methodType: AuthMethodEnum;
  }) {
    const authConfig = this.configSvc.get<TAuthConfig>('auth');
    return this.jwtSvc.signAsync(
      {
        method: payload.methodType,
        name: payload.displayName,
      },
      {
        subject: payload.userId,
        expiresIn: authConfig!.refreshTokenExpiresIn,
        secret: authConfig!.refreshTokenSecret,
        jwtid: payload.jwtId,
        keyid: 'none',
        algorithm: 'HS512',
      },
    );
  }

  async register(dto: AuthDto) {
    const existingUser = await this.em.findOne(
      User,
      { email: dto.email.toLowerCase() },
      { fields: ['id'] },
    );
    if (existingUser) {
      throw new UnprocessableEntityException('Unable to process your request');
    }
    const passwordHash = await this.hashPassword(dto.password);
    const user = this.userRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      passwordHash: passwordHash,
    });

    const authMethod = this.authMethodRepo.create({
      id: uuidV4().toUpperCase(),
      methodType: AuthMethodEnum.PASSWORD,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    });

    await this.em.persistAndFlush([user, authMethod]);

    const credential = await this.generateLoginCredential(
      user.id,
      AuthMethodEnum.PASSWORD,
      user.firstName,
    );

    this.em.assign(user, { refreshToken: credential.refreshToken });
    await this.em.persistAndFlush(user);

    return {
      accessToken: credential.accessToken,
      refreshToken: credential.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async loginPassword(dto: LoginRequestDto) {
    const user = await this.em.findOne(
      User,
      {
        email: dto.email.toLowerCase(),
        authMethods: { methodType: AuthMethodEnum.PASSWORD },
      },
      {
        fields: [
          'id',
          'email',
          'firstName',
          'lastName',
          'isActive',
          'passwordHash',
        ],
        populate: ['authMethods.authPassword'],
        orderBy: {
          authMethods: {
            authPassword: {
              createdAt: 'DESC',
            },
          },
        },
        filters: ['notDeleted'],
      },
    );

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        cause: 'InvalidCredentials',
        statusCode: 401,
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException({
        message: 'User is not active',
        cause: 'InactiveUser',
        statusCode: 401,
      });
    }

    if (!user.id) {
      throw new UnauthorizedException({
        message: 'Email is not id',
        cause: 'EmailNotId',
        statusCode: 401,
      });
    }

    const hashPassword = user.passwordHash;

    const isPasswordValid = await this.validatePassword(
      dto.password,
      hashPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        cause: 'InvalidCredentials',
        statusCode: 401,
      });
    }

    const credential = await this.generateLoginCredential(
      user.id,
      AuthMethodEnum.PASSWORD,
      user.firstName,
    );

    this.em.assign(user, { refreshToken: credential.refreshToken });
    await this.em.persistAndFlush(user);
    return {
      accessToken: credential.accessToken,
      refreshToken: credential.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refresh(
    userId: string,
    refreshToken: string,
    authTime: Date,
    methodType: AuthMethodEnum,
  ) {
    console.log('asdasdas', refreshToken);
    const user = await this.em.findOne(
      User,
      {
        id: userId,
        isActive: true,
        refreshToken,
      },
      { fields: ['firstName'] },
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const accessTokenId = uuidV4().toUpperCase();
    const accessToken = await this.generateAccessToken({
      userId: user.id ?? '',
      displayName: user.firstName,
      jwtId: accessTokenId,
      methodType,
      authTime,
    });

    return {
      accessToken,
    };
  }
}
