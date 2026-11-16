/*
 * ListUserSendComplimentsController · GET /users/compliments/send.
 */
import { Request, Response } from "express";
import { ListUserSendComplimentsService } from "../services/ListUserSendComplimentsService";
import { parse, paginationSchema } from "../validation/schemas";

class ListUserSendComplimentsController {
  /* Valida ?page= e ?limit= e responde uma página em JSON. */
  async handle(request: Request, response: Response) {
    const pagina = parse(paginationSchema, request.query);
    return response.json(await new ListUserSendComplimentsService().execute(request.user_id, pagina));
  }
}

export { ListUserSendComplimentsController };
/* fim de ListUserSendComplimentsController */
