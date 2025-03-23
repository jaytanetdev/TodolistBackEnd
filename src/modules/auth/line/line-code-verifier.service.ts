import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { randomBytes, createHash } from 'node:crypto'

interface CodeVerifierEntry {
  codeVerifier: string
  createdAt: number
  nonce: number
}

@Injectable()
export class LineCodeVerifierService {
  // TODO: move to database
  private codeVerifierMap = new Map<string, CodeVerifierEntry>()

  generateCodeVerifier(): string {
    return randomBytes(32).toString('base64url')
  }

  generateCodeChallenge(codeVerifier: string): string {
    return createHash('sha256').update(codeVerifier).digest('base64url')
  }

  storeCodeVerifier(id: string, codeVerifier: string, nonce: number): void {
    this.codeVerifierMap.set(id, {
      codeVerifier,
      createdAt: Date.now(),
      nonce,
    })
  }

  getAndDeleteCodeVerifier(id: string): string {
    const codeVerify = this.codeVerifierMap.get(id)
    if (!codeVerify) {
      throw new UnprocessableEntityException('Invalid code verifier')
    }
    this.codeVerifierMap.delete(id)
    return codeVerify.codeVerifier
  }
}
