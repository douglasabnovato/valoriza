import { getDataSource } from "../database";
import { Tag } from "../entities/Tag";

const TagsRepositories = () => getDataSource().getRepository(Tag);

export { TagsRepositories };
