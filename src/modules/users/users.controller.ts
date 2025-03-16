import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Register User' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  
  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ success: boolean; page: number; limit: number; result: User[]; totalItemSize: number }> {
    const { result, totalItemSize } = await this.usersService.findAll(page, limit);
  
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
