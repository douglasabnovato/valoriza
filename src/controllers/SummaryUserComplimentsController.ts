/*
 * SummaryUserComplimentsController · GET /users/compliments/summary.
 */
import { Request, Response } from "express";
import { SummaryUserComplimentsService } from "../services/SummaryUserComplimentsService";

class SummaryUserComplimentsController {
  /* Responde o resumo em JSON. */
  async handle(request: Request, response: Response) {
    return response.json(await new SummaryUserComplimentsService().execute(request.user_id));
  }
}

export { SummaryUserComplimentsController };
/* fim de SummaryUserComplimentsController */
