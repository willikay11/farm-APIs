import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export abstract class BaseJwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected readonly authService: AuthService) {
    super();
  }

  /**
   * Run async checks (like blacklist) here.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Run the normal passport guard first
    const canActivate = (await super.canActivate(context)) as boolean;

    // Extract request
    const request = this.getRequest(context);
    const token = request.headers.authorization?.split(' ')[1];

    // Async blacklist check
    if (token && (await this.authService.isTokenBlacklisted(token))) {
      throw new UnauthorizedException('Token has been logged out');
    }

    return canActivate;
  }

  /**
   * Keep handleRequest synchronous to match AuthGuard<TUser> signature
   */
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  /**
   * Each child guard defines how to extract the request
   */
  abstract getRequest(context: ExecutionContext): any;
}
