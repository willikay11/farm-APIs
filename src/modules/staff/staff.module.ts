import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffResolver } from './staff.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffMember } from './entities/staff.entity';
import { Payout } from './entities/payout.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([StaffMember, Payout]), AuthModule],
  providers: [StaffService, StaffResolver],
})
export class StaffModule {}
