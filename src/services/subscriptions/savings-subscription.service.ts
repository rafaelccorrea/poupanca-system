import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { SavingsSubscription } from '~/database/entities/savings-subscription.entity';
import { Savings } from '~/database/entities/savings.entity';
import { UserService } from '../user/user.service';
import { transactionsControll } from '~/helpers/controll.transactions';

@Injectable()
export class SavingsSubscriptionService {
  constructor(
    @InjectRepository(SavingsSubscription)
    private subscriptionRepository: Repository<SavingsSubscription>,
    private userService: UserService,
    private connection: Connection,
  ) {}

  async subscribeToSavings(userId: string, savings: Savings): Promise<void> {
    return await transactionsControll(async () => {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      if (!savings) {
        throw new NotFoundException('Savings not found!');
      }

      const existingSubscription = await this.subscriptionRepository.findOne({
        where: { user: { id: userId }, savings: { id: savings.id } },
      });

      if (existingSubscription) {
        throw new Error('User is already subscribed to this savings');
      }

      const subscription = this.subscriptionRepository.create();
      subscription.user = user;
      subscription.savings = savings;

      await this.subscriptionRepository.save(subscription);
    }, this.connection);
  }
}
