import {
  Controller,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './gql-jwt-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(
    @Body() body: { userId: string; refreshToken: string },
    @Request() req,
  ) {
    if (!body.userId || !body.refreshToken) {
      throw new UnauthorizedException('Missing refresh data');
    }
    return this.authService.refreshTokens(
      body.userId,
      body.refreshToken,
      req.headers.authorization,
    );
  }

  @Post('logout')
  async logout(@Request() req, @Body() body: { accessToken: string }) {
    await this.authService.logout(req.user, body.accessToken);
    return { message: 'Logged out successfully' };
  }
}
