import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BaseJwtAuthGuard } from './base-jwt-auth.guard';
import { AuthService } from './auth.service';

@Injectable()
export class GqlAuthGuard extends BaseJwtAuthGuard {
  constructor(protected readonly authService: AuthService) {
    super(authService);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
