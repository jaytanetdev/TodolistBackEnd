import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { IGNORE_EXPIRES_KEY } from '../decorators/ignore-expires.decorator'

@Injectable()
export class ResetPasswordGuard extends AuthGuard('jwt-reset-password') {
  constructor(private reflector: Reflector) {
    super()
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContextHost) {
    if (info instanceof TokenExpiredError) {
      const ignoreExpires = this.reflector.getAllAndOverride<boolean>(
        IGNORE_EXPIRES_KEY,
        [context.getHandler(), context.getClass()],
      )
      if (!ignoreExpires) {
        throw info
      }
    } else if (info instanceof Error) {
      throw info
    }
    if (err) {
      throw err
    }
    return user
  }
}
