import { Injectable } from '@nestjs/common';
import { StaffMember } from './entities/staff.entity';
import { Payout } from './entities/payout.entity';
import {
  CreatePayout,
  CreateStaffMember,
  EditStaffMember,
} from './staff.model';
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

  async edit(id: string, staffMember: EditStaffMember) {
    try {
      const staff = await this.staffMemberRepository.findOne({
        where: {
          id,
        },
      });

      if (!staff) return new Error('Staff member not found');

      return await staff.update({
        idNumber: staffMember.idNumber,
        name: staffMember.name,
        type: staffMember.type,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async editPayout(id: string, payout: CreatePayout) {
    try {
      const staff = await this.staffMemberRepository.findOne({
        where: {
          id,
        },
      });

      if (!staff) return new Error('Staff member not found');

      return await this.sequelize.transaction(async (t) => {
        const newPayout = await this.payoutRepository.create<Payout>(
          {
            staffMemberId: staff.id,
            huddleRate: payout.huddleRate,
            retainer: payout.retainer,
            amountPerKg: payout.amountPerKg,
            phoneNumber: payout.phoneNumber,
          },
          { transaction: t },
        );

        await this.payoutRepository.destroy({
          where: {
            staffMemberId: staff.id,
          },
        });

        return newPayout;
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async deactivate(id: string) {
    try {
      return await this.staffMemberRepository.destroy<StaffMember>({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new Error('No staff member exists');
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
