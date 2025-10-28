import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';

@Table
export class Receipt extends Model<Receipt> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fileUrl: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  messageId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fromUser: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  timestamp: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  messageGroupId: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  chatId: number;

  @DeletedAt
  declare deletedAt: Date | null;
}
