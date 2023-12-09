import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUser, User } from './user.model';
import { UserService } from './user.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('user') user: CreateUser) {
    return await this.userService.createUser(user);
  }
}
