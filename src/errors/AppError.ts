/*
 * AppError.ts · erro de domínio com status HTTP; qualquer outro erro vira 500 genérico.
 */
export class AppError extends Error {
  /* Cria o erro com mensagem para o cliente e status HTTP (4xx). */
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "AppError";
  }
}
/* fim de AppError.ts */
