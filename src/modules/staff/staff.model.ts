import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StaffMember {
  @Field({ nullable: true })
  id: string;

  @Field()
  name: string;

  @Field()
  idNumber: string;

  @Field()
  type: 'salaried' | 'day-bug';

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class Payout {
  @Field()
  id: number;

  @Field()
  staffMemberId: number;

  @Field()
  huddleRate: number;

  @Field()
  amountPerKg: number;

  @Field()
  retainer: number;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@InputType()
export class CreateStaffMember {
  @Field()
  name: string;

  @Field()
  idNumber: string;

  @Field()
  type: 'salaried' | 'day-bug';

  @Field()
  retainer: number;

  @Field()
  phoneNumber: string;

  @Field()
  huddleRate: number;

  @Field()
  amountPerKg: number;
}

@InputType()
export class EditStaffMember {
  @Field()
  name: string;

  @Field()
  idNumber: string;

  @Field()
  type: 'salaried' | 'day-bug';
}

@InputType()
export class CreatePayout {
  @Field()
  retainer: number;

  @Field()
  phoneNumber: string;

  @Field()
  huddleRate: number;

  @Field()
  amountPerKg: number;
}
