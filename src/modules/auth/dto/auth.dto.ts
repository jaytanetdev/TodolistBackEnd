import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseResponse } from 'src/core/base-response';
import { assignIgnoreUndefined } from 'src/utils/object';

export class AuthDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd123',
    description: 'User password',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  lastName: string;
}

export class LoginRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd123',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponseAutuDto {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'jay' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'limsumang' })
  @Expose()
  lastName: string;
}


export class LoginResponseResulttDto {
  @ApiProperty({
    example: 'Access token',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: 'Refresh token',
  })
  @Expose()
  refreshToken: string;

  @ApiProperty({
    example: 'user data',
    type:UserResponseAutuDto
  })
  @Expose()
  @Type(() => UserResponseAutuDto)
  user: UserResponseAutuDto;
}



export class LoginResponseDto extends BaseResponse {
  @ApiProperty({
    type: LoginResponseResulttDto,
  })
  @Expose()
  @Type(() => LoginResponseResulttDto)
  result: LoginResponseResulttDto;

  constructor(partial?: Partial<LoginResponseDto>) {
    super(partial);
    assignIgnoreUndefined(this, partial);
  }
}
