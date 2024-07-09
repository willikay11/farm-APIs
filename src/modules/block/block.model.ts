import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Block {
  @Field({ nullable: true })
  id: number;

  @Field()
  name: string;

  @Field()
  owner: number;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@InputType()
export class CreateBlock {
  @Field()
  name: string;

  @Field()
  owner: number;
}
