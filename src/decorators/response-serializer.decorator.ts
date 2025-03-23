import {
  applyDecorators,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common'

export function ResponseSerializer() {
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
      exposeUnsetFields: true,
    }),
  )
}
