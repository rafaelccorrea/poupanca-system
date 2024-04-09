import { MigrationInterface, QueryRunner } from 'typeorm';

export class SavingsSubscription1712639628220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "savings_subscription" ("id" SERIAL NOT NULL, "userId" uuid, "savingsId" integer, CONSTRAINT "PK_9b15f14c58afcb47a54e9bb9c05" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "savings_subscription" ADD CONSTRAINT "FK_307c72f88b5f3c4c71e9f00559a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "savings_subscription" ADD CONSTRAINT "FK_c80a07f1f460e2b08db7a7502bb" FOREIGN KEY ("savingsId") REFERENCES "savings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "savings_subscription" DROP CONSTRAINT "FK_c80a07f1f460e2b08db7a7502bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "savings_subscription" DROP CONSTRAINT "FK_307c72f88b5f3c4c71e9f00559a"`,
    );
    await queryRunner.query(`DROP TABLE "savings_subscription"`);
  }
}
