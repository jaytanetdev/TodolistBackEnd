import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'

export const Timezone = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const timezone = request.headers.timezone

    if (!timezone) {
      throw new BadRequestException('Timezone header is required')
    }

    return timezone as string
  },
)
