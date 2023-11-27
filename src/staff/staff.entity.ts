import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
} from 'sequelize-typescript';

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
}
