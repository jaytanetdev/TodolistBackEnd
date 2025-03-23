import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreatUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User Created Successfully',
    type: CreatUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreatUserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return new CreatUserResponseDto(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    success: boolean;
    page: number;
    limit: number;
    result: User[];
    totalItemSize: number;
  }> {
    const { result, totalItemSize } = await this.usersService.findAll(
      page,
      limit,
    );

    return {
      success: true,
      page,
      limit,
      result,
      totalItemSize,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User by id' })
  async findOne(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
