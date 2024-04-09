import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1712639577141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "type" character varying NOT NULL, "userId" uuid, "savingsId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_b5ccf9206f6c161d04d27c5153c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_f58b6dbf7a57158d080c135c835" FOREIGN KEY ("savingsId") REFERENCES "savings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_f58b6dbf7a57158d080c135c835"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_b5ccf9206f6c161d04d27c5153c"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
