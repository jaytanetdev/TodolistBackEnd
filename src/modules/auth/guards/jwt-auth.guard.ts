import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IGNORE_EXPIRES_KEY } from '../decorators/ignore-expires.decorator';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContextHost) {
    if (info instanceof TokenExpiredError) {
      const ignoreExpires = this.reflector.getAllAndOverride<boolean>(
        IGNORE_EXPIRES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!ignoreExpires) {
        throw new UnauthorizedException({
          message: 'Token has expired',
          cause: 'TokenExpiredError',
          statusCode: 401,
        }); // ✅ ส่ง 401 Unauthorized
      }
    } else if (info instanceof Error) {
      throw info;
    }
    if (err) {
      throw err;
    }
    return user;
  }
}
