import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsSubscription } from '~/database/entities/savings-subscription.entity';
import { Savings } from '~/database/entities/savings.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class SavingsSubscriptionService {
  constructor(
    @InjectRepository(SavingsSubscription)
    private subscriptionRepository: Repository<SavingsSubscription>,
    private userService: UserService,
  ) {}

  async subscribeToSavings(userId: string, savings: Savings): Promise<void> {
    // Verifica se o usuário e a poupança existem
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    if (!savings) {
      throw new NotFoundException('Savings not found!');
    }

    // Verifica se o usuário já está inscrito nesta poupança
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { user: { id: userId }, savings: { id: savings.id } },
    });
    if (existingSubscription) {
      throw new Error('User is already subscribed to this savings');
    }

    // Cria uma nova inscrição na poupança
    const subscription = this.subscriptionRepository.create({
      user,
      savings,
    });
    await this.subscriptionRepository.save(subscription);
  }
}
