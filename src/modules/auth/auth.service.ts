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

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(phoneNumber);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { phoneNumber: user.phoneNumber, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
