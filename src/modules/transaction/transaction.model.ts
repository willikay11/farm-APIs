import {
  Field,
  InputType,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';
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
export class GroupedTransaction {
  @Field(() => String)
  date: string;

  @Field()
  amount: number;

  @Field(() => [Transaction])
  transactions: Transaction[];
}

@ObjectType()
export class Transaction {
  @Field()
  id: string;

  @Field()
  staffMember: StaffMember;

  @Field()
  block: Block;

  @Field(() => GraphQLISODateTime)
  date: Date;

  @Field()
  amount: number;

  @Field({ nullable: true })
  status: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
export class StaffProgress {
  @Field()
  target: number;

  @Field()
  amount: number;
}

@ObjectType()
export class Progress {
  @Field()
  name: string;

  @Field()
  target: number;

  @Field()
  current: number;
}

@InputType()
export class CreateTransaction {
  @Field()
  staffMemberId: string;

  @Field()
  blockId: string;

  @Field()
  date: string;

  @Field()
  amount: number;
}

@InputType()
export class CheckoutTransactions {
  @Field(() => [String], {})
  transactions: string[];

  @Field()
  date: string;

  @Field()
  payoutMethod: string;
}
