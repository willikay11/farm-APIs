import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
import { Transaction } from './transaction.entity';
import { TransactionStatusEnum } from '../enum';

@Table
export class TransactionStatus extends Model<TransactionStatus> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @ForeignKey(() => Transaction)
  @Column({ type: DataType.UUID, allowNull: false })
  transactionId: string;

  @Column({
    type: DataType.ENUM,
    values: [
      TransactionStatusEnum.PENDING,
      TransactionStatusEnum.PROCESSING,
      TransactionStatusEnum.PAID,
      TransactionStatusEnum.FAILED,
      TransactionStatusEnum.NEEDS_INTERVENTION
    ],
    defaultValue: TransactionStatusEnum.PENDING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true
  })
  errors: string[]

  @BelongsTo(() => Transaction)
  transaction: Transaction;
}
