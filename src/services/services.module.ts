// services.module.ts
import { Module } from '@nestjs/common';
import { SavingsService } from './savings/savings.service';
import { SavingsSubscriptionService } from './subscriptions/savings-subscription.service';
import { UserService } from './user/user.service';

@Module({
  providers: [SavingsSubscriptionService, UserService, SavingsService],
  exports: [SavingsSubscriptionService, UserService, SavingsService],
})
export class ServicesModule {}
