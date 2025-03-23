import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { TAuthConfig } from 'src/config/auth.config'
import ICurrentUser from '../interfaces/current-user.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly configSvc: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        const authConfig = this.configSvc.get<TAuthConfig>('auth')

        if (!authConfig || !authConfig.cookie || !authConfig.cookie.access || !authConfig.cookie.access.name) {
          throw new Error("Auth configuration is missing or invalid");
        }
        
        const cookie = req.signedCookies?.[authConfig.cookie.access.name] ?? "";
        
        if (!cookie)
          throw new UnauthorizedException({
            message: 'no access token provided',
            cause: 'JsonWebTokenError',
            statusCode: 401,
          })
        return cookie
      },
      secretOrKey: configSvc.get<TAuthConfig>('auth')?.accessTokenPublicKey,
      ignoreExpiration: false,
      algorithms: ['RS256'],
      passReqToCallback: true,
    })
  }

  async validate(_: any, payload: any): Promise<ICurrentUser> {
    if (!payload) {
      throw new UnauthorizedException({
        message: 'invalid token',
        cause: 'JsonWebTokenError',
        statusCode: 401,
      })
    }
    
    return {
      id: payload.sub,
      displayName: payload.name,
      methodType: payload.method,
      issueAt: payload.iat ? new Date(payload.iat * 1000) : new Date (),
      loginAt: payload.auth_time
        ? new Date(payload.auth_time * 1000)
        : undefined,
    }
  }
}
