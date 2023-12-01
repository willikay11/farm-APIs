import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StaffMember } from '../staff/entities/staff.entity';
import { Target } from './entities/target.entity';
import { CreateTarget } from './target.model';
import { Op } from 'sequelize';

@Injectable()
export class TargetService {
  constructor(
    @InjectModel(Target)
    private readonly targetRepository: typeof Target,
  ) {}

  async create(target: CreateTarget) {
    try {
      const currentTarget = await this.targetRepository.findOne({
        where: {
          staffMemberId: target.staffMemberId,
          startDate: {
            [Op.between]: [
              new Date(target.startDate),
              new Date(target.endDate),
            ],
          },
        },
      });

      if (currentTarget)
        return new BadRequestException(
          'Staff Member already has target for the selected time period',
        );
      return this.targetRepository.create<Target>(target);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll() {
    return await this.targetRepository.findAll({
      include: [StaffMember],
    });
  }

  async findById(id: number) {
    try {
      return await this.targetRepository.findOne<Target>({
        where: {
          id,
        },
        include: [StaffMember],
      });
    } catch (e) {
      throw new BadRequestException('No target exists');
    }
  }
}
