import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/User.entity';
import * as bcrypt from 'bcrypt';

export interface UserInterface {
  id?: string,
  name: string,
  email: string,
  password: string
  role: string
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<UserInterface>
  ) { }

  onApplicationBootstrap(): any {
    this.findOne('super@gmail.com').then((user: UserInterface) : Promise<UserInterface | string> => {
      if (!user) {
        return this.create({
          name: 'super admin',
          email: 'super@gmail.com',
          password: 'mypass1234',
          role: 'super'
        });
      }

      return Promise.resolve('user exists!');
    })
      .then(console.log)
      .catch(console.error);
  }

  findOne(email: string): Promise<UserInterface | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  create(user: UserInterface): Promise<UserInterface> {
    return this.userRepository.save(
      this.userRepository.create(user)
    );
  }

  // addToAccount(id, accountId): Promise<UserInterface> {
  //   return this.userRepository.update(id, {  });
  // }

  async update(id: string, data: UserInterface): Promise<any> {
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
}
