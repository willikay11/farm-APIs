import {
    Controller,
    Post,
    Body,
    Param,
  } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionFromAutomationDto } from './dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @Post("/:receiptId/automation")
    async addTransactionFromAutomation(
        @Body() data: TransactionFromAutomationDto,
        @Param('receiptId') receiptId: string,
    ) {
        await this.transactionService.addTransactionFromAutomation(data, receiptId);
        return;
    }

    @Post('trigger-automation')
    async triggerAutomation() {
       return await this.transactionService.triggerAutomation();
    }
}