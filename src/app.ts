/*
 * app.ts · monta o Express: segurança (helmet, CORS), JSON limitado, rotas e tratamento de erros.
 */
import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes";
import { AppError } from "./errors/AppError";
import { config } from "./config";

/* Cria a aplicação (a conexão com o banco é aberta antes, em server.ts ou nos testes). */
export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: "10kb" }));

  app.get("/health", (request, response) => response.json({ status: "ok" }));
  app.use(router);

  app.use((request: Request, response: Response) => {
    response.status(404).json({ error: "Rota não encontrada." });
  });

  app.use((err: Error & { type?: string }, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.status).json({ error: err.message });
    }
    if (err.type === "entity.parse.failed") {
      return response.status(400).json({ error: "JSON inválido no corpo da requisição." });
    }
    console.error(err);
    return response.status(500).json({ error: "Erro interno. Tente novamente em instantes." });
  });

  return app;
}
/* fim de app.ts */
