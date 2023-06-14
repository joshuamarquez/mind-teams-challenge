import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { Account } from './Account.entity';
 
@Entity('Log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @OneToOne(() => User, user => user.id)
  @JoinColumn({name : 'user_id'})
  user: User

  @OneToOne(() => Account, account => account.id)
  @JoinColumn({name : 'account_id'})
  account: Account
}
