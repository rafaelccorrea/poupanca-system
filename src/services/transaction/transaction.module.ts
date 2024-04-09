import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from '~/database/entities/transaction.entity';
import { Approval } from '~/database/entities/approval.entity';
import { SavingsSubscription } from '~/database/entities/savings-subscription.entity';
import { Savings } from '~/database/entities/savings.entity';
import { SavingsService } from '../savings/savings.service';
import { SavingsSubscriptionService } from '../subscriptions/savings-subscription.service';
import { UserService } from '../user/user.service';
import { User } from '~/database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      User,
      Savings,
      Approval,
      SavingsSubscription,
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    SavingsService,
    SavingsSubscriptionService,
    UserService,
  ],
})
export class TransactionModule {}
