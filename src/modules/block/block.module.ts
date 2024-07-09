import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Block } from './entities/block.entity';
import { BlockService } from './block.service';
import { BlockResolver } from './block.resolver';

@Module({
  imports: [SequelizeModule.forFeature([Block])],
  providers: [BlockService, BlockResolver],
})
export class BlockModule {}
