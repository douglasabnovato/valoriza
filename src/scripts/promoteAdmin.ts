/*
 * promoteAdmin.ts · operação: torna admin o usuário do e-mail informado (RN06).
 * Uso: npm run admin:promote -- pessoa@empresa.com
 */
import "reflect-metadata";
import { getCustomRepository } from "typeorm";
import { createDatabaseConnection } from "../database";
import { UsersRepositories } from "../repositories/UsersRepositories";

/* Promove o usuário ou avisa que o e-mail não existe. */
async function main() {
  const email = String(process.argv[2] ?? "").trim().toLowerCase();
  if (!email) throw new Error("Informe o e-mail: npm run admin:promote -- pessoa@empresa.com");
  const connection = await createDatabaseConnection();
  const repository = getCustomRepository(UsersRepositories);
  const user = await repository.findOne({ email });
  if (!user) throw new Error(`Nenhum usuário com o e-mail ${email}.`);
  await repository.update(user.id, { admin: true });
  console.log(`${user.name} agora é admin.`);
  await connection.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
/* fim de promoteAdmin.ts */
