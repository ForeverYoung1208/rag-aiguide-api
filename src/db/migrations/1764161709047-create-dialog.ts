import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDialog1764161709047 implements MigrationInterface {
  name = 'CreateDialog1764161709047';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dialog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "phrase" character varying NOT NULL, "messages" jsonb, CONSTRAINT "PK_09744e0ee61b1ddf028d8eb8497" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog" ADD CONSTRAINT "FK_4b41a5eb642d2da4bc372884177" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dialog" DROP CONSTRAINT "FK_4b41a5eb642d2da4bc372884177"`,
    );
    await queryRunner.query(`DROP TABLE "dialog"`);
  }
}
