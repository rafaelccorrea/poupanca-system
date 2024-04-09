import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { Savings } from '~/database/entities/savings.entity';
import { SavingsSubscription } from '~/database/entities/savings-subscription.entity';
import { SavingsSubscriptionService } from '../subscriptions/savings-subscription.service';
import { UserService } from '../user/user.service';
import { User } from '~/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Savings, SavingsSubscription, User])],
  controllers: [SavingsController],
  providers: [SavingsService, SavingsSubscriptionService, UserService],
})
export class SavingsModule {}
