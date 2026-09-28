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
