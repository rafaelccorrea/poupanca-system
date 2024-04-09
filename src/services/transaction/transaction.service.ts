import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Approval } from '~/database/entities/approval.entity';
import { Savings } from '~/database/entities/savings.entity';
import { Transaction } from '~/database/entities/transaction.entity';
import { TransactionType } from './types/enum';
import { SavingsService } from '../savings/savings.service';
import { SavingsSubscription } from '~/database/entities/savings-subscription.entity';
import { transactionsControll } from '~/helpers/controll.transactions';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Approval)
    private approvalRepository: Repository<Approval>,
    @InjectRepository(Savings)
    private savingsRepository: Repository<Savings>,
    @InjectRepository(SavingsSubscription)
    private subscriptionRepository: Repository<SavingsSubscription>,
    private readonly savingsService: SavingsService,
    private connection: Connection,
  ) {}

  async createTransaction(
    amount: number,
    userId: string,
    savingsId: number,
    type: TransactionType,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      amount,
      user: { id: userId },
      savings: { id: savingsId },
      type,
    });
    return this.transactionRepository.save(transaction);
  }

  async getAllTransactionsBySavingsId(
    savingsId: number,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { savings: { id: savingsId } },
    });
  }

  async approveWithdrawal(
    transactionId: number,
    userId: string,
  ): Promise<void> {
    return await transactionsControll(async () => {
      const transaction = await this.transactionRepository.findOne({
        where: { id: transactionId },
        relations: ['savings'],
      });
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const hasApproved = await this.approvalRepository.findOne({
        where: {
          user: { id: userId },
          savings: { id: transaction.savings.id },
        },
      });
      if (hasApproved) {
        throw new Error('User has already approved this withdrawal');
      }

      const approval = this.approvalRepository.create({
        user: { id: userId },
        savings: { id: transaction.savings.id },
      });
      await this.approvalRepository.save(approval);
    }, this.connection);
  }

  async depositToSavings(
    amount: number,
    userId: string,
    savingsId: number,
  ): Promise<void> {
    return await transactionsControll(async () => {
      const isSubscribed = await this.isSubscribed(userId, savingsId);
      if (!isSubscribed) {
        throw new NotFoundException('User is not subscribed to this savings');
      }

      const savings = await this.savingsRepository.findOne({
        where: { id: savingsId },
      });

      if (!savings) {
        throw new NotFoundException('Savings not found');
      }

      savings.balance += amount;
      await this.savingsRepository.save(savings);
      // deposito do valor API https://documenter.getpostman.com/view/12353880/2sA2rDxLu5#intro
      await this.createTransaction(
        amount,
        userId,
        savingsId,
        TransactionType.DEPOSIT,
      );
    }, this.connection);
  }

  private async isSubscribed(
    userId: string,
    savingsId: number,
  ): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        savings: {
          id: savingsId,
        },
      },
    });
    return !!subscription;
  }

  async withdrawFromSavings(
    amount: number,
    userId: string,
    savingsId: number,
  ): Promise<void> {
    return await transactionsControll(async () => {
      const savings = await this.savingsRepository.findOne({
        where: { id: savingsId },
      });

      if (!savings) {
        throw new Error('Savings not found');
      }

      if (savings.owner.id !== userId) {
        throw new Error('User is not the owner of this savings');
      }

      const totalUsers = await this.approvalRepository.count({
        where: { savings: { id: savingsId } },
      });

      const approvalsCount = await this.approvalRepository.count({
        where: { savings: { id: savingsId } },
      });

      if (approvalsCount >= totalUsers / 2) {
        const balance = await this.savingsService.getBalance(savingsId, userId);
        if (amount > balance) {
          throw new Error('Insufficient funds in savings');
        }
        // saque do valor API https://documenter.getpostman.com/view/12353880/2sA2rDxLu5#intro
        await this.createTransaction(
          amount,
          userId,
          savingsId,
          TransactionType.WITHDRAWAL,
        );
      } else {
        throw new Error('Insufficient approvals for withdrawal');
      }
    }, this.connection);
  }
}
