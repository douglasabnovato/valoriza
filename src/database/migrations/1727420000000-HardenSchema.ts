/*
 * HardenSchema · reconstrói as tabelas no SQLite com as restrições que faltavam:
 * e-mail e tag únicos (sem diferenciar maiúsculas), senha obrigatória, datas válidas,
 * CHECK de tamanho, FKs coerentes (CASCADE/RESTRICT) e índices nas FKs de compliments.
 * O SQLite não altera restrições com ALTER TABLE, então segue o roteiro "criar, copiar, trocar".
 */
import { MigrationInterface, QueryRunner } from "typeorm";

export class HardenSchema1727420000000 implements MigrationInterface {
  /* Aplica o schema endurecido preservando os dados válidos. */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users_new" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL CHECK (length("name") BETWEEN 1 AND 120),
        "email" varchar NOT NULL COLLATE NOCASE UNIQUE,
        "admin" boolean NOT NULL DEFAULT (0),
        "password" varchar NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
      )`);
    await queryRunner.query(`
      INSERT INTO "users_new" ("id", "name", "email", "admin", "password", "created_at", "updated_at")
      SELECT "id", substr(trim("name"), 1, 120), lower(trim("email")), coalesce("admin", 0),
             coalesce("password", '!'), coalesce("created_at", datetime('now')), coalesce("updated_at", datetime('now'))
      FROM "users"
      WHERE length(trim(coalesce("name", ''))) > 0`);

    await queryRunner.query(`
      CREATE TABLE "tags_new" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL COLLATE NOCASE UNIQUE CHECK (length("name") BETWEEN 1 AND 50),
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
      )`);
    await queryRunner.query(`
      INSERT INTO "tags_new" ("id", "name", "created_at", "updated_at")
      SELECT "id", substr(trim("name"), 1, 50), coalesce("created_at", datetime('now')), coalesce("updated_at", datetime('now'))
      FROM "tags"
      WHERE length(trim(coalesce("name", ''))) > 0`);

    await queryRunner.query(`CREATE TEMP TABLE "compliments_tmp" AS SELECT * FROM "compliments"`);
    await queryRunner.query(`DROP TABLE "compliments"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`ALTER TABLE "users_new" RENAME TO "users"`);
    await queryRunner.query(`ALTER TABLE "tags_new" RENAME TO "tags"`);

    await queryRunner.query(`
      CREATE TABLE "compliments" (
        "id" varchar PRIMARY KEY NOT NULL,
        "user_sender" varchar NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "user_receiver" varchar NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "tag_id" varchar NOT NULL REFERENCES "tags" ("id") ON DELETE RESTRICT,
        "message" varchar NOT NULL CHECK (length("message") BETWEEN 1 AND 500),
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        CHECK ("user_sender" <> "user_receiver")
      )`);
    await queryRunner.query(`
      INSERT INTO "compliments" ("id", "user_sender", "user_receiver", "tag_id", "message", "created_at")
      SELECT c."id", c."user_sender", c."user_receiver", c."tag_id", substr(trim(c."message"), 1, 500), coalesce(c."created_at", datetime('now'))
      FROM "compliments_tmp" c
      JOIN "users" s ON s."id" = c."user_sender"
      JOIN "users" r ON r."id" = c."user_receiver"
      JOIN "tags" t ON t."id" = c."tag_id"
      WHERE length(trim(coalesce(c."message", ''))) > 0 AND c."user_sender" <> c."user_receiver"`);
    await queryRunner.query(`DROP TABLE "compliments_tmp"`);
    await queryRunner.query(`CREATE INDEX "idx_compliments_receiver" ON "compliments" ("user_receiver", "created_at")`);
    await queryRunner.query(`CREATE INDEX "idx_compliments_sender" ON "compliments" ("user_sender", "created_at")`);
    await queryRunner.query(`CREATE INDEX "idx_compliments_tag" ON "compliments" ("tag_id")`);
  }

  /* A reconstrução não é reversível sem perda de restrições; restaure o backup do arquivo .sqlite se precisar. */
  public async down(): Promise<void> {
    throw new Error("HardenSchema é irreversível: restaure o backup do banco para voltar.");
  }
}
/* fim de HardenSchema */
