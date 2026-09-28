/*
 * ListTagsService · catálogo de tags em ordem alfabética.
 */
import { getCustomRepository } from "typeorm";
import { TagsRepositories } from "../repositories/TagsRepositories";
import { publicTag } from "../mappers/toPublic";

class ListTagsService {
  /* Lista as tags com o nome formatado (#nome). */
  async execute() {
    const tags = await getCustomRepository(TagsRepositories).find({ order: { name: "ASC" } });
    return tags.map(publicTag);
  }
}

export { ListTagsService };
/* fim de ListTagsService */
