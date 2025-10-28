import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Receipt } from './entities/receipt.entity';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Receipt,
    ]),
    AuthModule,
  ],
  providers: [ReceiptService],
  controllers: [ReceiptController],
})

export class ReceiptModule {}
