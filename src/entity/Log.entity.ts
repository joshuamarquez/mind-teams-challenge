import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({name : 'user_id'})
  user: User

  @ManyToOne(() => Account, account => account.id)
  @JoinColumn({name : 'account_id'})
  account: Account
}
