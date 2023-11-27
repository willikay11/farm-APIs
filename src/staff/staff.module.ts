import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffResolver } from './staff.resolver';
import { StaffMemberProviders } from './staffMember.providers';

@Module({
  controllers: [StaffController],
  providers: [StaffService, ...StaffMemberProviders, StaffResolver],
})
export class StaffModule {}
