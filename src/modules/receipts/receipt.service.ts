import { Injectable } from "@nestjs/common";
import { Receipt } from "./entities/receipt.entity";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Receipt)
    private readonly receiptRepository: typeof Receipt,
  ) {}

    async addReceipt(data: any): Promise<{message: string}> {
        await this.receiptRepository.create(data);
        return { message: "Receipt added successfully" };
    }
}