import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UrlEntity } from "./url.entity";

@Entity("visits")
export class VisitEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column()
  ip: string;

  @ManyToOne(() => UrlEntity, (urlEntity) => urlEntity.visits, { onDelete: "CASCADE" })
  url: UrlEntity;
}
