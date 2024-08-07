import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { StaffMember } from '../../staff/entities/staff.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Table
export class Expense extends Model<Expense> {
  @ForeignKey(() => StaffMember)
  @Column({ allowNull: true })
  staffMemberId: number;

  @ForeignKey(() => Transaction)
  @Column({ allowNull: true })
  transactionId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  payoutMethod: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  payoutIdentity: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  narration: string;

  @BelongsTo(() => StaffMember)
  staffMember: StaffMember;

  @BelongsTo(() => Transaction)
  transactions: Transaction[];
}
