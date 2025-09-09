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
import { Transaction } from '../../transaction/entities/transaction.entity';

@Table
export class Block extends Model<Block> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @ForeignKey(() => StaffMember)
  @Column({ type: DataType.UUID, allowNull: true })
  owner: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  noOfBushes: number;

  @DeletedAt
  declare deletedAt: Date | null;

  @BelongsTo(() => StaffMember)
  staffMember?: StaffMember;

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
