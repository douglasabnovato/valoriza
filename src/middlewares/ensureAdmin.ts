/*
 * ensureAdmin · permite seguir apenas se o usuário do token ainda existe e é admin.
 */
import { Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";

/* Responde 401 se o usuário não existe mais e 403 se não for admin. */
export async function ensureAdmin(request: Request, response: Response, next: NextFunction) {
  const user = await getCustomRepository(UsersRepositories).findOne(request.user_id);
  if (!user) {
    return response.status(401).json({ error: "Usuário não encontrado. Faça login de novo." });
  }
  if (!user.admin) {
    return response.status(403).json({ error: "Apenas administradores podem fazer isso." });
  }
  return next();
}
/* fim de ensureAdmin */
