import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { Log } from './Log.entity';
 
@Entity('Account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  name: string;

  @OneToMany(() => User, user => user.account)
  users: User[]

  @OneToMany(() => Log, log => log.account)
  logs: Log[]
}
