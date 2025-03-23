import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'node:crypto'
import { TAppConfig } from 'src/config/app.config'
import { encodeBase64Url, decodeBase64Url } from 'src/utils/base64'
import { LineCodeVerifierService } from './line-code-verifier.service'
import { TLineConfig } from 'src/config/line.config'
import { LineUserService } from './line-user.service'
import { LineTokenService } from './line-token.service'
@Injectable()
export class LineAuthService {
  private readonly logger = new Logger(LineAuthService.name)

  constructor(
    private readonly configSvc: ConfigService,
    private readonly codeVerifierSvc: LineCodeVerifierService,
    private readonly tokenSvc: LineTokenService,
    private readonly userSvc: LineUserService,
  ) {}

  getLogin() {
    const lineConfig = this.configSvc.get<TLineConfig>('line')
    const appConfig = this.configSvc.get<TAppConfig>('app')
    const redirectUri = `${appConfig!.backendHost}/api/v1/auth/callback/line`
    const codeVerifier = this.codeVerifierSvc.generateCodeVerifier()
    const codeChallenge =
      this.codeVerifierSvc.generateCodeChallenge(codeVerifier)
    const codeVerifierId = randomUUID()

    const stateObj = JSON.stringify({
      codeVerifierId,
    })

    const state = encodeBase64Url(stateObj)
    const nonce = Date.now()
    const codeChallengeMethod = 'S256'

    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
      lineConfig!.channelId
    }&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&state=${state}&scope=profile%20openid&nonce=${nonce}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`

    this.codeVerifierSvc.storeCodeVerifier(codeVerifierId, codeVerifier, nonce)

    return {
      url,
    }
  }

  async handleCallback(params: { code: string; state: string }) {
 
    const appConfig = this.configSvc.get<TAppConfig>('app')
    const redirectUri = `${appConfig!.backendHost}/api/v1/auth/callback/line`
    const stateObj = JSON.parse(decodeBase64Url(params.state))

    const codeVerifier = this.codeVerifierSvc.getAndDeleteCodeVerifier(
      stateObj.codeVerifierId,
    )

    const tokenResponse = await this.tokenSvc.issueToken({
      code: params.code,
      redirectUri,
      codeVerifier,
    })

    const [idTokenPayload, userInfo] = await Promise.all([
      this.tokenSvc.verifyIdToken(tokenResponse.id_token),
      this.userSvc.getUserInfo(tokenResponse.access_token),
    ])
  
   
    return {
      tokens: tokenResponse,
      idTokenPayload,
      userInfo,
    }
  }

  async refreshToken(refreshToken: string) {
    return this.tokenSvc.refreshToken(refreshToken)
  }

  async revokeAccess(accessToken: string, channelAccessToken: string) {
    await Promise.all([
      this.tokenSvc.revokeAccessToken(accessToken),
      this.userSvc.deAuthorize(accessToken, channelAccessToken),
    ])
  }

  async verifyAccessToken(accessToken: string) {
    return this.tokenSvc.verifyAccessToken(accessToken)
  }

  async getFriendshipStatus(accessToken: string) {
    return this.userSvc.getFriendshipStatus(accessToken)
  }
}
