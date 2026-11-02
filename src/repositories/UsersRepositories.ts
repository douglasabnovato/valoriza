import { getDataSource } from "../database";
import { User } from "../entities/User";

const UsersRepositories = () => getDataSource().getRepository(User);

export { UsersRepositories };
