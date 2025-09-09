import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { User } from '../../src/modules/user/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';

export class IntegrationTestManager {
  public httpServer: any;
  private app: INestApplication;
  private jwtSecret = process.env.SECRET_CODE || 'test-secret';
  private testUser: User;

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleRef.createNestApplication();
    await this.app.init();

    this.httpServer = this.app.getHttpServer();

    const sequelize = this.app.get(Sequelize);

    // 👇 Ensure DB is in sync with your models
    await sequelize.sync();

    // 👇 Find or create test user
    this.testUser = await User.findOne({
      where: { phoneNumber: '0721556556' },
    });
    if (!this.testUser) {
      this.testUser = await User.findOrCreate({
        where: { phoneNumber: '0721556556' },
        defaults: {
          name: 'Test User',
          password: '0000',
        },
      }).then(([user]) => user);
    }
  }

  async afterAll() {
    if (this.app) {
      const sequelize = this.app.get(Sequelize);
      // await sequelize.truncate({ cascade: true });
      await this.app.close();
    }
  }

  getAuthTokenForTestUser(): string {
    const payload = {
      phoneNumber: this.testUser.phoneNumber,
      sub: this.testUser.id,
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }
}
