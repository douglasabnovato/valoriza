/*
 * ListTagsController · GET /tags.
 */
import { Request, Response } from "express";
import { ListTagsService } from "../services/ListTagsService";

class ListTagsController {
  /* Responde a lista em JSON. */
  async handle(request: Request, response: Response) {
    return response.json(await new ListTagsService().execute());
  }
}

export { ListTagsController };
/* fim de ListTagsController */
