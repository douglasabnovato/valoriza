/*
 * CreateComplimentController · POST /compliments (usuário autenticado é o remetente).
 */
import { Request, Response } from "express";
import { CreateComplimentService } from "../services/CreateComplimentService";
import { createComplimentSchema, parse } from "../validation/schemas";

class CreateComplimentController {
  /* Responde 201 com o elogio criado. */
  async handle(request: Request, response: Response) {
    const data = parse(createComplimentSchema, request.body);
    const compliment = await new CreateComplimentService().execute({ ...data, user_sender: request.user_id });
    return response.status(201).json(compliment);
  }
}

export { CreateComplimentController };
/* fim de CreateComplimentController */
