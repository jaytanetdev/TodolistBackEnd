import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNotificationRequestDto {
  @ApiProperty({
    example: 'U0e7d40aef7be5fbbcce1a4f9e873880e',
    required: true,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'ทดสอบ',
    required: true,
  })
  @IsNotEmpty()
  message: string;
}
