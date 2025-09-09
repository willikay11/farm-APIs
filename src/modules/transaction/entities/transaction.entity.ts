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
  @Column({ type: DataType.UUID, allowNull: false })
  staffMemberId: string;

  @ForeignKey(() => Block)
  @Column({ type: DataType.UUID, allowNull: false })
  blockId: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: string;

  @DeletedAt
  declare deletedAt: Date | null;

  @BelongsTo(() => StaffMember)
  staffMember: StaffMember;

  @BelongsTo(() => Block)
  block: Block;

  @HasMany(() => TransactionStatus)
  transactionStatuses: TransactionStatus[];
}
