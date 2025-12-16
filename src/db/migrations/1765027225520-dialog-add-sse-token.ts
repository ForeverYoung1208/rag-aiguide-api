import { MigrationInterface, QueryRunner } from 'typeorm';

export class DialogAddSseToken1765027225520 implements MigrationInterface {
  name = 'DialogAddSseToken1765027225520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dialog" ADD "sse_token" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dialog" DROP COLUMN "sse_token"`);
  }
}
