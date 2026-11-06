/*
 * Tag.ts · valor da empresa usado para classificar um elogio.
 */
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { randomUUID as uuid } from "crypto";

@Entity("tags")
class Tag {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /* Gera o UUID na criação da instância. */
  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Tag };
/* fim de Tag.ts */
