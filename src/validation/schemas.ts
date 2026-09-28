/*
 * schemas.ts · validação de entrada com zod (RN01 a RN04); falha rápido com 400.
 */
import { z, ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(120, "Nome com no máximo 120 caracteres."),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(254),
  password: z.string().min(8, "A senha precisa de pelo menos 8 caracteres.").max(72, "A senha pode ter no máximo 72 caracteres."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});

export const createTagSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da tag.").max(50, "Tag com no máximo 50 caracteres."),
});

export const createComplimentSchema = z.object({
  tag_id: z.string().uuid("tag_id inválido."),
  user_receiver: z.string().uuid("user_receiver inválido."),
  message: z.string().trim().min(1, "Escreva a mensagem do elogio.").max(500, "Mensagem com no máximo 500 caracteres."),
});

/* Valida o corpo e devolve os dados tipados, ou lança AppError 400 com a primeira mensagem. */
export function parse<T>(schema: ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body ?? {});
  if (!result.success) {
    throw new AppError(result.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }
  return result.data;
}
/* fim de schemas.ts */
