import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repo';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersService,UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
