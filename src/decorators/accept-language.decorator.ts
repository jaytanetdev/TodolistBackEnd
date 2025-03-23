import {
  createParamDecorator,
  ExecutionContext,
  NotAcceptableException,
} from '@nestjs/common'

export const DEFAULT_LANGUAGE = 'en'
export const LANGUAGE_WHITELIST = ['en', 'th', 'tc', 'sc', 'vi']

export const AcceptLanguage = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const acceptLanguage = request.headers['accept-language']

    if (!acceptLanguage) {
      return DEFAULT_LANGUAGE
    }

    // Parse the accept-language header and get the first preferred language
    const preferredLanguage = acceptLanguage
      .split(',')?.[0]
      ?.trim?.()
      ?.toLowerCase?.()
      ?.split?.('-')?.[0] // Handle cases like 'en-US' -> 'en'

    // Check if the language is in the whitelist
    if (LANGUAGE_WHITELIST.includes(preferredLanguage)) {
      return preferredLanguage
    }

    throw new NotAcceptableException(
      `Language '${preferredLanguage}' is not supported`,
    )
  },
)
