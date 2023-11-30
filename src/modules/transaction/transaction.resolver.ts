import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransaction, Transaction } from './transaction.model';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => Transaction)
  async getTransaction(@Args('id') id: number) {
    return await this.transactionService.findById(id);
  }

  @Mutation(() => Transaction)
  async createBlock(@Args('transaction') block: CreateTransaction) {
    return await this.transactionService.create(block);
  }

  @Mutation(() => Transaction)
  async editBlock(
    @Args('id') id: number,
    @Args('block') transaction: CreateTransaction,
  ) {
    return await this.transactionService.edit(id, transaction);
  }

  @Query(() => [Transaction])
  async getBlocks() {
    return await this.transactionService.findAll();
  }
}
