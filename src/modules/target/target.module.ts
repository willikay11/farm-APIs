import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Target } from './entities/target.entity';
import { TargetService } from './target.service';
import { TargetResolver } from './target.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Target]), AuthModule],
  providers: [TargetService, TargetResolver],
})
export class TargetModule {}
