import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import {
  CheckoutTransactions,
  CreateTransaction,
  Transaction,
} from './transaction.model';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => Transaction)
  async getTransaction(@Args('id') id: number) {
    return await this.transactionService.findById(id);
  }

  @Mutation(() => Transaction)
  async createTransaction(@Args('transaction') transaction: CreateTransaction) {
    return await this.transactionService.create(transaction);
  }

  @Mutation(() => Transaction)
  async editTransaction(
    @Args('id') id: number,
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
}
