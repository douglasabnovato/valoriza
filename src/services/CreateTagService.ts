/*
 * CreateTagService · cadastra tag com nome único (RN03).
 */
import { getCustomRepository } from "typeorm";
import { TagsRepositories } from "../repositories/TagsRepositories";
import { AppError } from "../errors/AppError";
import { publicTag } from "../mappers/toPublic";

class CreateTagService {
  /* Cria a tag; o índice único (NOCASE) cobre a corrida entre dois cadastros. */
  async execute(name: string) {
    const tagsRepositories = getCustomRepository(TagsRepositories);

    const existing = await tagsRepositories
      .createQueryBuilder("tag")
      .where("lower(tag.name) = lower(:name)", { name })
      .getOne();
    if (existing) {
      throw new AppError("Esta tag já existe.", 409);
    }

    const tag = tagsRepositories.create({ name });
    try {
      await tagsRepositories.save(tag);
    } catch (error) {
      if (String((error as Error).message).includes("UNIQUE")) {
        throw new AppError("Esta tag já existe.", 409);
      }
      throw error;
    }
    return publicTag(tag);
  }
}

export { CreateTagService };
/* fim de CreateTagService */
