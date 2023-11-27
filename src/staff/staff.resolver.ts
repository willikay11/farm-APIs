import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateStaffMember, StaffMember } from "./staff.model";
import { StaffService } from './staff.service';
// import { StaffMemberInterface } from "./interfaces/staff.interface";
// import { StaffMemberDto } from "./dto/staffMember.dto";

@Resolver()
export class StaffResolver {
  constructor(private staffMemberService: StaffService) {}

  @Query(() => StaffMember)
  async staffMember(@Args('id') id: string) {
    return await this.staffMemberService.findById(id);
  }

  @Mutation(() => StaffMember)
  async createMember(@Args('createStaffMember') newMember: CreateStaffMember) {
    return await this.staffMemberService.create(newMember);
  }
}
