import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { Log } from '../entity/Log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [LogsController],
  exports: [LogsService],
  providers: [LogsService]
})
export class LogsModule {}
