import { MigrationInterface, QueryRunner } from 'typeorm';

export class Savings1712639491610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "savings" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "ownerId" uuid, CONSTRAINT "PK_9865cfa02f5b35c3eb0c540fcd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "savings" ADD CONSTRAINT "FK_c28a915aa35f66cd8b731145e85" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "savings" DROP CONSTRAINT "FK_c28a915aa35f66cd8b731145e85"`,
    );
    await queryRunner.query(`DROP TABLE "savings"`);
  }
}
