import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { seed } from '../../../db-goods/seed';

@Injectable()
export class GoodsSqlRepository {
  logger = new Logger(GoodsSqlRepository.name);
  private readonly pool: Pool;
  constructor(private config: ConfigService) {
    const goodsDatabaseConfig = this.config.get('goodsDatabaseConfig')();
    const host = goodsDatabaseConfig.host;
    const port = goodsDatabaseConfig.port;
    const database = goodsDatabaseConfig.database;
    const user = goodsDatabaseConfig.username;
    const password = goodsDatabaseConfig.password;

    this.pool = new Pool({
      host,
      port,
      database,
      user,
      password,
    });

    void (async () => {
      this.logger.log('Checking goods database state if it needs seeding...');
      await this.checkAndSeed();
    })();
  }

  async checkAndSeed(): Promise<void> {
    let res;
    const goodsDatabaseConfig = this.config.get('goodsDatabaseConfig')();
    const mainConfig = this.config.get('databaseConfig')();
    const host = goodsDatabaseConfig.host;
    const port = goodsDatabaseConfig.port;
    const database = goodsDatabaseConfig.database;
    const fullAccessUser = mainConfig.username;
    const fullAccessPassword = mainConfig.password;
    const fullAccessPool = new Pool({
      host,
      port,
      database,
      user: fullAccessUser,
      password: fullAccessPassword,
    });
    try {
      res = await fullAccessPool.query(`SELECT * FROM public.item`);
    } catch (error) {
      this.logger.error(error);
      if ((error as any).code !== '42P01') {
        throw error;
      }
    }

    if (!res?.rows?.length) {
      this.logger.log('Seeding goods database with test data...');
      await fullAccessPool.query(seed);
      this.logger.warn('Goods database seeded with test data.');
    } else {
      this.logger.warn('Goods database has data, no seeding needed.');
    }
    await fullAccessPool.end();
  }

  async executeSql(sqlExpression: string): Promise<any> {
    const resRaw = await this.pool.query(sqlExpression);
    return resRaw.rows;
  }

  async executeSqlRaw(sqlExpression: string): Promise<any> {
    const resRaw = await this.pool.query(sqlExpression);
    return resRaw;
  }
}
