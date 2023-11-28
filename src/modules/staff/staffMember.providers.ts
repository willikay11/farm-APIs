import { StaffMember } from './entities/staff.entity';
import { STAFF_MEMBER_REPOSITORY } from '../../core/constants';

export const StaffMemberProviders = [
  {
    provide: STAFF_MEMBER_REPOSITORY,
    useValue: StaffMember,
  },
];
