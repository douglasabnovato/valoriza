# Plano de ação — Valoriza

Priorização por **MoSCoW** e ordenação por **ganho ÷ esforço** (esforço: 1 = até 15 min, 2 = até 30 min, 3 = até 1 h).

| # | Prioridade | Tarefa | Defeito | Critério | Ganho | Esforço | Status |
|---|---|---|---|---|---|---|---|
| T01 | Must | `JWT_SECRET` por ambiente (obrigatório, ≥ 32) e HS256 fixo | D1 | C4, C9 | Alto | 1 | ✅ Feito |
| T02 | Must | Ignorar `admin` no cadastro; script `admin:promote` | D2 | C4, C1 | Alto | 1 | ✅ Feito |
| T03 | Must | DTOs de saída e `password` com `select: false` | D3 | C4 | Alto | 2 | ✅ Feito |
| T04 | Must | `AppError` com status (400/401/403/404/409/422) e 500 genérico | D4 | C2, C4 | Alto | 1 | ✅ Feito |
| T05 | Must | Migration HardenSchema (únicos NOCASE, NOT NULL, CHECK, FKs, índices) | D5 | C5 | Alto | 3 | ✅ Feito |
| T06 | Must | Validação de entrada com zod | D9 | C4, C3 | Alto | 1 | ✅ Feito |
| T07 | Should | Remover log de dados pessoais; mensagem única no login | D7 | C4 | Médio | 1 | ✅ Feito |
| T08 | Should | `build`/`start`/`test`, `PORT`, `/health`, remover `/test` | D8 | C9 | Médio | 1 | ✅ Feito |
| T09 | Should | `helmet`, CORS configurável e limite de 10 KB no JSON | — | C4 | Médio | 1 | ✅ Feito |
| T10 | Should | `/login` responde `{ token, user }` | D10 | C3 | Baixo | 1 | ✅ Feito |
| T11 | Should | 8 testes de integração cobrindo o BDD | — | C6 | Alto | 3 | ✅ Feito |
| T12 | Should | README com contrato, execução e deploy; `LICENSE.md` | D11 | C10 | Médio | 1 | ✅ Feito |
| T13 | Must (usuário) | Tirar `database.sqlite` do Git; apagar `testtypescript.*`; criar `.env` | D6, D11 | C4 | Alto | 1 | ⏳ Com você |
| T14 | Won't (agora) | TypeORM 0.3, paginação, front-end, e-mail | — | — | — | — | Roadmap |

## Definição de pronto

- `npm test` (8/8), `npm run typecheck` e `npm run build` sem erros.
- Migration aplicada numa cópia do banco atual sem perda de registros válidos.
- `grep -rn "4f93ac9d" src` sem resultados.

## Ciclo de 10/11/2026 (faixa de 90%)

> Branch `feature/2026-11-10-b` → `developer/sprint-2026-11-12` → `main` (o PR para a `main` fica com o responsável). Decisões D1 a D7 em `engenharia/decisoes/2026-11-10-ciclo-faixa-90.md`.

**Produto.** Sem mudança. A aposta da seção 2 do `MVP.md` passa a ser a meta do ciclo (D1).

**Engenharia.** Pela D4, o banco antigo no histórico foi conferido sem imprimir valores. Há e-mails de provedor comum sem sinal de teste, então não cabe ADR de risco aceito: limpar ou não o histórico é do responsável (#11).

| Item | Destino |
|---|---|
| Conferir o banco do histórico (D4) | Este ciclo: inconclusivo, vai para o responsável |
| Critérios 2 e 10 pelas decisões D1 e D3 | Este ciclo |
| Decidir o histórico | Responsável (#11) |
| Publicar a API | Responsável (#16) |

## Ciclo de 03/11/2026

Executado em 06/11/2026, nas branches `feature/2026-11-06` → `developer/sprint-2026-11-12` → `main`.

### Produto

**Problema e público.** Equipes querem reconhecer colegas ligando cada elogio a um valor da empresa. Esta API é a base desse registro.

**Hipótese e meta (proposta).** Praticar Node e TypeScript: autenticar e registrar um elogio pela API.

**O que a pesquisa trouxe.**

| Ideia | Fonte | Uso aqui |
|---|---|---|
| Ligar cada reconhecimento a um valor declarado torna o valor concreto; marcar o valor no elogio ajuda | [ChangeEngine](https://changeengine.com/glossary/what-is-peer-to-peer-recognition); [Business 2 Community](https://business2community.com/?p=2349556) | A tag já é o valor; o resumo mostra quantos elogios a pessoa recebeu em cada um |
| Reconhecimento frequente e específico funciona melhor que eventos raros | [Advantage Club](https://blog.advantageclub.co/2024/12/23/best-practices-for-peer-to-peer-recognition/); [Process Street](https://www.process.st/peer-to-peer-recognition/) | Paginação (#13) e limite de repetição (#14) preparam a API para uso frequente |

As fontes são, na maioria, de empresas que vendem software de reconhecimento; os ganhos que elas citam não foram verificados.

**Backlog priorizado (impacto × esforço).**

| Item | Impacto | Esforço | Destino |
|---|---|---|---|
| Remover rascunhos com e-mail pessoal | Alto | Baixo | Este ciclo |
| Trocar `uuid` por `crypto.randomUUID` | Médio | Baixo | Este ciclo |
| Resumo de elogios por valor | Médio | Baixo | Este ciclo |
| Paginação | Médio | Médio | [#13](https://github.com/douglasabnovato/valoriza/issues/13) |
| Limite de elogios repetidos | Médio | Baixo | [#14](https://github.com/douglasabnovato/valoriza/issues/14) |
| OpenAPI | Médio | Médio | [#15](https://github.com/douglasabnovato/valoriza/issues/15) |
| Histórico, proteção da `main`, publicação | Alto | Baixo (responsável) | [#11](https://github.com/douglasabnovato/valoriza/issues/11), [#12](https://github.com/douglasabnovato/valoriza/issues/12), [#16](https://github.com/douglasabnovato/valoriza/issues/16) |

**Fora do escopo.** Interface web e notificações.

### Engenharia

**Arquitetura.** API Express + TypeScript, TypeORM com SQLite, JWT e bcryptjs, validação com Zod. Camadas: rotas → controllers → services → repositórios. Testes de integração com `node:test` e supertest em SQLite em memória.

**Riscos.** Banco antigo com 9 usuários no histórico do Git (#11). Principal sem proteção (#12).

**Qualidade.** 11 testes, `tsc --noEmit`, build no CI. Sem alertas no `npm audit --omit=dev`.

**Definição de pronto.** CI verde, teste novo, `MVP.md` e README atualizados.

### Plano de ação

**Executado neste ciclo.** Remoção dos rascunhos `testtypescript.*`; troca do `uuid`; rota de resumo por valor; gatilho do CI para `developer/**`; régua N1 e critério 10 no `MVP.md`; seção de estado no README.

**Vira issue.** #11 a #16.
