import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  private blacklistedTokens: Set<string> = new Set(); // example; use Redis for production

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(phoneNumber);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return { id: user.id, phoneNumber: user.phoneNumber, name: user.name };
    }
    return null;
  }

  async login(user: User) {
    const payload = { phoneNumber: user.phoneNumber, sub: user.id };
    return {
      id: user.id,
      name: user.name,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async logout(user: any, authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) return;

    const payload = this.jwtService.decode(token) as { exp?: number };
    const ttl = payload?.exp
      ? payload.exp - Math.floor(Date.now() / 1000)
      : 86400;

    await this.redisClient.set(`bl:${token}`, '1', 'EX', ttl);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return (await this.redisClient.exists(`bl:${token}`)) === 1;
  }
}
