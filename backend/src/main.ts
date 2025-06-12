import { NestFactory } from "@nestjs/core";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "@app/app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const setupGlobalPipes = (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
};

const setupSwagger = (app: INestApplication, configService: ConfigService): void => {
  const baseUrl = configService.get<string>("APP_URL");
  const port = configService.get<string>("APP_PORT");
  const options = new DocumentBuilder()
    .setTitle("URL shortening service")
    .setVersion("1.0")
    .addServer(`${baseUrl}:${port}`)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup("api", app, document);
};

const startApplication = async (
  app: INestApplication,
  configService: ConfigService,
): Promise<void> => {
  const port = configService.get<string>("APP_PORT");
  await app.listen(port!);
  console.log(`Application is running on port: ${port}`);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupGlobalPipes(app);
  setupSwagger(app, configService);

  await startApplication(app, configService);
}

void bootstrap();
