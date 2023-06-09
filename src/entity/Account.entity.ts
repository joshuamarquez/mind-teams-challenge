import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Team } from './Team.entity';
 
@Entity('Account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  name: string;
 
  @Column({ unique: true })
  client: string;

  @Column()
  owner: string;

  // @OneToMany(() => Team, team => team.account)
  // teams: Team[]
}
