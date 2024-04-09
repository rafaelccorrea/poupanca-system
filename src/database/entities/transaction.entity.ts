import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Savings } from './savings.entity';
import { TransactionType } from '../../services/transaction/types/enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => Savings, (savings) => savings.transactions)
  savings: Savings;
}
