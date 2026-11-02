/*
 * ListUserReceiveComplimentsService · elogios recebidos pelo usuário logado, mais recentes primeiro.
 */
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { publicCompliment } from "../mappers/toPublic";

class ListUserReceiveComplimentsService {
  /* Lista com remetente, destinatário e tag resumidos (sem dados sensíveis). */
  async execute(user_id: string) {
    const compliments = await ComplimentsRepositories().find({
      where: { user_receiver: user_id },
      relations: { userSender: true, userReceiver: true, tag: true },
      order: { created_at: "DESC" },
    });
    return compliments.map(publicCompliment);
  }
}

export { ListUserReceiveComplimentsService };
/* fim de ListUserReceiveComplimentsService */
