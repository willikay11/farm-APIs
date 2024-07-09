import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Target } from './entities/target.entity';
import { TargetService } from './target.service';
import { TargetResolver } from './target.resolver';

@Module({
  imports: [SequelizeModule.forFeature([Target])],
  providers: [TargetService, TargetResolver],
})
export class TargetModule {}
