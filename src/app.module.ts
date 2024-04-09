import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { User } from './database/entities/user.entity';
import { SavingsModule } from './services/savings/savings.module';
import { TransactionModule } from './services/transaction/transaction.module';
import { UserModule } from './services/user/user.module';
import { AuthModule } from './services/auth/auth.module';
import { SavingsSubscriptionModule } from './services/subscriptions/savings-subscription.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserModule,
    SavingsModule,
    TransactionModule,
    SavingsSubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
