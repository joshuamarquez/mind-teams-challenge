import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { devConfig } from './config/database.config'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WinstonModule } from 'nest-winston';
import { UsersController } from './users/users.controller';

@Module({
  imports: [TypeOrmModule.forRoot(devConfig), WinstonModule.forRoot({}), AuthModule, UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService, Logger ],
})
export class AppModule {}
