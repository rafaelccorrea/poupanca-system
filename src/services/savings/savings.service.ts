import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Savings } from '~/database/entities/savings.entity';
import { SavingsSubscriptionService } from '../subscriptions/savings-subscription.service';
import { UserService } from '../user/user.service';
import { transactionsControll } from '~/helpers/controll.transactions';
import { TransactionType } from '../transaction/types/enum';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(Savings)
    private savingsRepository: Repository<Savings>,
    private savingsSubscriptionService: SavingsSubscriptionService,
    private userService: UserService,
    private connection: Connection,
  ) {}

  async createSavings(name: string, userId: string): Promise<void> {
    return await transactionsControll(async () => {
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
        savedSavings.id,
      );
    }, this.connection);
  }

  async findByIdAndSubscription(id: number, userId: string): Promise<Savings> {
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
    const savings = await this.findByIdAndSubscription(savingsId, userId);
    if (!savings || !savings.transactions) {
      return 0;
    }
    return savings.transactions.reduce((total, transaction) => {
      if (transaction.type === TransactionType.DEPOSIT) {
        return total + parseFloat(transaction.amount.toString());
      } else if (transaction.type === TransactionType.WITHDRAWAL) {
        return total - parseFloat(transaction.amount.toString());
      }
      return total;
    }, 0);
  }
}
