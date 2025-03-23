import { HttpService } from '@nestjs/axios'
import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosError } from 'axios'
import { lastValueFrom } from 'rxjs'
import { TLineConfig } from 'src/config/line.config'

@Injectable()
export class LineTokenService {
  private readonly logger = new Logger(LineTokenService.name)

  constructor(
    private readonly configSvc: ConfigService,
    private readonly httpSvc: HttpService,
  ) {}

  async issueToken(params: {
    code: string
    redirectUri: string
    codeVerifier: string
  }) {
    this.logger.log(`[${this.issueToken.name}] code=${params.code}`)

    const url = 'https://api.line.me/oauth2/v2.1/token'
    const lineConfig = this.configSvc.get<TLineConfig>('line')

    const request = this.httpSvc.post<{
      access_token: string
      token_type: string
      refresh_token: string
      expires_in: number
      scope: string
      id_token: string
    }>(
      url,
      {
        grant_type: 'authorization_code',
        code: params.code,
        redirect_uri: params.redirectUri,
        client_id: lineConfig!.channelId,
        client_secret: lineConfig!.channelSecret,
        code_verifier: params.codeVerifier,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    try {
      const response = await lastValueFrom(request)
      return response.data
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new BadRequestException(
          e.response!.data.error,
          e.response!.data.error_description,
        )
      }
      throw e
    }
  }

  async verifyIdToken(idToken: string) {
  

    const url = 'https://api.line.me/oauth2/v2.1/verify'
    const lineConfig = this.configSvc.get<TLineConfig>('line')
    const request = this.httpSvc.post<{
      iss: string
      sub: string
      aud: string
      exp: number
      iat: number
      nonce: string
      amr: string[]
      name: string
      picture: string
    }>(
      url,
      {
        id_token: idToken,
        client_id: lineConfig!.channelId,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    try {
      const result = await lastValueFrom(request)
      return result.data
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new UnauthorizedException(
          e.response!.data.error,
          e.response!.data.error_description,
        )
      }
      throw e
    }
  }

  async verifyAccessToken(accessToken: string) {


    const url = 'https://api.line.me/oauth2/v2.1/verify'
    const request = this.httpSvc.get<{
      scope: string
      client_id: string
      expires_in: number
    }>(url, {
      params: {
        access_token: accessToken,
      },
    })

    try {
      const result = await lastValueFrom(request)
      return result.data
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new UnauthorizedException(
          e.response!.data.error,
          e.response!.data.error_description,
        )
      }
      throw e
    }
  }

  async refreshToken(refreshToken: string) {
 
    const url = 'https://api.line.me/oauth2/v2.1/token'
    const lineConfig = this.configSvc.get<TLineConfig>('line')

    const request = this.httpSvc.post<{
      token_type: string
      scope: string
      access_token: string
      expires_in: number
      refresh_token: number
    }>(
      url,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: lineConfig!.channelId,
        client_secret: lineConfig!.channelSecret,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    try {
      const result = await lastValueFrom(request)
      return result.data
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new UnauthorizedException(
          e.response!.data.error,
          e.response!.data.error_description,
        )
      }
      throw e
    }
  }

  async revokeAccessToken(accessToken: string) {
 
    const url = 'https://api.line.me/oauth2/v2.1/revoke'
    const lineConfig = this.configSvc.get<TLineConfig>('line')

    const request = this.httpSvc.post(
      url,
      {
        client_id: lineConfig!.channelId,
        client_secret: lineConfig!.channelSecret,
        access_token: accessToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    try {
      const result = await lastValueFrom(request)
      return result.data
    } catch (e) {
      this.logger.error('Failed to revoke access token', e)
      throw e
    }
  }
}
