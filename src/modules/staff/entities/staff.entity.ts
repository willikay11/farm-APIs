import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  HasMany,
} from 'sequelize-typescript';
import { Payout } from './payout.entity';

@Table
export class StaffMember extends Model<StaffMember> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  idNumber: string;

  @Column({
    type: DataType.ENUM,
    values: ['salaried', 'day-bug'],
    allowNull: false,
  })
  type: string;

  @DeletedAt
  declare deletedAt: Date | null;

  @HasMany(() => Payout)
  payout: Payout[];
}
