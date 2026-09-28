/*
 * database/index.ts · abre a conexão TypeORM e aplica as migrations pendentes na subida.
 * Os caminhos aceitam .ts (desenvolvimento) e .js (build em dist/).
 */
import path from "path";
import { createConnection, Connection } from "typeorm";
import { config } from "../config";

/* Cria a conexão; nos testes use database ":memory:". */
export function createDatabaseConnection(database: string = config.databaseFile): Promise<Connection> {
  return createConnection({
    type: "sqlite",
    database,
    entities: [path.join(__dirname, "..", "entities", "*.{ts,js}")],
    migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],
    migrationsRun: true,
    logging: false,
  });
}
/* fim de database/index.ts */
