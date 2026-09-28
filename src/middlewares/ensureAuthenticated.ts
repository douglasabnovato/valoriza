/*
 * ensureAuthenticated · exige "Authorization: Bearer <jwt>" válido e assinado com o segredo do ambiente.
 */
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { config } from "../config";

interface IPayload {
  sub: string;
}

/* Coloca o id do usuário em request.user_id ou responde 401. */
export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const [scheme, token] = (request.headers.authorization ?? "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ error: "Faça login para continuar." });
  }
  try {
    const { sub } = verify(token, config.jwtSecret, { algorithms: ["HS256"] }) as IPayload;
    request.user_id = sub;
    return next();
  } catch {
    return response.status(401).json({ error: "Sessão inválida ou expirada. Faça login de novo." });
  }
}
/* fim de ensureAuthenticated */
