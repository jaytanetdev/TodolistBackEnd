import { Controller, Get, Query, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { TAuthConfig } from 'src/config/auth.config'
import { TAppConfig } from 'src/config/app.config'
import { LineAuthService } from './line-auth.service'
import { SocialAuthService } from './social-auth.service'
import { AuthController } from '../auth.controller'

@ApiTags('Authentication')
@Controller('/auth')
export class AuthLineController {
  constructor(
    private readonly lineAuthSvc: LineAuthService,
    private readonly socialAuthService: SocialAuthService,
    private readonly configSvc: ConfigService,
  ) {}

  @Get('/line-login')
  async login(
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = this.lineAuthSvc.getLogin()
    response.redirect(result.url)
  }

  @Get('/callback/line')
  @ApiOperation({
    summary: 'Redirect to line login',
  })
  async lineCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (error) {
      const appConfig = this.configSvc.get<TAppConfig>('app')
      const redirectUri = `${appConfig!.frontendHost}/login?error=${error}&error_description=${errorDescription}`
      response.redirect(redirectUri)
      return
    }

    const { idTokenPayload } = await this.lineAuthSvc.handleCallback({
      code,
      state,
    })

    const result = await this.socialAuthService.lineCallback({
      name: idTokenPayload.name,
      profilePicture: idTokenPayload.picture,
      userId: idTokenPayload.sub,
    })

    const authConfig = this.configSvc.get<TAuthConfig>('auth')

    AuthController.setCookie(response, {
      name: authConfig!.cookie.refresh.name,
      value: result.refreshToken,
      maxAge: authConfig!.cookie.refresh.maxAge,
    })

    AuthController.setCookie(response, {
      name: authConfig!.cookie.access.name,
      value: result.accessToken,
      maxAge: authConfig!.cookie.access.maxAge,
    })

    response.redirect(result.redirectUri)
  }
}
