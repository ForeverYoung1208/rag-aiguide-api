import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductMakeCodeUniq1765300877270 implements MigrationInterface {
  name = 'ProductMakeCodeUniq1765300877270';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61"`,
    );
  }
}
