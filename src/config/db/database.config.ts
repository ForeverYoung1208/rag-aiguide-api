import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { dataSourceOptions } from './data-source-options.config';
import { goodsDataSourceOptions } from './goods-data-source-options.config';

export const databaseConfig = registerAs(
  'databaseConfig',
  (): TypeOrmModuleOptions => dataSourceOptions(),
);

export const goodsDatabaseConfig = registerAs('goodsDatabaseConfig', () =>
  goodsDataSourceOptions(),
);
