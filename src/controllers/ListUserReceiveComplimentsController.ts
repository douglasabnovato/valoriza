/*
 * ListUserReceiveComplimentsController · GET /users/compliments/receive.
 */
import { Request, Response } from "express";
import { ListUserReceiveComplimentsService } from "../services/ListUserReceiveComplimentsService";
import { parse, paginationSchema } from "../validation/schemas";

class ListUserReceiveComplimentsController {
  /* Valida ?page= e ?limit= e responde uma página em JSON. */
  async handle(request: Request, response: Response) {
    const pagina = parse(paginationSchema, request.query);
    return response.json(await new ListUserReceiveComplimentsService().execute(request.user_id, pagina));
  }
}

export { ListUserReceiveComplimentsController };
/* fim de ListUserReceiveComplimentsController */
