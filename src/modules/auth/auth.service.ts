import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
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
    if (token) {
      this.blacklistedTokens.add(token);
    }
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
