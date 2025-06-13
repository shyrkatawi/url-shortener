import { Module } from "@nestjs/common";
import { UrlShortenerController } from "@app/modules/url-shortener/url-shortener.controller";
import { UrlShortenerService } from "@app/modules/url-shortener/url-shortener.service";
import { UrlRepository } from "@app/modules/url-shortener/url.repository";
import { DatabaseModule } from "@app/modules/database/database.module";
import { UrlEntity } from "@app/modules/url-shortener/entities/url.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VisitEntity } from "@app/modules/url-shortener/entities/visit.entity";
import { VisitRepository } from "@app/modules/url-shortener/visit.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity, VisitEntity]), DatabaseModule],
  controllers: [UrlShortenerController],
  providers: [VisitRepository, UrlRepository, UrlShortenerService],
  exports: [],
})
export class UrlShortenerModule {}
