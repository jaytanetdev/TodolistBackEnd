import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDefined,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  firstName: string;

  @ApiProperty({
    example: 'seena',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  lastName: string;

  @ApiProperty({
    example: 'jaytanet',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'username can only contain letters (A-Z, a-z), digits (0-9)',
  })
  username: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;
}

// export class CreateUsersDto {
//   @ApiProperty({
//     example: '79E93CEA-A31B-45FD-9455-8E98C1C5972F',
//     type: String,
//   })
//   @Expose()
//   id: string

//   @ApiProperty({
//     example: 'RZ-D10WF',
//     type: String,
//   })
//   @Expose()
//   modelNumber: string

//   @ApiProperty({
//     example: 'SNKG18YTH',
//     type: String,
//   })
//   @Expose()
//   serialNumber: string

//   @ApiProperty({
//     example: '2024-10-14T09:28:58.213Z',
//     type: Date,
//   })
//   @Expose()
//   purchaseDate: Date

//   @ApiProperty({
//     example: 'The Mall Lifestore Bangkapi',
//     type: String,
//   })
//   @Expose()
//   purchaseLocation: string

//   @ApiProperty({
//     type: Number,
//   })
//   @Expose()
//   reviewRate: number

//   @ApiProperty({
//     type: String,
//   })
//   @Expose()
//   reviewContent: string
// }
