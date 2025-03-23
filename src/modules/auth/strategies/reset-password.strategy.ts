import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { TAuthConfig } from 'src/config/auth.config'

@Injectable()
export class ResetPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-reset-password',
) {
  constructor(protected readonly configSvc: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        const cookie = req.signedCookies['ResetPasswordToken']
        if (!cookie)
          throw new UnauthorizedException({
            message: 'no token provided',
            cause: 'JsonWebTokenError',
            statusCode: 401,
          })
        return cookie
      },
      secretOrKey: configSvc.get<TAuthConfig>('auth')?.resetPasswordTokenSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
      algorithms: ['HS512'],
    })
  }

  async validate(req: Request, payload: any) {
    const resetPasswordToken = req.signedCookies['ResetPasswordToken']

    return {
      id: payload.sub,
      jwtId: payload.jti,
      methodType: payload.method,
      issueAt: payload.iat ? new Date(payload.iat * 1000) : undefined,
      resetPasswordToken,
    }
  }
}
