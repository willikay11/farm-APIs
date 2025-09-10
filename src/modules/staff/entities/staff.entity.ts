import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  HasMany,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
import { Payout } from './payout.entity';
import { Block } from '../../block/entities/block.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Target } from '../../target/entities/target.entity';

@Table
export class StaffMember extends Model<StaffMember> {
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
  })
  imageUrl: string;

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

  @HasMany(() => Block)
  block: Block[];

  @HasMany(() => Transaction)
  transactions: Transaction[];

  @HasMany(() => Target)
  target: Target[];
}
