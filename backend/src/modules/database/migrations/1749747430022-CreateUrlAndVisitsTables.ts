import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrlAndVisitsTables1749747430022 implements MigrationInterface {
  name = "CreateUrlAndVisitsTables1749747430022";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "visits"
       (
         "id"    uuid                     NOT NULL DEFAULT uuid_generate_v4(),
         "date"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
         "ip"    character varying        NOT NULL,
         "urlId" uuid,
         CONSTRAINT "PK_0b0b322289a41015c6ea4e8bf30" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "urls"
       (
         "alias"     character varying(20)    NOT NULL,
         "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
         "expiresAt" TIMESTAMP WITH TIME ZONE,
         "id"        uuid                     NOT NULL DEFAULT uuid_generate_v4(),
         "original"  character varying(2048)  NOT NULL,
         CONSTRAINT "UQ_8baf2124828eb1966ecacfceccb" UNIQUE ("alias"),
         CONSTRAINT "PK_eaf7bec915960b26aa4988d73b0" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits"
        ADD CONSTRAINT "FK_9049a5673b99d77f1a9d3fea41a" FOREIGN KEY ("urlId") REFERENCES "urls" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visits"
        DROP CONSTRAINT "FK_9049a5673b99d77f1a9d3fea41a"`,
    );
    await queryRunner.query(`DROP TABLE "urls"`);
    await queryRunner.query(`DROP TABLE "visits"`);
  }
}
