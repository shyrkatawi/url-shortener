import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UrlShortenerModule } from "@app/modules/url-shortener/url-shortener.module";
import { DatabaseModule } from "@app/modules/database/database.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UrlShortenerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
