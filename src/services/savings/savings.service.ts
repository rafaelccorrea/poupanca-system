import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Savings } from '~/database/entities/savings.entity';
import { SavingsSubscriptionService } from '../subscriptions/savings-subscription.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(Savings)
    private savingsRepository: Repository<Savings>,
    private savingsSubscriptionService: SavingsSubscriptionService,
    private userService: UserService,
  ) {}

  async createSavings(name: string, userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const savings = new Savings();
    savings.name = name;
    savings.owner = user;

    const savedSavings = await this.savingsRepository.save(savings);

    await this.savingsSubscriptionService.subscribeToSavings(
      userId,
      savedSavings,
    );
  }
  async findById(id: number, userId: string): Promise<Savings> {
    const saving = await this.savingsRepository.findOne({
      relations: { transactions: true, subscriptions: true },
      where: {
        id,
        subscriptions: {
          user: {
            id: userId,
          },
        },
      },
    });

    if (!saving) {
      throw new NotFoundException('Savings not found!');
    }

    return saving;
  }

  async getBalance(savingsId: number, userId: string): Promise<number> {
    const savings = await this.findById(savingsId, userId);
    return savings.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );
  }
}
