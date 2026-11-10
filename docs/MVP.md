# MVP — valoriza

> Criado em 02/11/2026. Meta: N1 (estudo). Testado no Windows, com Node 24, na cópia de `main`. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 8 de 9 aplicáveis atendidos

**Finalizado:** sim

**Nível:** N1 (estudo). **Estado em 10/11/2026:** 8 de 9 critérios aplicáveis atendem (1, 2, 3, 4, 6, 10, 11, 12); 1 parcial (9), que depende do responsável (#11); 5 e 7 não se aplicam (N1) e 8 não se aplica (sem interface). O 10 passou a "Atende" em 10/11/2026, com a `main` protegida (#12). Finalizado pela decisão 4 do processo: o que falta depende do responsável e tem issue com `depende-do-responsavel`.

## 1. Critérios: 8 de 9 aplicáveis atendidos

| # | Critério | Como verificar | Situação |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: Equipes registram elogios entre colegas por uma API. |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: Proposta na seção 2; ainda sem validação com pessoas. |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: É só API: os 11 testes passaram localmente, com SQLite (06/11/2026). |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: Seção 3. |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1): projeto de estudo sem coleta de uso. |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: Coberto pelos testes de API; há `AppError` e validação por schema. |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1): sem publicação; decisão em #16. |
| 8 | Acessibilidade básica | axe e teclado | Não se aplica: Projeto sem interface. |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: `npm audit --omit=dev` sem alertas em 06/11/2026 (`uuid` trocado por `crypto.randomUUID`); rascunhos com e-mail pessoal removidos. O banco com 9 usuários saiu do Git em 02/11/2026, mas segue no histórico (#11). |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende (10/11/2026): `gh api repos/douglasabnovato/valoriza/rulesets`, em 10/11/2026: ruleset `principal-protegida` ativo (exige PR, bloqueia force push e exclusão); workflow `CI` roda nos PRs para `main` e `developer/**` (#12). |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: Testes automatizados rodam no CI. |
| 12 | Documentação honesta | O README ensina a rodar | Atende: Comandos conferidos com o `package.json`; aviso de estudo no README. |

## 2. Hipótese (proposta)

Praticar Node e TypeScript: autenticar e registrar um elogio pela API.

## 3. Fora do MVP

Interface web e notificações.

## 4. Neste ciclo

Atualiza o que `npm audit fix` resolve.

## 5. Revisão de 06/11/2026 (ciclo de 03/11/2026)

- Régua N1: critérios 5 e 7 passam a "Não se aplica" e saem do denominador; o 8 já não se aplicava.
- Critério 10 vai de "Atende" para "Parcial", porque a principal não tem proteção.
- Critério 9 segue "Parcial" só pelo histórico (#11): o alerta do `uuid` foi resolvido e os rascunhos com e-mail pessoal saíram.
- Rota `GET /users/compliments/summary`. Testes: 11 (antes 9).
