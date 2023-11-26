import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Staff {
  @Field()
  id: string;

  @Field({ nullable: false })
  name?: string;

  @Field()
  idNumber: string;

  @Field()
  createdAt: string;
}
