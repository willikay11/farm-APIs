import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TargetService } from './target.service';
import { CreateTarget, Target } from './target.model';

@Resolver()
export class TargetResolver {
  constructor(private targetService: TargetService) {}

  @Query(() => Target)
  async getTarget(@Args('id') id: number) {
    return await this.targetService.findById(id);
  }

  @Mutation(() => Target)
  async createTarget(@Args('target') target: CreateTarget) {
    return await this.targetService.create(target);
  }

  @Mutation(() => Target)
  async editTarget(
    @Args('id') id: number,
    @Args('target') target: CreateTarget,
  ) {
    return await this.targetService.edit(id, target);
  }

  @Query(() => [Target])
  async getTargets() {
    return await this.targetService.findAll();
  }
}
