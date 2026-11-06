/*
 * SummaryUserComplimentsService · quantos elogios o usuário logado recebeu em cada valor (tag).
 */
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";

interface ITagCount {
  tag_id: string;
  tag: string;
  total: number;
}

/* Agrupa por tag; ordena do maior total para o menor e, no empate, pelo nome. */
function resumirPorTag(compliments: Array<{ tag_id: string; tag?: { name: string } | null }>): ITagCount[] {
  const mapa = new Map<string, ITagCount>();
  for (const c of compliments) {
    const atual = mapa.get(c.tag_id) ?? { tag_id: c.tag_id, tag: c.tag?.name ?? "", total: 0 };
    atual.total += 1;
    mapa.set(c.tag_id, atual);
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total || a.tag.localeCompare(b.tag, "pt-BR"));
}

class SummaryUserComplimentsService {
  /* Devolve { total, tags } dos elogios recebidos. */
  async execute(user_id: string) {
    const compliments = await ComplimentsRepositories().find({
      where: { user_receiver: user_id },
      relations: { tag: true },
    });
    return { total: compliments.length, tags: resumirPorTag(compliments) };
  }
}

export { SummaryUserComplimentsService, resumirPorTag };
/* fim de SummaryUserComplimentsService */
