import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { CreateTransaction } from './transaction.model';
import { Sequelize } from 'sequelize-typescript';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { TransactionStatusEnum } from './enum';
import { Block } from '../block/entities/block.entity';
import { StaffMember } from '../staff/entities/staff.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly sequelize: Sequelize,

    @InjectModel(Transaction)
    private readonly transactionRepository: typeof Transaction,

    @InjectModel(TransactionStatus)
    private readonly transactionStatusRepository: typeof TransactionStatus,
  ) {}

  async create(transaction: CreateTransaction) {
    try {
      return this.sequelize.transaction(async (t) => {
        const newTransaction =
          await this.transactionRepository.create<Transaction>(transaction, {
            transaction: t,
          });

        await this.transactionStatusRepository.create(
          {
            transactionId: newTransaction.id,
            status: TransactionStatusEnum.PENDING,
          },
          { transaction: t },
        );

        return newTransaction;
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll() {
    return await this.transactionRepository.findAll({
      include: [Block, StaffMember],
    });
  }

  async findById(id: number) {
    try {
      return await this.transactionRepository.findOne<Transaction>({
        where: {
          id,
        },
        include: [Block, StaffMember],
      });
    } catch (e) {
      throw new BadRequestException('No transaction exists');
    }
  }

  async edit(id: number, editTransaction: CreateTransaction) {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: {
          id,
        },
        include: [{ model: TransactionStatus, order: [['createdAt', 'DESC']] }],
      });

      if (!transaction) return new BadRequestException('Transaction not found');

      if (
        transaction.transactionStatuses?.[0]?.status !==
        TransactionStatusEnum.PENDING
      ) {
        return new BadRequestException(
          `Can not update a transaction in ${transaction.transactionStatuses?.[0]?.status} state`,
        );
      }

      return transaction.update({
        amount: editTransaction.amount,
        staffMemberId: editTransaction.staffMemberId,
        date: editTransaction.date,
        blockId: editTransaction.blockId,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
