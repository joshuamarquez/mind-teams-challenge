import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entity/Account.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

export interface AccountInterface {
    id?: number,
    name: string
}

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<AccountInterface>
    ) { }

    findOneBy(where: FindOptionsWhere<AccountInterface>): Promise<AccountInterface> {
        return this.accountRepository.findOneBy(where)
    }

    find(): Promise<AccountInterface[]> {
        return this.accountRepository.find();
    }

    create(account: AccountInterface): Promise<AccountInterface> {
        return this.accountRepository.save(
            this.accountRepository.create(account)
        );
    }

    async update(id: number, data: AccountInterface): Promise<AccountInterface> {
        const account = await this.accountRepository.findOneBy({ id });

        if (!account) {
            throw new NotFoundException();
        }

        return this.accountRepository.save(Object.assign(account, {
            name: data.name
        }));
    }

    async delete(id: number): Promise<any> {
        const account = await this.accountRepository.findOneBy({ id });

        if (!account) {
            throw new NotFoundException();
        }

        return this.accountRepository.delete(id);
    }
}
