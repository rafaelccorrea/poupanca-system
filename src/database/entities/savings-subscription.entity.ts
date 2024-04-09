import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Savings } from './savings.entity';

@Entity()
export class SavingsSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.savingsSubscriptions)
  user: User;

  @ManyToOne(() => Savings, (savings) => savings.subscriptions)
  savings: Savings;
}
