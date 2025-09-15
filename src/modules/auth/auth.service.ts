import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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

  // Generate tokens
  async generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.SECRET_CODE,
      expiresIn: '15m', // shorter lived access token
    });

  }

  async generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET_CODE,
      expiresIn: '7d', // longer lived refresh token
    });
  }

  // Store refresh token in Redis (optional: per user basis)
  async storeRefreshToken(userId: string, refreshToken: string) {
    await this.redisClient.set(
      `refresh:${userId}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60, // 7 days
    );
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const stored = await this.redisClient.get(`refresh:${userId}`);
    return stored === refreshToken;
  }

  async refreshTokens(userId: string, refreshToken: string, authHeader: string) {
    // Verify refresh token signature
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET_CODE,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check it matches stored token
    const isValid = await this.validateRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Refresh token not recognized');
    }

    const token = authHeader?.split(' ')[1];

    // blacklist access token
    await this.blackListAccessToken(token);

    // Issue new tokens
    const payload = { sub: userId };
    const accessToken = await this.generateAccessToken(payload);

    // // Update stored refresh token
    // await this.storeRefreshToken(userId, newRefreshToken);

    return {
      accessToken: accessToken
    };
  }

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

    // generate access + refresh tokens
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    // store refresh token in Redis
    await this.storeRefreshToken(user.id.toString(), refreshToken);
    return {
      id: user.id,
      name: user.name,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async logout(user: any, authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) return;
  
    // blacklist access token
    await this.blackListAccessToken(token);
    
    // remove refresh token for this user
    if (user?.id) {
      await this.redisClient.del(`refresh:${user.id}`);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return (await this.redisClient.exists(`bl:${token}`)) === 1;
  }

  private async blackListAccessToken(token: string) {
    const payload = this.jwtService.decode(token) as { exp?: number };
    const ttl = payload?.exp
      ? payload.exp - Math.floor(Date.now() / 1000)
      : 86400;
  
    await this.redisClient.set(`bl:${token}`, '1', 'EX', ttl);
  }
}
