import { SetMetadata } from '@nestjs/common'

export const IGNORE_EXPIRES_KEY = 'ignoreExpires'
export const IgnoreExpires = () => SetMetadata(IGNORE_EXPIRES_KEY, true)
