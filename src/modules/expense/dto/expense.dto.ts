export class ExpenseDto {
  readonly type: string;
  readonly date: string;
  readonly payoutMethod: string;
  readonly amount: number;
  readonly payoutIdentity?: string;
  readonly narration?: number;
  readonly transactionId?: number;
  readonly staffMemberId?: number;
}
