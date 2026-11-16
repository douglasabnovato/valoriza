# MVP — valoriza

> Criado em 02/11/2026; revisto em 16/11/2026. Meta: N1 (estudo). Testado no Windows, com Node 24, no clone da `feature/2026-11-16`. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 8 de 10 aplicáveis atendidos

**Finalizado:** sim

**Nível:** N1 (estudo). **Estado em 16/11/2026 (critério 8 revisto pela decisão do responsável "em valoriza, avaliar a api"; ciclo de 15/11/2026; as decisões D1 a D7 de 10/11/2026 seguem em `engenharia/decisoes/2026-11-10-ciclo-faixa-90.md`):** 8 de 10 critérios aplicáveis atendem (1, 2, 3, 4, 6, 10, 11, 12); 2 parciais: o 9, que depende do responsável (#11), e o 8, cuja régua para API sem interface está em decisão no engenharia (douglasabnovato/engenharia#43, `depende-do-responsavel`); 5 e 7 não se aplicam (N1). Finalizado pela decisão 4 do processo: o que falta depende do responsável e tem issue com `depende-do-responsavel`.

## 1. Critérios: 8 de 10 aplicáveis atendidos

| # | Critério | Como verificar | Situação em 16/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: Equipes registram elogios entre colegas por uma API. |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: aposta com meta e "saberemos quando" na seção 2, decidida pelo coordenador em 15/11/2026, revisável. |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: é só API, sem tela, então o teste de navegador não se aplica; `npm test`, 15/11/2026: 14 de 14 passam (cadastrar, autenticar, criar tag, elogiar, listar com paginação e resumir), com SQLite em memória, também no job `raiz` do CI. O contrato está em `docs/openapi.yaml`. |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: Seção 3. |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1): projeto de estudo sem coleta de uso. |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: Coberto pelos testes de API; há `AppError` e validação por schema. |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1): sem publicação; decisão em #16. |
| 8 | Acessibilidade básica | axe e teclado | Parcial: a régua não tem critério de acessibilidade para API sem interface; avaliado por mensagens de erro legíveis, contrato OpenAPI testado e códigos coerentes; a regra está em decisão no engenharia (douglasabnovato/engenharia#43; acompanhada em #25). `npm test`, 16/11/2026: 17 de 17 passam. O `tests/erros.test.ts` percorre 17 casos de 400, 401, 403, 404, 409 e 422 e mais 404 de rota inexistente, 413 e 500: todos respondem JSON `{ error }` com mensagem em português, sem texto padrão em inglês, e cada status está na operação certa do `docs/openapi.yaml`. O `tests/openapi.test.ts` confere as rotas do contrato nos dois sentidos. Corpo acima de 10 kB passou a responder 413 (antes caía em 500). |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: `npm audit --omit=dev`, 10/11/2026: 0 vulnerabilidades. O banco antigo saiu do Git em 02/11/2026, mas segue no histórico em 5 versões. Conferência de 10/11/2026 (decisão D4), sem imprimir valores: na versão de 9 usuários, 4 e-mails usam domínios que parecem de teste e 5 usam `gmail.com` sem nada que indique teste no nome do usuário. Não dá para afirmar que são fictícios, então a ADR de risco aceito não foi escrita e a decisão segue com o responsável (#11). As senhas estão com hash bcrypt. Os alertas do Dependabot estão desligados no repositório (API 403 em 15/11/2026, #22). |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: `gh api repos/douglasabnovato/valoriza/rules/branches/main`, 10/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` com o job `raiz` (decisão D3) (#12). |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: `npm run typecheck`, `npm test` (17, incluindo a paginação, a cobertura do OpenAPI nos dois sentidos e o formato dos erros) e `npm run build` no job `raiz` do CI, sem `skip`; 16/11/2026: 17 de 17 passam, 0 `skipped`. |
| 12 | Documentação honesta | O README ensina a rodar | Atende: comandos conferidos com o `package.json` em 16/11/2026; contrato da API no README e em `docs/openapi.yaml`, com teste que confere todas as rotas; aviso de estudo. |

## 2. Hipótese (meta decidida pelo coordenador em 15/11/2026, revisável)

Acreditamos que uma equipe registra e consulta elogios ligados aos valores da empresa usando só esta API: cadastro, login, elogio e listagens. Saberemos quando o fluxo cadastrar → entrar → elogiar → listar → resumir passar nos testes do CI e quando uma pessoa de fora, só com o `docs/openapi.yaml`, enviar um elogio em até 5 minutos. Esse teste com pessoas ainda não foi feito.

## 3. Fora do MVP

Interface web e notificações.

## 4. Neste ciclo (15/11/2026)

Paginação das listagens (#13), API descrita em OpenAPI com teste de cobertura (#15), hipótese com meta e issue para ligar os alertas do Dependabot (#22).

## 5. Revisão de 06/11/2026 (ciclo de 03/11/2026)

- Régua N1: critérios 5 e 7 passam a "Não se aplica" e saem do denominador; o 8 já não se aplicava.
- Critério 10 vai de "Atende" para "Parcial", porque a principal não tem proteção.
- Critério 9 segue "Parcial" só pelo histórico (#11): o alerta do `uuid` foi resolvido e os rascunhos com e-mail pessoal saíram.
- Rota `GET /users/compliments/summary`. Testes: 11 (antes 9).

## 6. Histórico

### Tabela de 15/11/2026, antes da revisão do critério 8

**Resumo:** 8 de 9 aplicáveis atendidos. **Finalizado:** sim. Igual à tabela atual, exceto: critério 8 "Não se aplica: Projeto sem interface", fora do denominador; critério 11 com 14 testes.

### Tabela de 10/11/2026, antes do ciclo da faixa de 90% (ciclo de 03/11/2026)

**Resumo:** 8 de 9 aplicáveis atendidos

**Finalizado:** sim

**Nível:** N1 (estudo). **Estado em 10/11/2026:** 8 de 9 critérios aplicáveis atendem (1, 2, 3, 4, 6, 10, 11, 12); 1 parcial (9), que depende do responsável (#11); 5 e 7 não se aplicam (N1) e 8 não se aplica (sem interface). O 10 passou a "Atende" em 10/11/2026, com a `main` protegida (#12). Finalizado pela decisão 4 do processo: o que falta depende do responsável e tem issue com `depende-do-responsavel`.

#### Critérios: 8 de 9 aplicáveis atendidos

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
