import { BadRequestException, Injectable } from '@nestjs/common';
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
            imageUrl: staffMember.imageUrl,
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
      console.log(e);
      throw new Error(e);
    }
  }

  async edit(id: string, staffMember: EditStaffMember) {
    try {
      return await this.sequelize.transaction(async (t) => {
        const staff = await this.staffMemberRepository.findOne({
          where: {
            id,
          },
        });
  
        if (!staff) return new BadRequestException('Staff member not found');

        const newStaff = await staff.update({
          name: staffMember.name,
          type: staffMember.type,
          imageUrl: staffMember.imageUrl
        });

        await this.payoutRepository.destroy({
          where: {
            staffMemberId: staff.id,
          },
        });

        const newPayout = await this.payoutRepository.create<Payout>(
          {
            staffMemberId: staff.id,
            huddleRate: staffMember.huddleRate,
            retainer: staffMember.retainer,
            amountPerKg: staffMember.amountPerKg,
            phoneNumber: staffMember.phoneNumber,
          },
          { transaction: t },
        );

        return {
          ...newStaff.toJSON(),
          payout: {
            ...newPayout.toJSON()
          }
        };
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

      if (!staff) return new BadRequestException('Staff member not found');

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
      throw new BadRequestException('No staff member exists');
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
      throw new BadRequestException('No staff member exists');
    }
  }

  async findAll() {
    const staffMembers =  await this.staffMemberRepository.findAll({
      include: [Payout]
    });

    return staffMembers.map((staffMember) => {
      const payout = staffMember.payout[0];
      return {
        id: staffMember.id,
        name: staffMember.name,
        imageUrl: staffMember.imageUrl,
        type: staffMember.type,
        createdAt: staffMember.createdAt,
        updatedAt: staffMember.updatedAt,
        payout: {
          id: payout.id,
          huddleRate: payout.huddleRate,
          amountPerKg: payout.amountPerKg,
          retainer: payout.retainer,
          createdAt: payout.createdAt,
          updatedAt: payout.updatedAt,
        }
      }
    })
  }
}
