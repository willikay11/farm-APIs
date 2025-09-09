import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field({ nullable: true })
  id: string;

  @Field()
  name: string;

  @Field()
  phoneNumber: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@InputType()
export class CreateUser {
  @Field()
  name: string;

  @Field()
  phoneNumber: string;

  @Field()
  password: string;
}

@InputType()
export class EditUser {
  @Field()
  name: string;

  @Field()
  phoneNumber: string;
}
