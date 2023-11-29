import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { StaffMember } from '../../staff/entities/staff.entity';

@Table
export class Block extends Model<Block> {
  @ForeignKey(() => StaffMember)
  @Column({ allowNull: false })
  owner: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @DeletedAt
  declare deletedAt: Date | null;

  @BelongsTo(() => StaffMember)
  staffMember: StaffMember;
}
