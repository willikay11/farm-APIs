import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
@Table
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  id: string;

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
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
}
