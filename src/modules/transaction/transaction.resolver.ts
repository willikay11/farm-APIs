import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import {
  CheckoutTransactions,
  CreateTransaction,
  Progress,
  StaffProgress,
  Transaction,
} from './transaction.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => Transaction)
  async getTransaction(@Args('id') id: string) {
    return await this.transactionService.findById(id);
  }

  @Mutation(() => Transaction)
  async createTransaction(@Args('transaction') transaction: CreateTransaction) {
    return await this.transactionService.create(transaction);
  }

  @Mutation(() => Transaction)
  async editTransaction(
    @Args('id') id: string,
    @Args('transaction') transaction: CreateTransaction,
  ) {
    return await this.transactionService.edit(id, transaction);
  }

  @Query(() => [Transaction])
  async getTransactions() {
    return await this.transactionService.findAll();
  }

  @Mutation(() => String)
  async checkout(@Args('transactions') transactions: CheckoutTransactions) {
    return await this.transactionService.checkout(transactions);
  }

  @Query(() => [Transaction])
  async getPendingTransactions() {
    return await this.transactionService.getPendingTransactions();
  }

  @Query(() => StaffProgress)
  async calculateStaffProgress(
    @Args('id') id: number,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    return await this.transactionService.calculateStaffProgress(
      id,
      startDate,
      endDate,
    );
  }

  @Query(() => [Progress])
  async calculateProgress(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    return await this.transactionService.calculateProgress(startDate, endDate);
  }
}
