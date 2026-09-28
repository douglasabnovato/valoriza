/*
 * server.ts · ponto de entrada: conecta ao banco (com migrations), garante o admin do ambiente e sobe a API.
 */
import "reflect-metadata";
import { config } from "./config";
import { createDatabaseConnection } from "./database";
import { createApp } from "./app";
import { seedAdmin } from "./database/seedAdmin";

/* Inicia a API e encerra com código 1 se o banco não abrir. */
async function main() {
  await createDatabaseConnection();
  const admin = await seedAdmin();
  if (admin !== "ignorado") console.log(`Admin do ambiente ${admin}.`);
  createApp().listen(config.port, () => console.log(`Valoriza API em http://localhost:${config.port}`));
}

main().catch((error) => {
  console.error("Falha ao iniciar:", error.message);
  process.exit(1);
});
/* fim de server.ts */
