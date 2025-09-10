import { Field, InputType, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class Payout {
  @Field()
  id: string;

  @Field()
  staffMemberId: string;

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

@ObjectType()
export class StaffMember {
  @Field({ nullable: true })
  id: string;

  @Field()
  name: string;

  @Field()
  imageUrl: string;

  @Field()
  type: 'salaried' | 'day-bug';

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field(() => Payout, { nullable: true })
  payout?: Payout;
}

@InputType()
export class CreateStaffMember {
  @Field()
  name: string;

  @Field()
  imageUrl: string;

  @Field()
  type: 'salaried' | 'day-bug';

  @Field({ nullable: true })
  retainer?: number;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  huddleRate?: number;

  @Field()
  amountPerKg: number;
}

@InputType()
export class EditStaffMember {
  @Field()
  name: string;

  @Field()
  imageUrl: string;

  @Field()
  type: 'salaried' | 'day-bug';

  @Field()
  retainer: number;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  huddleRate: number;

  @Field()
  amountPerKg: number;
}

@InputType()
export class CreatePayout {
  @Field()
  retainer: number;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  huddleRate: number;

  @Field()
  amountPerKg: number;
}
