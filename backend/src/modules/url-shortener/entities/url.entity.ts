import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { VisitEntity } from "./visit.entity";

@Entity("urls")
export class UrlEntity {
  @Column({ length: 20, unique: true })
  alias: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamptz", nullable: true })
  expiresAt: Date | null;

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 2048 })
  original: string;

  @OneToMany(() => VisitEntity, (visit) => visit.url, { cascade: true })
  visits: VisitEntity[];
}
