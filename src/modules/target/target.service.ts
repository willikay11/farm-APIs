import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StaffMember } from '../staff/entities/staff.entity';
import { Target } from './entities/target.entity';
import { CreateTarget } from './target.model';

@Injectable()
export class TargetService {
  constructor(
    @InjectModel(Target)
    private readonly targetRepository: typeof Target,
  ) {}

  async create(target: CreateTarget) {
    try {
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
