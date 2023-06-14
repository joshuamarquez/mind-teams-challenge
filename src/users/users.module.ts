import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/User.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccountModule } from '../account/account.module';
import { Log } from '../entity/Log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AccountModule, TypeOrmModule.forFeature([Log])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
