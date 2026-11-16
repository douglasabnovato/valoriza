/*
 * ListUserSendComplimentsService · elogios enviados pelo usuário logado, mais recentes primeiro.
 */
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { publicCompliment } from "../mappers/toPublic";

class ListUserSendComplimentsService {
  /* Uma página da lista, com remetente, destinatário e tag resumidos (sem dados sensíveis). */
  async execute(user_id: string, { page, limit }: { page: number; limit: number } = { page: 1, limit: 20 }) {
    const [compliments, total] = await ComplimentsRepositories().findAndCount({
      where: { user_sender: user_id },
      relations: { userSender: true, userReceiver: true, tag: true },
      order: { created_at: "DESC", id: "ASC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items: compliments.map(publicCompliment), page, limit, total };
  }
}

export { ListUserSendComplimentsService };
/* fim de ListUserSendComplimentsService */
