import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { StaffMember } from './staff.entity';

@Table
export class Payout extends Model<Payout> {
  @ForeignKey(() => StaffMember)
  @Column({ allowNull: false })
  staffMemberId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  retainer: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
})
  huddleRate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 12,
  })
  amountPerKg: number;

  @DeletedAt
  declare deletedAt: Date | null;

  @BelongsTo(() => StaffMember)
  staffMember: StaffMember;
}
