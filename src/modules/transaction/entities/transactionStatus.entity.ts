import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Transaction } from './transaction.entity';
import { TransactionStatusEnum } from '../enum';

@Table
export class TransactionStatus extends Model<TransactionStatus> {
  @ForeignKey(() => Transaction)
  @Column({ allowNull: false })
  transactionId: number;

  @Column({
    type: DataType.ENUM,
    values: [
      TransactionStatusEnum.PENDING,
      TransactionStatusEnum.PROCESSING,
      TransactionStatusEnum.SENT,
      TransactionStatusEnum.FAILED,
    ],
    defaultValue: TransactionStatusEnum.PENDING,
    allowNull: false,
  })
  status: string;

  @BelongsTo(() => Transaction)
  transaction: Transaction;
}
