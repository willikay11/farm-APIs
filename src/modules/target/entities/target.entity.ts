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
import { StaffMember } from '../../staff/entities/staff.entity';
@Table
export class Target extends Model<Target> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @ForeignKey(() => StaffMember)
  @Column({ type: DataType.UUID })
  staffMemberId: string;

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
