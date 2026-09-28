/*
 * toPublic.ts · converte entidades em objetos de resposta explícitos (nunca expõe password).
 */
import { User } from "../entities/User";
import { Tag } from "../entities/Tag";
import { Compliment } from "../entities/Compliment";

/* Usuário visível para outros usuários: só id e nome. */
export function publicUser(user: User) {
  return { id: user.id, name: user.name };
}

/* Usuário visível para ele mesmo (login). */
export function selfUser(user: User) {
  return { id: user.id, name: user.name, email: user.email, admin: Boolean(user.admin) };
}

/* Tag com o nome formatado como hashtag. */
export function publicTag(tag: Tag) {
  return { id: tag.id, name: tag.name, name_custom: `#${tag.name}` };
}

/* Elogio com remetente, destinatário e tag resumidos. */
export function publicCompliment(compliment: Compliment) {
  return {
    id: compliment.id,
    message: compliment.message,
    created_at: compliment.created_at,
    tag: compliment.tag ? publicTag(compliment.tag) : { id: compliment.tag_id },
    sender: compliment.userSender ? publicUser(compliment.userSender) : { id: compliment.user_sender },
    receiver: compliment.userReceiver ? publicUser(compliment.userReceiver) : { id: compliment.user_receiver },
  };
}
/* fim de toPublic.ts */
