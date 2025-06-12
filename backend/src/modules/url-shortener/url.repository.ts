import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { UrlEntity } from "@app/modules/url-shortener/entities/url.entity";

export class UrlRepository {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ) {}

  async getUrlAnalytics(alias: string): Promise<{ clickCount: number; ips: string[] } | null> {
    const url: UrlEntity | null = await this.urlRepository
      .createQueryBuilder("url")
      .leftJoinAndSelect("url.visits", "visit")
      .where("url.alias = :alias", { alias })
      .orderBy("visit.date", "ASC")
      .getOne();

    if (!url) {
      return null;
    }

    return {
      clickCount: url.visits.length,
      ips: url.visits.slice(0, 5).map((visit) => visit.ip),
    };
  }

  async findByAlias(alias: string): Promise<UrlEntity | null> {
    return this.urlRepository.findOne({ where: { alias }, relations: ["visits"] });
  }

  async checkIsAliasAlreadyExists(alias: string): Promise<boolean> {
    const existing: UrlEntity | null = await this.findByAlias(alias);
    return !!existing;
  }

  async createUrl(dto: Pick<UrlEntity, "alias" | "expiresAt" | "original">): Promise<UrlEntity> {
    const newUrlEntity: UrlEntity = this.urlRepository.create(dto);

    await this.urlRepository.insert(newUrlEntity);

    return newUrlEntity;
  }

  async deleteByAlias(alias: string): Promise<DeleteResult> {
    return this.urlRepository.delete({ alias });
  }
}
