import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserUuid1622140147061 implements MigrationInterface {
  name = 'UserUuid1622140147061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "cellphone" character varying NOT NULL,
                "cpf" character varying NOT NULL,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e57d" UNIQUE ("cellphone"),
                CONSTRAINT "UQ_c080f80094e77e530d5d327f5d9" UNIQUE ("cpf")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP EXTENSION IF EXISTS "uuid-ossp";
        `);
  }
}
