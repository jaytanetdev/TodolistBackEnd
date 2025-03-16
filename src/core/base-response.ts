import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export abstract class BaseResponse {
  @ApiProperty({
    example: true,
    type: Boolean,
  })
  @Expose()
  success: boolean

  constructor(partial: any) {
    this.success = partial?.success ?? true
  }
}
