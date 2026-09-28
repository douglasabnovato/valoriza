/*
 * ListUsersController · GET /users.
 */
import { Request, Response } from "express";
import { ListUserService } from "../services/ListUsersService";

class ListUsersController {
  /* Responde a lista em JSON. */
  async handle(request: Request, response: Response) {
    return response.json(await new ListUserService().execute());
  }
}

export { ListUsersController };
/* fim de ListUsersController */
