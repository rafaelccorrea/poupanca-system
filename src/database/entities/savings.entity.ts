import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { SavingsSubscription } from './savings-subscription.entity';

@Entity()
export class Savings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.savings)
  owner: User;

  @OneToMany(() => Transaction, (transaction) => transaction.savings)
  transactions: Transaction[];

  @OneToMany(() => SavingsSubscription, (subscription) => subscription.savings)
  subscriptions: SavingsSubscription[];
}
