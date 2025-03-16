import { ClsStore } from 'nestjs-cls'

export interface ClsRequestStore extends ClsStore {
  initId: string
  ipAddress: string
  user: {
    userId: string
    firstName: string
    middleName: string
    lastName: string
    email: string
    methodType: string
    isActive: boolean
  }
}
