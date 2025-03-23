import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { TAuthConfig } from 'src/config/auth.config'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(protected readonly configSvc: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        const authConfig = this.configSvc.get<TAuthConfig>('auth')
        const cookie = req.signedCookies[authConfig!.cookie.refresh.name]
        if (!cookie)
          throw new UnauthorizedException({
            message: 'no token provided',
            cause: 'JsonWebTokenError',
            statusCode: 401,
          })
        return cookie
      },
      secretOrKey: configSvc.get<TAuthConfig>('auth')?.refreshTokenSecret!,
      ignoreExpiration: false,
      passReqToCallback: true,
      algorithms: ['HS512'],
    })
  }

  async validate(req: Request, payload: any) {
    const authConfig = this.configSvc.get<TAuthConfig>('auth')


    if (!authConfig || !authConfig.cookie || !authConfig.cookie.refresh) {
      throw new Error("Auth configuration is missing or invalid");
    }
    
    const refreshToken = req.signedCookies?.[authConfig.cookie.refresh.name] ?? "";
    

    return {
      id: payload.sub,
      displayName: payload.name,
      methodType: payload.method,
      issueAt: payload.iat ? new Date(payload.iat * 1000) : undefined,
      loginAt: payload.iat ? new Date(payload.iat * 1000) : undefined,
      refreshToken,
    }
  }
}
