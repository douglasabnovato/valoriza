/*
 * CreateUserController · POST /users.
 */
import { Request, Response } from "express";
import { CreateUserService } from "../services/CreateUserService";
import { createUserSchema, parse } from "../validation/schemas";

class CreateUserController {
  /* Valida o corpo (campo admin é ignorado) e responde 201 com o usuário criado. */
  async handle(request: Request, response: Response) {
    const data = parse(createUserSchema, request.body);
    const user = await new CreateUserService().execute(data);
    return response.status(201).json(user);
  }
}

export { CreateUserController };
/* fim de CreateUserController */
