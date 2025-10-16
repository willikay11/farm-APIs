import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionResolver } from './transaction.resolver';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { Expense } from '../expense/entities/expense.entity';
import { StaffMember } from '../staff/entities/staff.entity';
import { AuthModule } from '../auth/auth.module';
import { TransactionController } from './transaction.controller';
import { Block } from '../block/entities/block.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Transaction,
      TransactionStatus,
      Expense,
      StaffMember,
      Block
    ]),
    AuthModule,
  ],
  providers: [TransactionService, TransactionResolver],
  controllers: [TransactionController]
})
export class TransactionModule {}
