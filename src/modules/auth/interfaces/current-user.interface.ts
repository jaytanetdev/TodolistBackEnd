
export enum AuthMethodEnum {
  PASSWORD = 'PASSWORD',
  SOCIAL = 'SOCIAL',
}

export interface ICurrentUser {
  id: string
  methodType: AuthMethodEnum
  issueAt: Date
  displayName: string
  loginAt?: Date
}

export interface IResetPasswordUser {
  id: string
  jwtId: string
  methodType: AuthMethodEnum
  issueAt: Date
  resetPasswordToken: string
}

export default ICurrentUser
