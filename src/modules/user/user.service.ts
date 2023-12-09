import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUser } from './user.model';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { StaffMember } from '../staff/entities/staff.entity';
import { Payout } from '../staff/entities/payout.entity';
import { User } from './entities/user.entity';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    private readonly sequelize: Sequelize,

    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}

  async findOne(phoneNumber: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  async createUser(user: CreateUser) {
    try {
      user.password = await bcrypt.hash(user.password, saltOrRounds);
      return await this.userRepository.create<User>(user);
    } catch (e) {
      throw new Error(e);
    }
  }
}
