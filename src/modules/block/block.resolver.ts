import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlockService } from './block.service';
import { Block, CreateBlock } from './block.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class BlockResolver {
  constructor(private blockService: BlockService) {}

  @Query(() => Block)
  async getBlock(@Args('id') id: number) {
    return await this.blockService.findById(id);
  }

  @Mutation(() => Block)
  async createBlock(@Args('block') block: CreateBlock) {
    return await this.blockService.create(block);
  }

  @Mutation(() => Block)
  async editBlock(@Args('id') id: number, @Args('block') block: CreateBlock) {
    return await this.blockService.edit(id, block);
  }

  @Query(() => [Block])
  async getBlocks() {
    return await this.blockService.findAll();
  }

  @Mutation(() => Block)
  async deactivate(@Args('id') id: number) {
    return await this.blockService.deactivate(id);
  }
}
