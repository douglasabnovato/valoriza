/*
 * AuthenticateUserController · POST /login.
 */
import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";
import { loginSchema, parse } from "../validation/schemas";

class AuthenticateUserController {
  /* Responde { token, user }. */
  async handle(request: Request, response: Response) {
    const data = parse(loginSchema, request.body);
    return response.json(await new AuthenticateUserService().execute(data));
  }
}

export { AuthenticateUserController };
/* fim de AuthenticateUserController */
