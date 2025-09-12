import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { CheckoutTransactions, CreateTransaction } from './transaction.model';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { TransactionStatusEnum } from './enum';
import { Block } from '../block/entities/block.entity';
import { StaffMember } from '../staff/entities/staff.entity';
import { Expense } from '../expense/entities/expense.entity';
import { Payout } from '../staff/entities/payout.entity';
import { Target } from '../target/entities/target.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly sequelize: Sequelize,

    @InjectModel(Transaction)
    private readonly transactionRepository: typeof Transaction,

    @InjectModel(TransactionStatus)
    private readonly transactionStatusRepository: typeof TransactionStatus,

    @InjectModel(Expense)
    private readonly expenseRepository: typeof Expense,

    @InjectModel(StaffMember)
    private readonly staffMemberRepository: typeof StaffMember,
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
    const transactions = await this.transactionRepository.findAll({
      include: [
        Block,
        StaffMember,
        {
          model: TransactionStatus,
          separate: true,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    return transactions.map((transaction) => {
      return {
        ...transaction.toJSON(),
        ...transaction.block.toJSON(),
        ...transaction.staffMember.toJSON(),
        status: transaction.transactionStatuses[0].status,
      };
    });
  }

  async findById(id: string) {
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

  async edit(id: string, editTransaction: CreateTransaction) {
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

  async checkout(data: CheckoutTransactions) {
    try {
      const transactions =
        await this.transactionRepository.findAll<Transaction>({
          where: {
            id: data?.transactions,
          },
          include: [
            { model: StaffMember, include: [Payout] },
            {
              model: TransactionStatus,
              where: {
                status: TransactionStatusEnum.PENDING,
              },
            },
          ],
        });

      if (!transactions.length)
        return new BadRequestException(`No Transactions selected`);

      const expenses = transactions?.map((transaction) => {
        const totalPayable = this.calculateAmount(
          transaction?.amount,
          transaction?.staffMember?.payout?.[0],
        );
        return {
          type: 'LEAF_PAYMENT',
          date: data.date,
          payoutMethod: data.payoutMethod,
          payoutIdentity: 'M-Pesa',
          transactionId: transaction?.id,
          amount: totalPayable,
          staffMemberId: transaction?.staffMemberId,
        };
      });

      const transactionStatuses = transactions?.map((transaction) => ({
        transactionId: transaction?.id,
        status: TransactionStatusEnum.SENT,
      }));

      await this.sequelize.transaction(async (t) => {
        await this.expenseRepository.bulkCreate(expenses, { transaction: t });

        await this.transactionStatusRepository.bulkCreate(transactionStatuses, {
          transaction: t,
        });
      });

      return 'Checkout successful';
    } catch (e) {
      throw new Error(e);
    }
  }

  async getPendingTransactions() {
    try {
      const transactions = await this.transactionRepository.findAll({
        include: [
          {
            model: TransactionStatus,
            where: { status: TransactionStatusEnum.PENDING },
          },
          { model: StaffMember, include: [Payout] },
        ],
      });

      return transactions.map((transaction) => {
        transaction.amount = this.calculateAmount(
          transaction?.amount,
          transaction?.staffMember?.payout?.[0],
        );
        return transaction;
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async calculateProgress(startDate: string, endDate: string) {
    try {
      const progress: { name: string; target: number; current: number }[] = [];
      const staffMemberTransactions = await this.transactionRepository.findAll({
        where: {
          date: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
        include: [
          {
            model: StaffMember,
            include: [
              {
                model: Target,
                where: {
                  startDate: {
                    [Op.gte]: new Date(startDate),
                  },
                  endDate: {
                    [Op.lte]: new Date(endDate),
                  },
                },
              },
            ],
          },
        ],
      });

      staffMemberTransactions.forEach((transaction) => {
        const foundItem = progress.find(
          (p) => p.name === transaction.staffMember.name,
        );

        if (foundItem) {
          foundItem.current += transaction.amount;
        } else {
          progress.push({
            name: transaction.staffMember.name,
            current: transaction?.amount,
            target: transaction?.staffMember?.target?.[0]?.amount || 0,
          });
        }
      });

      return progress;
    } catch (e) {
      throw new Error(e);
    }
  }

  async calculateStaffProgress(id: number, startDate: string, endDate: string) {
    try {
      const staffMember = await this.staffMemberRepository.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Target,
            where: {
              startDate: {
                [Op.between]: [new Date(startDate), new Date(endDate)],
              },
            },
          },
        ],
      });
      const transactions = await this.transactionRepository.findAll({
        where: {
          staffMemberId: id,
          date: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
      });

      return {
        target: staffMember?.target?.[0]?.amount || 0,
        amount: transactions?.reduce(
          (accumulator, transaction) => accumulator + transaction.amount,
          0,
        ),
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  private calculateAmount(amount: number, payout: Payout) {
    if (amount <= payout.huddleRate) return 0;

    return (amount - payout.huddleRate) * payout.amountPerKg;
  }
}
