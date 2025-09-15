import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from './entities/expense.entity';
import { ExpenseService } from './expense.service';
import { ExpenseResolver } from './expense.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Expense]), AuthModule],
  providers: [ExpenseService, ExpenseResolver],
})
export class ExpenseModule {}
