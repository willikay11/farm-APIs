import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { StaffMember } from '../../staff/entities/staff.entity';
@Table
export class Target extends Model<Target> {
  @ForeignKey(() => StaffMember)
  @Column
  staffMemberId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @BelongsTo(() => StaffMember)
  staffMember: StaffMember;
}
