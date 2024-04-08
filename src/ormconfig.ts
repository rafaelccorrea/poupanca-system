import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [path.resolve(__dirname, './database/entities/*.entity{.ts,.js}')],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  logger: 'advanced-console',
  migrations: [path.resolve(__dirname, './database/migrations/*{.ts,.js}')],
};

export const configs = new DataSource(config);
