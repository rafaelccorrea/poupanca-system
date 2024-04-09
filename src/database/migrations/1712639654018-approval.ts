import { MigrationInterface, QueryRunner } from 'typeorm';

export class Approval1712639654018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "approval" ("id" SERIAL NOT NULL, "userId" uuid, "savingsId" integer, CONSTRAINT "PK_d011f8771b16fe35f12779ca3d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "approval" ADD CONSTRAINT "FK_81c96550ac21d5e899da7d76e18" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "approval" ADD CONSTRAINT "FK_885eef0485dcb2158a2518f4d63" FOREIGN KEY ("savingsId") REFERENCES "savings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "approval" DROP CONSTRAINT "FK_885eef0485dcb2158a2518f4d63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "approval" DROP CONSTRAINT "FK_81c96550ac21d5e899da7d76e18"`,
    );
    await queryRunner.query(`DROP TABLE "approval"`);
  }
}
