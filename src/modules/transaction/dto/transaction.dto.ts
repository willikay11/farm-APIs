export class TransactionDto {
  readonly name: string;
  readonly date: string;
  readonly staffMemberId: string;
  readonly amount: number;
}

export class TransactionFromAutomationDto {
  readonly picker: string;
  readonly block: string;
  readonly receipt_no: string;
  readonly plucked_date: string;
  readonly tare_weight_kg: string;
  readonly number_of_bags: string;
  readonly bags: bag[]
  readonly totals: {
    readonly tea_weight_kg: string;
    readonly net_weight_kg_for_today: string;
    readonly net_weight_kg_for_month: string;
  }
}

class bag {
  readonly bag_no: string;
  readonly actual_weight_kg: string;
  readonly net_weight_kg: string;
}