/*
 * ListTagsService · catálogo de tags em ordem alfabética.
 */
import { TagsRepositories } from "../repositories/TagsRepositories";
import { publicTag } from "../mappers/toPublic";

class ListTagsService {
  /* Lista as tags com o nome formatado (#nome). */
  async execute() {
    const tags = await TagsRepositories().find({ order: { name: "ASC" } });
    return tags.map(publicTag);
  }
}

export { ListTagsService };
/* fim de ListTagsService */
