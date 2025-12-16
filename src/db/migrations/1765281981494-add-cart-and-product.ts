import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCartAndProduct1765281981494 implements MigrationInterface {
  name = 'AddCartAndProduct1765281981494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "price" integer NOT NULL, "description" text NOT NULL, "brand" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "carts_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cart_id" uuid NOT NULL, "product_id" integer NOT NULL, "quantity" integer NOT NULL, "price_for_one" integer NOT NULL, "dialog_id" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_15ebdaf94212168cb57cb25b337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_products" ADD CONSTRAINT "FK_6788cbadaebf3994a83a081470c" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_products" ADD CONSTRAINT "FK_79383ad92abae6b7538af7b6c43" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_products" ADD CONSTRAINT "FK_301e65335c91227f25df5c3dfd8" FOREIGN KEY ("dialog_id") REFERENCES "dialog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carts_products" DROP CONSTRAINT "FK_301e65335c91227f25df5c3dfd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_products" DROP CONSTRAINT "FK_79383ad92abae6b7538af7b6c43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_products" DROP CONSTRAINT "FK_6788cbadaebf3994a83a081470c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`,
    );
    await queryRunner.query(`DROP TABLE "carts_products"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "cart"`);
  }
}
