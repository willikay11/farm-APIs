import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { StaffMember } from '../../staff/entities/staff.entity';
import { Block } from '../../block/entities/block.entity';
import { TransactionStatus } from './transactionStatus.entity';

@Table
export class Transaction extends Model<Transaction> {
  @ForeignKey(() => StaffMember)
  @Column({ allowNull: false })
  staffMemberId: number;

  @ForeignKey(() => Block)
  @Column({ allowNull: false })
  blockId: number;

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
