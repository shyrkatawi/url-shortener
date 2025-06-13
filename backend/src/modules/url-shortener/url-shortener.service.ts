import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateUrlDto } from "@app/modules/url-shortener/dto/create-url.dto";
import { UrlRepository } from "@app/modules/url-shortener/url.repository";
import { nanoid } from "nanoid";
import {
  GenerateAliasOptions,
  prepareGenerateAliasOptions,
} from "@app/modules/url-shortener/url-service.utils";
import { UrlEntity } from "@app/modules/url-shortener/entities/url.entity";
import { DeleteResult } from "typeorm";
import { VisitRepository } from "@app/modules/url-shortener/visit.repository";

@Injectable()
export class UrlShortenerService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly visitRepository: VisitRepository,
  ) {}

  async generateAlias(options: GenerateAliasOptions = {}): Promise<string> {
    const { retry, size }: Required<GenerateAliasOptions> = prepareGenerateAliasOptions(options);

    for (let i = -1; i < retry; i++) {
      const alias: string = nanoid(size);
      const exists: boolean = await this.urlRepository.checkIsAliasAlreadyExists(alias);
      if (!exists) {
        return alias;
      }
    }

    throw new InternalServerErrorException("Failed to generate unique alias");
  }

  async createUrl(dto: CreateUrlDto): Promise<string> {
    if (dto.alias) {
      const isAliasAlreadyExists: boolean = await this.urlRepository.checkIsAliasAlreadyExists(
        dto.alias,
      );
      if (isAliasAlreadyExists) {
        throw new ConflictException("Alias is already taken");
      }
    }

    const alias: string = dto.alias || (await this.generateAlias());

    await this.urlRepository.createUrl({
      alias,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      original: dto.url,
    });

    return alias;
  }

  async getOriginalUrl(alias: string, ip: string): Promise<string> {
    const urlEntity: UrlEntity | null = await this.urlRepository.findByAlias(alias);
    if (!urlEntity) {
      throw new NotFoundException("URL not found");
    }
    if (urlEntity.expiresAt && urlEntity.expiresAt < new Date()) {
      throw new ConflictException("URL has expired");
    }

    // increment visits count without waiting it
    void this.visitRepository.updateVisitsCount(urlEntity, ip);

    return urlEntity.original;
  }

  async getUrlAnalytics(alias: string): Promise<{
    clickCount: number;
    ips: string[];
  }> {
    const urlAnalytics: { clickCount: number; ips: string[] } | null =
      await this.urlRepository.getUrlAnalytics(alias);
    if (!urlAnalytics) {
      throw new NotFoundException("URL not found");
    }

    return urlAnalytics;
  }

  async getUrlInfo(alias: string): Promise<{
    clickCount: number;
    createdAt: Date;
    originalUrl: string;
  }> {
    const urlEntity: UrlEntity | null = await this.urlRepository.findByAlias(alias);
    if (!urlEntity) {
      throw new NotFoundException("URL not found");
    }

    return {
      clickCount: urlEntity.visits.length,
      createdAt: urlEntity.createdAt,
      originalUrl: urlEntity.original,
    };
  }

  async deleteUrl(alias: string): Promise<void> {
    const deleteResult: DeleteResult = await this.urlRepository.deleteByAlias(alias);
    if (deleteResult.affected === 0) {
      throw new NotFoundException("URL not found");
    }
  }
}
