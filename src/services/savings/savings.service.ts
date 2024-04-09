import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Savings } from '~/database/entities/savings.entity';
import { SavingsSubscriptionService } from '../subscriptions/savings-subscription.service';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(Savings)
    private savingsRepository: Repository<Savings>,
    private savingsSubscriptionService: SavingsSubscriptionService,
  ) {}

  async createSavings(name: string, ownerId: string): Promise<Savings> {
    const savings = this.savingsRepository.create({
      name,
      owner: { id: ownerId },
    });

    await this.savingsSubscriptionService.subscribeToSavings(ownerId, savings);

    return this.savingsRepository.save(savings);
  }

  async findById(id: number, ownerId: string): Promise<Savings> {
    const saving = await this.savingsRepository.findOne({
      relations: { transactions: true, subscriptions: true },
      where: {
        id,
        subscriptions: {
          user: {
            id: ownerId,
          },
        },
      },
    });

    if (!saving) {
      throw new NotFoundException('Savings not found!');
    }

    return saving;
  }

  async getBalance(savingsId: number, ownerId: string): Promise<number> {
    const savings = await this.findById(savingsId, ownerId);
    return savings.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );
  }
}
