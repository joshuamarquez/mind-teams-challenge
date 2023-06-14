import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { devConfig, testConfig } from './config/database.config'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WinstonModule } from 'nest-winston';
import { UsersController } from './users/users.controller';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { LogsController } from './logs/logs.controller';
import { LogsModule } from './logs/logs.module';

const dbConfig = process.env.NODE_ENV == 'test' ? testConfig : devConfig;

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), WinstonModule.forRoot({}), AuthModule, UsersModule, AccountModule, LogsModule],
  controllers: [AppController, UsersController, AccountController, LogsController],
  providers: [AppService, Logger],
})
export class AppModule {}
