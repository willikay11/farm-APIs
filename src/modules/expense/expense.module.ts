import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from './entities/expense.entity';
import { ExpenseService } from './expense.service';
import { ExpenseResolver } from './expense.resolver';

@Module({
  imports: [SequelizeModule.forFeature([Expense])],
  providers: [ExpenseService, ExpenseResolver],
})
export class ExpenseModule {}
