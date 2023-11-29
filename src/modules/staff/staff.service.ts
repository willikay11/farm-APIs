import { Injectable } from '@nestjs/common';
import { StaffMember } from './entities/staff.entity';
import { Payout } from './entities/payout.entity';
import { CreateStaffMember } from './staff.model';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class StaffService {
  constructor(
    private readonly sequelize: Sequelize,

    @InjectModel(StaffMember)
    private readonly staffMemberRepository: typeof StaffMember,

    @InjectModel(Payout)
    private readonly payoutRepository: typeof Payout,
  ) {}

  async create(staffMember: CreateStaffMember) {
    try {
      return await this.sequelize.transaction(async (t) => {
        const staff = await this.staffMemberRepository.create<StaffMember>(
          {
            type: staffMember.type,
            name: staffMember.name,
            idNumber: staffMember.idNumber,
          },
          { transaction: t },
        );

        await this.payoutRepository.create<Payout>(
          {
            staffMemberId: staff.id,
            huddleRate: staffMember.huddleRate,
            retainer: staffMember.retainer,
            amountPerKg: staffMember.amountPerKg,
            phoneNumber: staffMember.phoneNumber,
          },
          { transaction: t },
        );

        return staff;
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(id: string) {
    try {
      return await this.staffMemberRepository.findOne<StaffMember>({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new Error('No staff member exists');
    }
  }

  async findAll() {
    return await this.staffMemberRepository.findAll();
  }
}
