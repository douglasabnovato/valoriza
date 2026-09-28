/*
 * ListUsersService · colaboradores disponíveis para receber elogios (apenas id e nome).
 */
import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { publicUser } from "../mappers/toPublic";

class ListUserService {
  /* Lista em ordem alfabética, sem e-mail nem senha (minimização de dados, LGPD). */
  async execute() {
    const users = await getCustomRepository(UsersRepositories).find({ order: { name: "ASC" } });
    return users.map(publicUser);
  }
}

export { ListUserService };
/* fim de ListUsersService */
