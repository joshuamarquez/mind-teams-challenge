import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from './Account.entity';
 
@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  name: string;
 
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: ['super', 'admin', 'user'] })
  role: string

  // @JoinColumn()
  // account: Account

  @BeforeInsert()
  async hashPasswordBeforeInsert(): Promise<void> {
    if (!!this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
