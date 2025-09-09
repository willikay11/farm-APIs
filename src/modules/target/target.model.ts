import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { StaffMember } from '../staff/staff.model';

@ObjectType()
export class Target {
  @Field()
  id: number;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field()
  amount: number;

  @Field({ nullable: true })
  staffMember: StaffMember;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@InputType()
export class CreateTarget {
  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field()
  amount: number;

  @Field()
  staffMemberId: string;
}
