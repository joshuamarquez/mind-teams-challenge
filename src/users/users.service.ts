import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsRelations, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { User } from '../entity/User.entity';
import * as bcrypt from 'bcrypt';
import { AccountInterface, AccountService } from '../account/account.service';
import { Exclude } from 'class-transformer';
import { Log } from '../entity/Log.entity';
import { LogInterface } from '../logs/logs.service';

export class UserClass {
  id?: number;
  name: string;
  email: string;

  @Exclude()
  password: string;

  role: string;
  account: AccountInterface
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<UserClass>,
    private accountService: AccountService,
    @InjectRepository(Log)
    private logRepository: Repository<LogInterface>,
  ) { }

  async onApplicationBootstrap(): Promise<any> {
    let account = await this.accountService.findOneBy({ name: 'super admin' });

    if (!account) {
      account = await this.accountService.create({
        name: 'super admin'
      });
    }

    const user = await this.findOne('super@gmail.com');

    if (!user) {
      return this.create({
        name: 'super admin',
        email: 'super@gmail.com',
        password: 'mypass1234',
        role: 'super',
        account
      });
    }

    console.log('user exists!');
  
    return Promise.resolve();
  }

  findOne(email: string): Promise<UserClass | undefined> {
    return this.userRepository.findOne({ where: { email }, relations: { account: true } });
  }

  find(where?: FindOptionsWhere<UserClass>, relations?: FindOptionsRelations<UserClass>): Promise<UserClass[]> {
    return this.userRepository.find({ where, relations });
  }

  create(user: UserClass): Promise<UserClass> {
    return this.userRepository.save(
      this.userRepository.create(user)
    );
  }

  async addToAccount(id: number, accountId: number): Promise<any> {
    const account = await this.accountService.findOneBy({ id: accountId });
    if (!account) {
      throw new NotFoundException('account not found');
    }

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // add user to provided account
    await this.userRepository.update(id, { account });

    // update previous log record if exists
    const previousLog = await this.logRepository.findOneBy({ user, account: user.account, endDate: IsNull() });
    if (previousLog) {
      await this.logRepository.update(previousLog.id, { endDate: new Date() });
    }

    // log new user-account relation
    return this.logRepository.save(
      this.logRepository.create({
        startDate: new Date,
        user,
        account
      })
    );
  }

  async update(id: number, data: UserClass): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    if (!!data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }

    return this.userRepository.save(Object.assign(user, {
      name: data.name,
      email: data.email,
      password: data.password
    }));
  }

  async delete(id: number): Promise<any> {
    const account = await this.userRepository.findOneBy({ id });

    if (!account) {
      throw new NotFoundException();
    }

    return this.userRepository.delete(id);
  }
}
