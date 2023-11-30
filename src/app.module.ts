import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StaffModule } from './modules/staff/staff.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { BlockModule } from './modules/block/block.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { TargetModule } from './modules/target/target.module';

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
    TransactionModule,
    ExpenseModule,
    TargetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
