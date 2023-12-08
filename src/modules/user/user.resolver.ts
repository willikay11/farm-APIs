import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserResolver {}
