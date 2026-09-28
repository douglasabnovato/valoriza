/*
 * ListUserSendComplimentsController · GET /users/compliments/send.
 */
import { Request, Response } from "express";
import { ListUserSendComplimentsService } from "../services/ListUserSendComplimentsService";

class ListUserSendComplimentsController {
  /* Responde a lista em JSON. */
  async handle(request: Request, response: Response) {
    return response.json(await new ListUserSendComplimentsService().execute(request.user_id));
  }
}

export { ListUserSendComplimentsController };
/* fim de ListUserSendComplimentsController */
