import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';

@Module({
  imports: [SequelizeModule.forFeature([User]),],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
