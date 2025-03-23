import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthPassword } from './entities/auth-password.entity';
import { AuthMethod } from './entities/auth-method.entity';
import { UsersModule } from '../users/users.module'; // ✅ Import UsersModule
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TAuthConfig } from 'src/config/auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserRepository } from '../users/repositories/user.repo';
import { AuthMethodRepository } from '../repositories/auth-method.repo';
import { AuthLineController } from './line/line.controller';
import { LineCodeVerifierService } from './line/line-code-verifier.service';
import { LineAuthService } from './line/line-auth.service';
import { LineTokenService } from './line/line-token.service';
import { LineUserService } from './line/line-user.service';
import { HttpModule } from '@nestjs/axios';
import { SocialAuthService } from './line/social-auth.service';
import { TokenService } from './line/token.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([AuthPassword, AuthMethod]),
    UsersModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const auth = configService.get<TAuthConfig>('auth');
        return {
          privateKey: auth?.accessTokenPrivateKey,
          publicKey: auth?.accessTokenPublicKey,
          signOptions: {
            algorithm: 'RS256',
            issuer: 'hitachi-ah-member-backend',
            keyid: 'local',
            expiresIn: auth?.accessTokenExpiresIn || '15m',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController,AuthLineController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    UserRepository,
    AuthMethodRepository,
    SocialAuthService,
    TokenService,

    LineAuthService,
    LineCodeVerifierService,
    LineTokenService,
    LineUserService
  ],
  exports: [AuthService, JwtStrategy, RefreshTokenStrategy,SocialAuthService,TokenService],
})
export class AuthModule {}
