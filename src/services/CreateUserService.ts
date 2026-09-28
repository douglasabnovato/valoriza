/*
 * CreateUserService · cadastra colaborador (RN01, RN02, RN06): e-mail único, senha com hash, nunca admin.
 */
import { getCustomRepository } from "typeorm";
import { hash } from "bcryptjs";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { AppError } from "../errors/AppError";
import { config } from "../config";
import { selfUser } from "../mappers/toPublic";

interface IUserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  /* Cria o usuário; o índice único do banco resolve a corrida entre dois cadastros iguais. */
  async execute({ name, email, password }: IUserRequest) {
    const usersRepository = getCustomRepository(UsersRepositories);

    if (await usersRepository.findOne({ email })) {
      throw new AppError("Já existe um usuário com este e-mail.", 409);
    }

    const user = usersRepository.create({
      name,
      email,
      admin: false,
      password: await hash(password, config.bcryptCost),
    });

    try {
      await usersRepository.save(user);
    } catch (error) {
      if (String((error as Error).message).includes("UNIQUE")) {
        throw new AppError("Já existe um usuário com este e-mail.", 409);
      }
      throw error;
    }

    return selfUser(user);
  }
}

export { CreateUserService };
/* fim de CreateUserService */
