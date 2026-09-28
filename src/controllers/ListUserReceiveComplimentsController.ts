/*
 * ListUserReceiveComplimentsController · GET /users/compliments/receive.
 */
import { Request, Response } from "express";
import { ListUserReceiveComplimentsService } from "../services/ListUserReceiveComplimentsService";

class ListUserReceiveComplimentsController {
  /* Responde a lista em JSON. */
  async handle(request: Request, response: Response) {
    return response.json(await new ListUserReceiveComplimentsService().execute(request.user_id));
  }
}

export { ListUserReceiveComplimentsController };
/* fim de ListUserReceiveComplimentsController */
