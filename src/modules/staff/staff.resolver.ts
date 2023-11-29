import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreatePayout,
  CreateStaffMember,
  EditStaffMember,
  Payout,
  StaffMember,
} from './staff.model';
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

  @Mutation(() => StaffMember)
  async editMember(
    @Args('id') id: string,
    @Args('member') member: EditStaffMember,
  ) {
    return await this.staffMemberService.edit(id, member);
  }

  @Mutation(() => Payout)
  async editPayout(
    @Args('id') id: string,
    @Args('payout') payout: CreatePayout,
  ) {
    return await this.staffMemberService.editPayout(id, payout);
  }

  @Query(() => [StaffMember])
  async getStaffMembers() {
    return await this.staffMemberService.findAll();
  }

  @Mutation(() => StaffMember)
  async deactivate(@Args('id') id: string) {
    return await this.staffMemberService.deactivate(id);
  }
}
