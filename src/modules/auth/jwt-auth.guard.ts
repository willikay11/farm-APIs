import { ExecutionContext, Injectable } from '@nestjs/common';
import { BaseJwtAuthGuard } from './base-jwt-auth.guard';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends BaseJwtAuthGuard {
  constructor(protected readonly authService: AuthService) {
    super(authService);
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
