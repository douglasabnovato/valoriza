/*
 * CreateComplimentService · registra elogio (RN04): não para si, destinatário e tag existentes.
 */
import { getCustomRepository } from "typeorm";
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { TagsRepositories } from "../repositories/TagsRepositories";
import { AppError } from "../errors/AppError";
import { publicCompliment } from "../mappers/toPublic";

interface IComplimentRequest {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
  message: string;
}

class CreateComplimentService {
  /* Valida as regras e grava o elogio. */
  async execute({ tag_id, user_sender, user_receiver, message }: IComplimentRequest) {
    if (user_sender === user_receiver) {
      throw new AppError("Não é possível elogiar a si mesmo.", 422);
    }

    const [receiver, tag] = await Promise.all([
      getCustomRepository(UsersRepositories).findOne(user_receiver),
      getCustomRepository(TagsRepositories).findOne(tag_id),
    ]);
    if (!receiver) throw new AppError("Destinatário não encontrado.", 404);
    if (!tag) throw new AppError("Tag não encontrada.", 404);

    const complimentsRepositories = getCustomRepository(ComplimentsRepositories);
    const compliment = complimentsRepositories.create({ tag_id, user_receiver, user_sender, message });
    await complimentsRepositories.save(compliment);

    compliment.tag = tag;
    compliment.userReceiver = receiver;
    return publicCompliment(compliment);
  }
}

export { CreateComplimentService };
/* fim de CreateComplimentService */
