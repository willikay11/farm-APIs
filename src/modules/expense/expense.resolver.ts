import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExpenseService } from './expense.service';

import { CreateExpense, Expense } from './expense.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ExpenseResolver {
  constructor(private expenseService: ExpenseService) {}

  @Query(() => Expense)
  async getExpense(@Args('id') id: number) {
    return await this.expenseService.findById(id);
  }

  @Mutation(() => Expense)
  async createExpense(@Args('expense') expense: CreateExpense) {
    return await this.expenseService.create(expense);
  }

  @Query(() => [Expense])
  async getExpenses() {
    return await this.expenseService.findAll();
  }
}
