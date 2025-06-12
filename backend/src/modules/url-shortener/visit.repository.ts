import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { UrlEntity } from "@app/modules/url-shortener/entities/url.entity";
import { VisitEntity } from "@app/modules/url-shortener/entities/visit.entity";

export class VisitRepository {
  constructor(
    @InjectRepository(VisitEntity)
    private readonly visitRepository: Repository<VisitEntity>,
  ) {}

  async updateVisitsCount(url: UrlEntity, ip: string): Promise<UpdateResult> {
    const newVisit: VisitEntity = this.visitRepository.create({ url, ip });

    return this.visitRepository.insert(newVisit);
  }
}
