import { Inject, Injectable } from '@nestjs/common';
import { STAFF_MEMBER_REPOSITORY } from '../../core/constants';
import { StaffMember } from './entities/staff.entity';
// import { StaffMemberDto } from './dto/staffMember.dto';
// import { CreateStaffMember } from "./staff.model";

@Injectable()
export class StaffService {
  constructor(
    @Inject(STAFF_MEMBER_REPOSITORY)
    private readonly staffMemberRepository: typeof StaffMember,
  ) {}

  async create(staffMember: unknown) {
    try {
      return await this.staffMemberRepository.create<StaffMember>(staffMember);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(id: string) {
    try {
      return await this.staffMemberRepository.findOne<StaffMember>({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new Error('No staff member exists');
    }
  }

  async findAll() {
    return await this.staffMemberRepository.findAll();
  }
}
