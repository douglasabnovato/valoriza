/*
 * seedAdmin.ts · garante um admin na subida quando ADMIN_EMAIL e ADMIN_PASSWORD existem no ambiente.
 * Motivo: no plano gratuito do Render não há Shell para rodar admin:promote e o disco é apagado a cada reinício.
 */
import { getCustomRepository } from "typeorm";
import { hash } from "bcryptjs";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { config } from "../config";

/* Cria o admin se o e-mail não existir; se existir, só garante admin = true. Sem variáveis, não faz nada. */
export async function seedAdmin(email = config.adminEmail, password = config.adminPassword): Promise<"criado" | "promovido" | "ignorado"> {
  if (!email || !password) return "ignorado";
  if (password.length < 8) throw new Error("ADMIN_PASSWORD precisa de no mínimo 8 caracteres.");
  const repository = getCustomRepository(UsersRepositories);
  const normalized = email.trim().toLowerCase();
  const existing = await repository.findOne({ email: normalized });
  if (existing) {
    await repository.update(existing.id, { admin: true });
    return "promovido";
  }
  const user = repository.create({ name: "Admin", email: normalized, admin: true, password: await hash(password, config.bcryptCost) });
  await repository.save(user);
  return "criado";
}
/* fim de seedAdmin.ts */
