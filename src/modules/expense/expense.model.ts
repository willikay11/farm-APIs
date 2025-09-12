import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Transaction } from '../transaction/transaction.model';
import { StaffMember } from '../staff/staff.model';

@ObjectType()
export class Expense {
  @Field()
  id: string;

  @Field()
  type: string;

  @Field()
  date: string;

  @Field()
  payoutMethod: string;

  @Field()
  amount: number;

  @Field({ nullable: true })
  payoutIdentity: string;

  @Field({ nullable: true })
  narration: string;

  @Field({ nullable: true })
  transaction: Transaction;

  @Field({ nullable: true })
  staffMember: StaffMember;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@InputType()
export class CreateExpense {
  @Field()
  type: string;

  @Field()
  date: string;

  @Field()
  payoutMethod: string;

  @Field()
  amount: number;

  @Field({ nullable: true })
  payoutIdentity: string;

  @Field({ nullable: true })
  narration: string;

  @Field({ nullable: true })
  transactionId: string;

  @Field({ nullable: true })
  staffMemberId: string;
}
