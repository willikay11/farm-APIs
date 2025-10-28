import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
import { StaffMember } from '../../staff/entities/staff.entity';
import { Block } from '../../block/entities/block.entity';
import { TransactionStatus } from './transactionStatus.entity';

@Table
export class Transaction extends Model<Transaction> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @ForeignKey(() => StaffMember)
  @Column({ type: DataType.UUID, allowNull: true })
  staffMemberId: string;

  @ForeignKey(() => Block)
  @Column({ type: DataType.UUID, allowNull: true })
  blockId: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  receiptNo: string;

  @DeletedAt
  declare deletedAt: Date | null;

  @BelongsTo(() => StaffMember)
  staffMember: StaffMember;

  @BelongsTo(() => Block)
  block: Block;

  @HasMany(() => TransactionStatus)
  transactionStatuses: TransactionStatus[];
}
