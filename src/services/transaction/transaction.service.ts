import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    userId: string,
    savingsId: number,
  ): Promise<Transaction[]> {
    await this.verifySubscription(userId, savingsId);

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
        where: { id: transactionId, type: TransactionType.WITHDRAWAL },
        relations: { savings: true },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      await this.verifySubscription(userId, transaction.savings.id);
      await this.checkPendingWithdrawal(userId, transaction.savings.id);

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
      await this.verifySubscription(userId, savingsId);

      const savings = await this.savingsRepository.findOne({
        where: { id: savingsId },
      });

      if (!savings) {
        throw new NotFoundException('Savings not found');
      }

      if (isNaN(amount) || amount <= 0) {
        throw new BadRequestException('Invalid amount');
      }

      savings.balance = parseFloat(savings.balance.toString()) + amount;

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

  private async verifySubscription(
    userId: string,
    savingsId: number,
  ): Promise<void> {
    const isSubscribed = await this.isSubscribed(userId, savingsId);
    if (!isSubscribed) {
      throw new NotFoundException('User is not subscribed to this savings');
    }
  }

  private async isSubscribed(
    userId: string,
    savingsId: number,
  ): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: userId },
        savings: { id: savingsId },
      },
    });
    return !!subscription;
  }

  private async checkPendingWithdrawal(
    userId: string,
    savingsId: number,
  ): Promise<void> {
    const pendingWithdrawal = await this.transactionRepository.findOne({
      where: {
        user: { id: userId },
        savings: { id: savingsId },
        type: TransactionType.WITHDRAWAL,
      },
    });

    if (pendingWithdrawal) {
      throw new BadRequestException(
        'There is already a pending withdrawal request',
      );
    }
  }

  async requestWithdrawal(
    amount: number,
    userId: string,
    savingsId: number,
  ): Promise<void> {
    return await transactionsControll(async () => {
      await this.verifySubscription(userId, savingsId);
      await this.checkPendingWithdrawal(userId, savingsId);

      const withdrawalRequest = await this.createTransaction(
        amount,
        userId,
        savingsId,
        TransactionType.REQUEST_WITHDRAWAL,
      );

      this.monitorApproval(withdrawalRequest.id, savingsId);
    }, this.connection);
  }

  private async monitorApproval(
    transactionId: number,
    savingsId: number,
  ): Promise<void> {
    const interval = setInterval(async () => {
      const approvalsCount = await this.approvalRepository.count({
        where: { savings: { id: savingsId } },
      });

      const totalUsers = await this.savingsRepository.count({
        where: {
          subscriptions: {
            savings: {
              id: savingsId,
            },
          },
        },
      });

      if (approvalsCount >= totalUsers / 2) {
        clearInterval(interval);
        await this.confirmWithdrawal(transactionId);
      }
    }, 5000); // Verificar a cada 5 segundos
  }

  async confirmWithdrawal(transactionId: number): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: transactionId,
        type: TransactionType.WITHDRAWAL,
      },
      relations: { savings: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const balance = await this.savingsService.getBalance(
      transaction.savings.id,
      transaction.user.id,
    );
    if (transaction.amount > balance) {
      throw new Error('Insufficient funds in savings');
    }

    await this.createTransaction(
      transaction.amount,
      transaction.user.id,
      transaction.savings.id,
      TransactionType.WITHDRAWAL,
    );

    // colocar um socket para emitir evento para saque automatico apos 50% das aprovações.
  }
}
