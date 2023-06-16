import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entity/Account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/User.entity';
import { Log } from 'src/entity/Log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Account]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Log])],
    providers: [AccountService, UsersService],
    exports: [AccountService],
    controllers: [AccountController],
})
export class AccountModule { }
