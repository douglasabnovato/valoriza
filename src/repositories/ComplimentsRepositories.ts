import { getDataSource } from "../database";
import { Compliment } from "../entities/Compliment";

const ComplimentsRepositories = () => getDataSource().getRepository(Compliment);

export { ComplimentsRepositories };
