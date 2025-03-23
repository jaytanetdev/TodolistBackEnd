import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDefined,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';
import { BaseResponse } from 'src/core/base-response';
import { assignIgnoreUndefined } from 'src/utils/object';

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
    message: 'email can only contain letters (A-Z, a-z), digits (0-9)',
  })
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;
}


export class CreateUserResultDto {
  @ApiProperty({
    example: '79E93CEA-A31B-45FD-9455-8E98C1C5972F',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'jay',
    type: String,
  })
  @Expose()
  firstName: string;

  
  @ApiProperty({
    example: 'limsumang',
    type: String,
  })
  @Expose()
  lastName: string;


  @ApiProperty({
    example: 'jaytanet',
    type: String,
  })
  @Expose()
  email: string;

}

export class CreatUserResponseDto extends BaseResponse {
  @ApiProperty({
    type: CreateUserResultDto,
  })
  @Expose()
  @Type(() => CreateUserResultDto)
  result: CreateUserResultDto

  constructor(partial?: Partial<CreatUserResponseDto>) {
    super(partial)
    assignIgnoreUndefined(this, partial)
  }
}

