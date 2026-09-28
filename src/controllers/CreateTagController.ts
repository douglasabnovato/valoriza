/*
 * CreateTagController · POST /tags (somente admin).
 */
import { Request, Response } from "express";
import { CreateTagService } from "../services/CreateTagService";
import { createTagSchema, parse } from "../validation/schemas";

class CreateTagController {
  /* Responde 201 com a tag criada. */
  async handle(request: Request, response: Response) {
    const { name } = parse(createTagSchema, request.body);
    return response.status(201).json(await new CreateTagService().execute(name));
  }
}

export { CreateTagController };
/* fim de CreateTagController */
