import { MigrationInterface, QueryRunner } from 'typeorm';

export class CartProductsAddCascadeProductsDrop1765750857510
  implements MigrationInterface
{
  name = 'CartProductsAddCascadeProductsDrop1765750857510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carts_products" DROP CONSTRAINT "FK_79383ad92abae6b7538af7b6c43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_products" ADD CONSTRAINT "FK_79383ad92abae6b7538af7b6c43" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carts_products" DROP CONSTRAINT "FK_79383ad92abae6b7538af7b6c43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_products" ADD CONSTRAINT "FK_79383ad92abae6b7538af7b6c43" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
