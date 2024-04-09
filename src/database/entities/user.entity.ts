import { Entity, PrimaryColumn, Column, Unique, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Savings } from './savings.entity';
import { Transaction } from './transaction.entity';
import { SavingsSubscription } from './savings-subscription.entity';

@Entity()
@Unique(['email', 'cellphone', 'cpf'])
export class User {
  @PrimaryColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  cellphone: string;

  @Column()
  cpf: string;

  @OneToMany(() => Savings, (savings) => savings.owner)
  savings: Savings[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => SavingsSubscription, (subscription) => subscription.user)
  savingsSubscriptions: SavingsSubscription[];
}
