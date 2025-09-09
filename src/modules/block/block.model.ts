import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Block {
  @Field({ nullable: true })
  id: string;

  @Field()
  name: string;

  @Field()
  noOfBushes: number;

  @Field({ nullable: true })
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

  @Field(() => Int)
  noOfBushes: number;

  @Field(() => String, { nullable: true })
  owner?: string;
}
