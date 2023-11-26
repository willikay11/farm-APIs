import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffResolver } from './staff.resolver';

@Module({
  controllers: [StaffController],
  providers: [StaffService, StaffResolver],
})
export class StaffModule {}
