import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'

export const Locale = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const locale = request.headers.locale

    if (!locale) {
      throw new BadRequestException('Locale header is required')
    }

    return locale as string
  },
)
