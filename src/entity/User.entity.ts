import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from './Account.entity';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Log } from './Log.entity';
 
@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  name: string;
 
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ enum: ['super', 'admin', 'user'] })
  role: string

  @ManyToOne(() => Account, account => account.id, { nullable: true })
  @JoinColumn({name : 'account_id'})
  account: Account

  @OneToMany(() => Log, log => log.user)
  logs: Log[]

  @BeforeInsert()
  async hashPasswordBeforeInsert(): Promise<void> {
    if (!!this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
