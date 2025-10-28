import {
    Controller,
    Post,
    Body,
  } from '@nestjs/common';
import { ReceiptDto } from './dto/receipt.dto';
import { ReceiptService } from './receipt.service';

@Controller('receipts')
export class ReceiptController {
    constructor(private receiptService: ReceiptService) {}

    @Post()
    async addReceipt(@Body() data: ReceiptDto) {
        return await this.receiptService.addReceipt(data);
    }
}