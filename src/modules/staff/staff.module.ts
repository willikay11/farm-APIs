import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffResolver } from './staff.resolver';
import { StaffMemberProviders } from './staffMember.providers';

@Module({
  providers: [StaffService, ...StaffMemberProviders, StaffResolver],
})
export class StaffModule {}
