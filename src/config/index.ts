import { registerAs } from '@nestjs/config';
import { Dialect } from 'sequelize';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  db: string;
  dialect: Dialect;
}

const databaseConfig = registerAs('database', (): DatabaseConfig => {
  return {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    db: process.env.DB_NAME,
    dialect: 'postgres',
  };
});

export { databaseConfig };
