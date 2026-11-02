/*
 * ListUserSendComplimentsService · elogios enviados pelo usuário logado, mais recentes primeiro.
 */
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { publicCompliment } from "../mappers/toPublic";

class ListUserSendComplimentsService {
  /* Lista com remetente, destinatário e tag resumidos (sem dados sensíveis). */
  async execute(user_id: string) {
    const compliments = await ComplimentsRepositories().find({
      where: { user_sender: user_id },
      relations: { userSender: true, userReceiver: true, tag: true },
      order: { created_at: "DESC" },
    });
    return compliments.map(publicCompliment);
  }
}

export { ListUserSendComplimentsService };
/* fim de ListUserSendComplimentsService */
