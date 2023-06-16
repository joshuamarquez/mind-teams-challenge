import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from '../entity/Log.entity';
import { UserClass } from '../users/users.service';
import { AccountInterface } from '../account/account.service';
import { Between, FindManyOptions, Like, Repository } from 'typeorm';
import { addYears, subYears } from 'date-fns';

export interface LogInterface {
    id?: number;
    startDate: Date;
    endDate: Date;
    user: UserClass;
    account: AccountInterface;
}

export interface LogQueryFilter {
    accountName: string;
    userName: string;
    startDate: Date
    endDate: Date
}

export const AfterDate = (date: Date) => Between(date, addYears(date, 100));
export const BeforeDate = (date: Date) => Between(subYears(date, 100), date);

@Injectable()
export class LogsService {
    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<LogInterface>
    ) { }

    async find(query: LogQueryFilter): Promise<LogInterface[]> {
        const options: FindManyOptions<LogInterface> = { relations: { account: true, user: true }, where: {} };

        if (query.accountName) {
            options.relations = { ...options.relations, account: true };
            options.where = { ...options.where, account: { name: Like(`%${query.accountName}%`) } };
        }

        if (query.userName) {
            options.relations = { ...options.relations, user: true };
            options.where = { ...options.where, user: { name: Like(`%${query.userName}%`) } };
        }

        if (query.startDate) {
            options.where = { ...options.where, startDate: AfterDate(new Date(query.startDate)) };
        }

        if (query.endDate) {
            options.where = { ...options.where, endDate: BeforeDate(new Date(query.endDate)) };
        }

        options.order = { startDate: { direction: 'DESC' } };

        return this.logRepository.find(options);
    }
}
