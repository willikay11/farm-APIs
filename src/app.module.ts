import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StaffModule } from './modules/staff/staff.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffMember } from './modules/staff/entities/staff.entity';
import { Payout } from './modules/staff/entities/payout.entity';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { BlockModule } from './modules/block/block.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      database:
        process.env.NODE_ENV === 'development'
          ? process.env.DB_NAME_DEVELOPMENT
          : process.env.NODE_ENV === 'test'
            ? process.env.DB_NAME_TEST
            : process.env.DB_NAME_PRODUCTION,
    }),
    StaffModule,
    BlockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
