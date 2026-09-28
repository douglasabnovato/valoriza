/*
 * AuthenticateUserService · confere e-mail e senha e emite o JWT assinado com o segredo do ambiente.
 */
import { getCustomRepository } from "typeorm";
import { compare, hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { AppError } from "../errors/AppError";
import { config } from "../config";
import { selfUser } from "../mappers/toPublic";

interface IAuthenticateRequest {
  email: string;
  password: string;
}

const DUMMY_HASH = hashSync("usuario-inexistente", config.bcryptCost);

class AuthenticateUserService {
  /* Autentica com mensagem única para e-mail ou senha errados (não revela quais e-mails existem). */
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);
    const user = await usersRepositories
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    const passwordMatch = await compare(password, user?.password ?? DUMMY_HASH);
    if (!user || !passwordMatch) {
      throw new AppError("E-mail ou senha incorretos.", 401);
    }

    const token = sign({ email: user.email }, config.jwtSecret, {
      subject: user.id,
      expiresIn: config.jwtExpiresIn,
      algorithm: "HS256",
    } as object);

    return { token, user: selfUser(user) };
  }
}

export { AuthenticateUserService };
/* fim de AuthenticateUserService */
