import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionResolver } from './transaction.resolver';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { Expense } from '../expense/entities/expense.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction, TransactionStatus, Expense]),
  ],
  providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}
