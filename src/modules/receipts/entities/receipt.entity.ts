import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
import { ReceiptStatusEnum } from 'src/modules/transaction/enum';

@Table
export class Receipt extends Model<Receipt> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fileUrl: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  messageId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fromUser: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  timestamp: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  messageGroupId: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  chatId: number;

  @Column({
    type: DataType.STRING,
    values: [
      ReceiptStatusEnum.PENDING,
      ReceiptStatusEnum.PROCESSED,
    ],
    allowNull: true,
    defaultValue: ReceiptStatusEnum.PENDING,
  })
  status: string;

  @DeletedAt
  declare deletedAt: Date | null;
}
