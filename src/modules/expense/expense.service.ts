import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from './entities/expense.entity';
import { CreateExpense } from './expense.model';
import { StaffMember } from '../staff/entities/staff.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense)
    private readonly expenseRepository: typeof Expense,
  ) {}

  async create(expense: CreateExpense) {
    try {
      return this.expenseRepository.create<Expense>(expense);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll() {
    return await this.expenseRepository.findAll({
      include: [StaffMember, Transaction],
    });
  }

  async findById(id: string) {
    try {
      return await this.expenseRepository.findOne<Expense>({
        where: {
          id,
        },
        include: [StaffMember, Transaction],
      });
    } catch (e) {
      throw new BadRequestException('No block exists');
    }
  }
}
