import type { ConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import type { PostgresConnectionCredentialsOptions } from "typeorm/driver/postgres/PostgresConnectionCredentialsOptions";
import migrations from "./migrations";

export const databaseOptions = (
  config: ConfigService,
): TypeOrmModuleOptions & PostgresConnectionCredentialsOptions => ({
  type: <"postgres">config.get("DB_TYPE"),
  host: config.get("DB_HOST"),
  port: Number(config.get("DB_PORT")),
  database: config.get("DB_NAME"),
  username: config.get("DB_USERNAME"),
  password: config.get("DB_PASSWORD"),
  logging: config.get("DB_LOGGING") == true,
  synchronize: false,
  migrations,
  migrationsRun: config.get("DB_MIGRATIONS_RUN") == true,
  migrationsTableName: config.get("DB_MIGRATIONS_TABLE_NAME"),
  autoLoadEntities: true,
});
