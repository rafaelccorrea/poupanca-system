import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsSubscription } from '~/database/entities/savings-subscription.entity';
import { UserService } from '../user/user.service';
import { SavingsSubscriptionService } from './savings-subscription.service';
import { User } from '~/database/entities/user.entity';
import { SavingsSubscriptionController } from './savings-subscription.controller';
import { SavingsService } from '../savings/savings.service';
import { Savings } from '~/database/entities/savings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsSubscription, User, Savings])],
  providers: [SavingsSubscriptionService, UserService, SavingsService],
  controllers: [SavingsSubscriptionController],
  exports: [SavingsSubscriptionService],
})
export class SavingsSubscriptionModule {}
