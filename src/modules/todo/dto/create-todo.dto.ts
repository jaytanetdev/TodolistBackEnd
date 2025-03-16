import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDefined,
  IsISO8601,
} from 'class-validator';
import { BaseResponse } from 'src/core/base-response';
import { assignIgnoreUndefined } from 'src/utils/object';

export class CreateTodoRequestDto {
  @ApiProperty({
    example: 'cffab042-49ed-43dc-80fa-7ed78c79eacd',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  uuidUser: string;

  @ApiProperty({
    example: 'กินข้าว',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  title: string;

  @ApiProperty({
    example: "2025-01-01T00:00:00.000Z",
    required: true,
  })
  @IsNotEmpty()
  dateTodoStart: Date;


  @ApiProperty({
    example:"2025-01-01T23:59:59.999Z",
    required: true,
  })
  @IsNotEmpty()
  dateTodoEnd: Date;

}

export class CreateTodoResultDto {
  @ApiProperty({
    example: '79E93CEA-A31B-45FD-9455-8E98C1C5972F',
    type: String,
  })
  @Expose()
  id: string

  @ApiProperty({
    example: '79E93CEA-A31B-45FD-9455-8E98C1C5972F',
    type: String,
  })
  @Expose()
  uuidUser: string

  @ApiProperty({
    example: 'กินข้าว',
    type: String,
  })
  @Expose()
  title: string

  @ApiProperty({
    example: "2025-01-01T00:00:00.000Z",
    type: Date,
  })
  @Expose()
  dateTodoStart: Date

  @ApiProperty({
    example:"2025-01-01T00:00:00.000Z",
    type: Date,
  })
  @Expose()
  dateTodoEnd: Date

}

export class CreateTodoResponseDto extends BaseResponse {
  @ApiProperty({
    type: CreateTodoResultDto,
  })
  @Expose()
  @Type(() => CreateTodoResultDto)
  result: CreateTodoResultDto

  constructor(partial?: Partial<CreateTodoResponseDto>) {
    super(partial)
    assignIgnoreUndefined(this, partial)
  }
}
