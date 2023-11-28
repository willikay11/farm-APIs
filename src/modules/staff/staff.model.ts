import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StaffMember {
  @Field()
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

@InputType()
export class CreateStaffMember {
  @Field()
  name: string;

  @Field()
  idNumber: string;

  @Field()
  type: 'salaried' | 'day-bug';
}
