import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { StaffMember } from '../staff/staff.model';
import { Block } from '../block/block.model';

@ObjectType()
export class TransactionStatus {
  @Field({ nullable: false })
  id: number;

  @Field()
  status: string;

  @Field()
  transactionId: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
@ObjectType()
export class Transaction {
  @Field({ nullable: true })
  id: number;

  @Field()
  staffMember: StaffMember;

  @Field()
  block: Block;

  @Field()
  date: string;

  @Field()
  amount: number;

  @Field()
  transaction: TransactionStatus;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@InputType()
export class CreateTransaction {
  @Field()
  staffMemberId: number;

  @Field()
  blockId: number;

  @Field()
  date: string;

  @Field()
  amount: number;
}
