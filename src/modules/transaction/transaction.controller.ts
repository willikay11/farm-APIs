import {
    Controller,
    Post,
    Body,
  } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionFromAutomationDto } from './dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @Post()
    async addTransactionFromAutomation(@Body() data: TransactionFromAutomationDto) {
        await this.transactionService.addTransactionFromAutomation(data);
        return;
    }

    @Post('test')
    async testEndpoint(@Body() data: any) {
        console.log('Test endpoint received data:', data);
        return { message: 'Test endpoint received data successfully' };
    }
}