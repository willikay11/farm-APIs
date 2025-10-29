import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import axios from 'axios';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { CheckoutTransactions, CreateTransaction } from './transaction.model';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { ReceiptStatusEnum, TransactionStatusEnum } from './enum';
import { Block } from '../block/entities/block.entity';
import { StaffMember } from '../staff/entities/staff.entity';
import { Expense } from '../expense/entities/expense.entity';
import { Payout } from '../staff/entities/payout.entity';
import { Target } from '../target/entities/target.entity';
import { TransactionFromAutomationDto } from './dto/transaction.dto';
import { Receipt } from '../receipts/entities/receipt.entity';

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

    @InjectModel(Block)
    private readonly blockRepository: typeof Block,

    @InjectModel(Receipt)
    private readonly receiptRepository: typeof Receipt
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

  async createMultiple(transactions: CreateTransaction[]) {
    try {
      return this.sequelize.transaction(async (t) => {
        const newTransactions = await this.transactionRepository.bulkCreate<Transaction>(transactions, {
          transaction: t
        });
        
        newTransactions.forEach(async(newTransaction) => {
          await this.transactionStatusRepository.create(
            {
              transactionId: newTransaction.id,
              status: TransactionStatusEnum.PENDING,
            },
            { transaction: t },
          );
        });

        return newTransactions;
      });
    } catch(e) {
      throw new Error(e)
    }
  }

  async findAll(status?: TransactionStatusEnum) {
    const where = {};

    if (status) {
      where['status'] = status;
    }

    const transactions = await this.transactionRepository.findAll({
      include: [
        Block,
        StaffMember,
        {
          model: TransactionStatus,
          where,
          separate: true,
          order: [['createdAt', 'DESC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return transactions.map((transaction) => {
      return {
        ...transaction.toJSON(),
        block: transaction.block.toJSON(),
        staffMember: transaction.staffMember.toJSON(),
        status: transaction.transactionStatuses[0]?.status,
      };
    });
  }

  async getGroupedTransactions(status?: TransactionStatusEnum) {
    const where = {};

    if (status) {
      where['status'] = status;
    }

    const transactions = await this.transactionRepository.findAll({
      where: {
        date: {
          [Op.gte]: dayjs().startOf('month').toDate(),
          [Op.lte]: dayjs().endOf('month').toDate(),
        }
      },
      include: [
        Block,
        StaffMember,
        {
          model: TransactionStatus,
          where,
          separate: true,
          order: [['createdAt', 'DESC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Transform into grouped structure
    const grouped = transactions.reduce(
      (acc, transaction) => {
        const dateKey = dayjs(transaction.date).format('YYYY-MM-DD');

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        acc[dateKey].push({
          ...transaction.toJSON(),
          date: dayjs(transaction.date).toDate(),
          block: transaction.block.toJSON(),
          staffMember: transaction.staffMember.toJSON(),
          status: transaction.transactionStatuses[0]?.status,
        });

        return acc;
      },
      {} as Record<string, any[]>,
    );

    // Convert object into array
    return Object.entries(grouped)
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateB).getTime() - new Date(dateA).getTime(),
      )
      .map(([date, txns]) => ({
        date,
        amount: txns.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.amount;
        }, 0),
        transactions: txns,
      }));
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
        status: TransactionStatusEnum.PAID,
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

  async triggerAutomation() {
    console.log('Automation triggered');
    try {
      const receipts = await this.receiptRepository.findAll({
        where: {
          status: ReceiptStatusEnum.PENDING
        }
      });

      for(const receipt of receipts) {
        setTimeout(async () => {
          console.log('Processing receipt:', receipt.id);
          await axios.post('https://dae7df764d7c.ngrok-free.app/webhook/1565f825-4eb6-4ed7-b030-c9d16fe6a1ec', {
            receiptId: receipt.id,
            fileKey: this.extractFilenameFromUrl(receipt.fileUrl)
          });
        }, 3000);
      }
      return { message: 'Automation triggered' };
    } catch (e) {
      console.error('Error during automation:', e);
    }
}

  async addTransactionFromAutomation(data: TransactionFromAutomationDto, receiptId: string) {
    try {
      const errors: string[] = [];
  
      // Step 1: Search for the receipt number
      const transaction = await this.transactionRepository.findOne({
        where: {
          receiptNo: data?.receipt_no
        }
      });

      if(transaction) return;

      // Step 2: Start reconciliation by checking if the total net_weight_kg in the bags array matches the tea_weight_kg in the totals object
      const totalKgsInReceipt = data.bags.reduce(( previousValue, currentValue) => previousValue + parseFloat(currentValue.net_weight_kg), 0);

      if(totalKgsInReceipt !== parseFloat(data.totals.tea_weight_kg)) {
        errors.push(`Net picked kgs (${totalKgsInReceipt}) for this receipt does not match tea weight in kgs (${data.totals.tea_weight_kg})`);
      }

      // Step 3: Search for the block
      const block = await this.blockRepository.findOne({
        where: {
          name: data.block
        }
      });

      if(!block) {
        errors.push(`Block ${data.block} not found`);

      }
      // Step 4: Search for the picker
      const staffMember = await this.staffMemberRepository.findOne({
        where: {
          name: { [Op.iLike]: data.picker } // case-insensitive match
        }
      });

      if(!staffMember) {
        errors.push(`Staff ${data.picker} not found`);
      }

      // Step 5: Format date to remove the time and second
      const date = dayjs(data.plucked_date).startOf('D').format('YYYY-MM-DD');

      if(date.toLocaleLowerCase() === 'invalid date') {
        errors.push(`Invalid date: ${data.plucked_date}`);
      }

      if (Number.isNaN(totalKgsInReceipt)) {
        errors.push(`Invalid amount ${totalKgsInReceipt}`);
      }
      console.log({
        staffMemberId: staffMember?.id,
        receiptNo: data.receipt_no,
        date: date.toLocaleLowerCase() === 'invalid date' ? null : date,
        blockId: block?.id,
        amount: Number.isNaN(totalKgsInReceipt) ? 0 : totalKgsInReceipt
      })
      
      // Step 6: Save to DB
      this.sequelize.transaction(async (t) => {
        const newTransaction =
        await this.transactionRepository.create<Transaction>({
          receiptId: receiptId,
          staffMemberId: staffMember?.id,
          receiptNo: data.receipt_no,
          date: date.toLocaleLowerCase() === 'invalid date' ? null : date,
          blockId: block?.id,
          amount: Number.isNaN(totalKgsInReceipt) ? 0 : totalKgsInReceipt
        }, {
          transaction: t,
        });

      await this.transactionStatusRepository.create(
        {
          transactionId: newTransaction.id,
          status: errors.length ? TransactionStatusEnum.NEEDS_INTERVENTION : TransactionStatusEnum.PENDING,
          errors: errors,
        },
        { transaction: t },
      );

      await this.receiptRepository.update({
        status: ReceiptStatusEnum.PROCESSED
      }, {
        where: {
          id: receiptId
        },
        transaction: t
      })

        return newTransaction;
      });

    } catch(e) {
      console.log(e);
      throw new Error(e);
    }
  }

  private calculateAmount(amount: number, payout: Payout) {
    if (amount <= payout.huddleRate) return 0;

    return (amount - payout.huddleRate) * payout.amountPerKg;
  }

  /**
 * Extracts the last path segment (S3 object key / filename) from a URL.
 * Works in Node and browsers, handles query strings and fragments.
 *
 * @param {string} url - The full URL (can be presigned URL or plain S3 URL)
 * @returns {string} - The filename / key (decoded), or empty string if not found
 */
 private extractFilenameFromUrl(url) {
    if (typeof url !== 'string') return '';

    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split('/').filter(Boolean);
      return parts.length ? decodeURIComponent(parts[parts.length - 1]) : '';
    } catch (err) {
      // Fallback for non-standard URLs: strip query/fragment then split
      const stripped = url.split('?')[0].split('#')[0];
      const parts = stripped.split('/').filter(Boolean);
      return parts.length ? decodeURIComponent(parts[parts.length - 1]) : '';
    }
  }
}
