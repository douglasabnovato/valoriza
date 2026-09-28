/*
 * config.ts · configuração lida do ambiente (12-Factor III). Falha na subida se o segredo do JWT faltar.
 */
import "dotenv/config";
import path from "path";

/* Lê uma variável obrigatória ou encerra com mensagem clara. */
function required(name: string, minLength = 1): string {
  const value = process.env[name];
  if (!value || value.length < minLength) {
    throw new Error(`Variável de ambiente ${name} ausente ou curta demais (mínimo ${minLength} caracteres). Veja .env.example.`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: required("JWT_SECRET", 32),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  databaseFile: process.env.DATABASE_FILE || path.resolve("src", "database", "database.sqlite"),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  bcryptCost: Number(process.env.BCRYPT_COST) || 10,
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
};
/* fim de config.ts */
