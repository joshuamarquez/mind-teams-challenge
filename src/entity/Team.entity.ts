import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';
 
@Entity('Team')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  name: string;

  @Column()
  account: string;

  // @OneToMany(() => User, user => user.account)
  // users: User[]
}
