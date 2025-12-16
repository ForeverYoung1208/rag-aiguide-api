import { MigrationInterface, QueryRunner } from 'typeorm';

export class DialogAddTimestamps1765128473482 implements MigrationInterface {
  name = 'DialogAddTimestamps1765128473482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dialog" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dialog" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "dialog" DROP COLUMN "createdAt"`);
  }
}
