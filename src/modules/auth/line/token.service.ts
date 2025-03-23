import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TAuthConfig } from 'src/config/auth.config'
import { v4 as uuidV4 } from 'uuid'
import { AuthMethodEnum } from '../entities/auth-method.entity'

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name)
  constructor(
    private readonly jwtSvc: JwtService,
    private readonly configSvc: ConfigService,
  ) {}

  async generateLoginCredential(
    userId: string,
    methodType: AuthMethodEnum,
    displayName: string,
  ) {
    this.logger.log(
      `[${this.generateLoginCredential.name}] userId=${userId} methodType=${methodType}`,
    )

    const refreshTokenId = uuidV4().toUpperCase()
    const accessTokenId = uuidV4().toUpperCase()

    const refreshToken = await this.generateRefreshToken({
      userId,
      displayName,
      jwtId: refreshTokenId,
      methodType,
    })

    const accessToken = await this.generateAccessToken({
      userId,
      displayName,
      jwtId: accessTokenId,
      methodType,
      authTime: new Date(),
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async generateAccessToken(payload: {
    userId: string
    displayName: string
    jwtId: string
    methodType: AuthMethodEnum
    authTime: Date
  }) {
    this.logger.log(
      `[${this.generateAccessToken.name}] userId=${payload.userId} methodType=${payload.methodType}`,
    )

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
    )
  }

  async generateRefreshToken(payload: {
    userId: string
    displayName: string
    jwtId: string
    methodType: AuthMethodEnum
  }) {
    this.logger.log(
      `[${this.generateRefreshToken.name}] userId=${payload.userId} methodType=${payload.methodType}`,
    )

    const authConfig = this.configSvc.get<TAuthConfig>('auth')
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
    )
  }

  async generateResetPasswordToken(payload: {
    userId: string
    jwtId: string
    methodType: AuthMethodEnum
  }) {
    this.logger.log(
      `[${this.generateResetPasswordToken.name}] userId=${payload.userId} methodType=${payload.methodType}`,
    )

    const authConfig = this.configSvc.get<TAuthConfig>('auth')
    return this.jwtSvc.signAsync(
      {
        method: AuthMethodEnum.PASSWORD,
      },
      {
        subject: payload.userId,
        secret: authConfig!.resetPasswordTokenSecret,
        jwtid: payload.jwtId,
        keyid: 'none',
        algorithm: 'HS512',
      },
    )
  }

  async verifyAccessToken(accessToken: string) {
   

    const result = await this.jwtSvc.verifyAsync(accessToken)
    return result
  }

  async verifyRefreshToken(refreshToken: string) {
 

    const authConfig = this.configSvc.get<TAuthConfig>('auth')

    const result = await this.jwtSvc.verifyAsync(refreshToken, {
      algorithms: ['HS512'],
      ignoreExpiration: false,
      secret: authConfig!.refreshTokenSecret,
    })
    return result
  }
}
