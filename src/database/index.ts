/*
 * database/index.ts · abre a conexão TypeORM e aplica as migrations pendentes na subida.
 * Os caminhos aceitam .ts (desenvolvimento) e .js (build em dist/).
 */
import path from "path";
import { DataSource } from "typeorm";
import { config } from "../config";

let current: DataSource | undefined;

/* Cria a conexão; nos testes use database ":memory:". */
export async function createDatabaseConnection(database: string = config.databaseFile): Promise<DataSource> {
  current = new DataSource({
    type: "better-sqlite3",
    database,
    entities: [path.join(__dirname, "..", "entities", "*.{ts,js}")],
    migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],
    migrationsRun: true,
    logging: false,
  });
  return current.initialize();
}

/* Devolve a conexão aberta na subida. */
export function getDataSource(): DataSource {
  if (!current) throw new Error("Banco de dados não iniciado.");
  return current;
}
/* fim de database/index.ts */
