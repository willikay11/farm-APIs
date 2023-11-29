import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Block } from './entities/block.entity';
import { CreateBlock } from './block.model';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block)
    private readonly blockRepository: typeof Block,
  ) {}

  async create(block: CreateBlock) {
    try {
      return this.blockRepository.create<Block>(block);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll() {
    return await this.blockRepository.findAll();
  }

  async findById(id: number) {
    try {
      return await this.blockRepository.findOne<Block>({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new BadRequestException('No block exists');
    }
  }

  async edit(id: number, editBlock: CreateBlock) {
    try {
      const block = await this.blockRepository.findOne({
        where: {
          id,
        },
      });

      if (!block) return new BadRequestException('Block not found');

      return block.update({
        name: editBlock.name,
        owner: editBlock.owner,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async deactivate(id: number) {
    try {
      return await this.blockRepository.destroy<Block>({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new BadRequestException('No block exists');
    }
  }
}
