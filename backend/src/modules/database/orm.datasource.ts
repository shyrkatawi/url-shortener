import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { UrlEntity } from "@app/modules/url-shortener/entities/url.entity";
import { VisitEntity } from "@app/modules/url-shortener/entities/visit.entity";
import migrations from "./migrations";

dotenv.config({ path: `.env` });

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT!,
  synchronize: true,
  entities: [UrlEntity, VisitEntity],
  migrations,
  migrationsRun: process.env.DB_MIGRATIONS_RUN === "true",
  migrationsTableName: process.env.DATABASE_MIGRATIONS_TABLE_NAME,
});
