import * as dotenv from "dotenv";

dotenv.config({ path: `.env` });

export const SWAGGER_BASE_URL = `${process.env.APP_URL}:${process.env.APP_PORT}`;
