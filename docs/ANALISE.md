# Análise do projeto — Valoriza

> Data da análise: 27/09/2026 · Branch analisada: `main` · Grupo: **fullstack (API REST)**

## 1. Contexto de produto

| Item | Descrição |
|---|---|
| Problema | Reconhecimento entre colegas se perde em conversas; não há histórico de quem valorizou quem e por quê. |
| Público | Times de empresas (colaboradores) e pessoas administradoras que definem os valores da cultura (tags). |
| Proposta de valor | API para registrar elogios ligados a um valor da empresa (#tag), consultar os elogios enviados e recebidos e manter um catálogo de valores controlado por admins. |
| Origem | NLW Together 6, trilha Mission: Node.js (Rocketseat), evoluído como produto de portfólio. |
| Métrica norte (proposta) | Elogios por colaborador ativo por mês. |

## 2. Especificação de requisitos

### 2.1 Requisitos funcionais

| ID | Requisito | Situação encontrada |
|---|---|---|
| RF01 | Cadastrar usuário com nome, e-mail e senha. | Atende parcialmente: aceita sem senha e sem nome; **aceita `admin: true` no corpo**. |
| RF02 | Autenticar com e-mail e senha e receber JWT. | Atende, com segredo fixo no código. |
| RF03 | Admin cadastra tag (valor da empresa). | Atende; nome duplicado só é barrado na aplicação (sem índice único). |
| RF04 | Listar tags com o nome formatado (`#nome`). | Atende |
| RF05 | Enviar elogio a outro usuário com uma tag e mensagem. | Atende parcialmente: tag inexistente ou mensagem vazia viram erro de banco. |
| RF06 | Listar elogios enviados e recebidos pelo usuário logado. | Atende, mas **expõe o hash da senha** de quem enviou e de quem recebeu. |
| RF07 | Listar usuários para escolher o destinatário. | Atende; expõe o e-mail de todos para qualquer usuário logado. |

### 2.2 Requisitos não funcionais (ISO/IEC 25010)

| ID | Característica | Requisito | Situação |
|---|---|---|---|
| RNF01 | Segurança — confidencialidade | Segredo JWT fora do código; nenhum hash de senha nas respostas; nenhum dado pessoal no Git. | **Não atende** (D1, D3, D6) |
| RNF02 | Segurança — autorização | Papel de admin não pode ser escolhido por quem se cadastra. | **Não atende** (D2) |
| RNF03 | Integridade | E-mail único e tag única garantidos pelo banco. | Não atende (D5) |
| RNF04 | Confiabilidade | Erro interno responde 500 genérico; erro de entrada responde 4xx com mensagem clara. | Não atende (D4) |
| RNF05 | Portabilidade | Build e start de produção; porta e segredo por variável de ambiente. | Não atende (D8) |
| RNF06 | Testabilidade | Regras de negócio cobertas por testes automatizados. | Não atende (sem testes) |

### 2.3 Regras de negócio (do README, mantidas e completadas)

- RN01 — E-mail obrigatório, válido e único (sem diferenciar maiúsculas).
- RN02 — Senha com no mínimo 8 caracteres; nome obrigatório.
- RN03 — Tag com nome obrigatório e único; só admin cadastra.
- RN04 — Não se elogia a si mesmo; destinatário e tag precisam existir; mensagem de 1 a 500 caracteres.
- RN05 — Rotas de elogio, tags e usuários exigem autenticação.
- RN06 (nova) — Ninguém se torna admin pela API pública; a promoção é feita por script de operação.

## 3. Diagnóstico (defeitos encontrados)

| ID | Severidade | Onde | Defeito | Referência |
|---|---|---|---|---|
| D1 | **Crítica** | `ensureAuthenticated.ts`, `AuthenticateUserService.ts` | Segredo do JWT fixo no código (e no histórico do Git): qualquer pessoa com o repositório forja tokens de qualquer usuário, inclusive admin. | OWASP A02 / A07; ASVS V3.5 |
| D2 | **Crítica** | `CreateUserService.ts` | `admin` vem do corpo da requisição: `POST /users {"admin": true}` cria um administrador. | OWASP A01 (escalonamento de privilégio); CWE-269 |
| D3 | **Crítica** | `ListUserReceiveComplimentsService.ts` | `relations: ["userSender", "userReceiver"]` devolve as entidades completas, com o hash bcrypt das senhas. | OWASP A01/A02 — exposição de dados; CWE-200 |
| D4 | Alta | `server.ts` | Todo `Error` vira 400 com a mensagem interna (ex.: "Cannot destructure property 'admin' of undefined"); `ensureAdmin` quebra se o usuário foi removido. | OWASP A05; tratamento de erros |
| D5 | Alta | migrations | Sem índice único em `users.email` e `tags.name` (verificação só na aplicação → condição de corrida *check-then-act*); `password` aceita nulo; `ON DELETE SET NULL` em colunas `NOT NULL`; `DEFAULT now()` não existe no SQLite. | 3FN, integridade referencial, TOCTOU |
| D6 | Alta | `src/database/database.sqlite` | Banco versionado no Git com 9 usuários reais (nomes, e-mails e hashes). | LGPD art. 46 (segurança dos dados); OWASP A05 |
| D7 | Média | `CreateUserService.ts` | `console.log` do e-mail e nome a cada cadastro (dado pessoal em log). | OWASP A09; LGPD |
| D8 | Média | `package.json`, `server.ts` | Sem `build`/`start`; produção dependeria de `ts-node-dev`; porta fixa; rotas `/test` e `/test-post` expostas. | 12-Factor III, V, VII |
| D9 | Média | serviços | Sem validação de tipos/formatos na entrada (e-mail, tamanho, UUID). | OWASP A03/A04; *fail fast* |
| D10 | Baixa | `/login` | Resposta é uma string JSON solta (`"eyJ..."`), sem contrato de objeto. | Design de API REST |
| D11 | Baixa | raiz | `testtypescript.ts/.js` do tutorial (com e-mail pessoal); README cita Postgres, mas o banco é SQLite; link de licença quebrado. | Higiene do repositório |

## 4. Critérios de MVP e nota atual

Pesos do grupo **fullstack**. Por ser uma API sem interface, **C3** avalia a usabilidade do contrato (códigos HTTP, formato de erro, documentação de rotas). Aprovação: média ≥ 7,0 **e** C1 e C4 ≥ 5.

| # | Critério | Referência | Peso | Nota atual | Justificativa |
|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Eric Ries) | 18% | 6 | Fluxos existem, mas D2 anula a regra de admin e RF05/RF06 têm defeitos. |
| C2 | Estados de erro e sucesso | Nielsen (adaptado a API) | 10% | 3 | Tudo vira 400; mensagens internas vazam. |
| C3 | Usabilidade do contrato | REST / RFC 9110 | 8% | 4 | Sem documentação de rotas; `/login` sem objeto; mensagens misturando inglês. |
| C4 | Segurança | OWASP Top 10 / ASVS L1 | 16% | 1 | D1, D2, D3, D6, D7. |
| C5 | Dados | 3FN / ACID | 12% | 4 | D5. |
| C6 | Testes | Pirâmide de testes | 10% | 0 | Nenhum teste. |
| C7 | Qualidade de código | SOLID / camadas | 8% | 5 | Camadas existem; sem validação; repositório obtido a cada chamada. |
| C8 | Desempenho | Complexidade / índices | 6% | 6 | Consultas simples; sem índice nas FKs de `compliments`. |
| C9 | Operação | 12-Factor | 6% | 2 | D8 e segredo no código. |
| C10 | Documentação | README | 6% | 5 | Diário de aula detalhado; falta contrato da API e execução atual. |

**Nota atual: 3,52 / 10 — REPROVADO** (média abaixo de 7,0 e C4 eliminatório com nota 1).

### 4.1 Critérios de aceite do MVP (BDD)

```gherkin
Funcionalidade: Elogios entre colegas

  Cenário: Cadastro não concede admin
    Quando envio POST /users com {"admin": true}
    Então o usuário é criado com admin = false

  Cenário: Listagem sem dados sensíveis
    Dado que recebi um elogio
    Quando consulto GET /users/compliments/receive
    Então nenhum objeto da resposta contém o campo "password"

  Cenário: E-mail duplicado
    Dado que existe "ana@empresa.com"
    Quando cadastro "ANA@empresa.com"
    Então recebo 409 "Já existe um usuário com este e-mail"

  Cenário: Token forjado
    Dado um token assinado com o segredo antigo do repositório
    Quando acesso GET /tags
    Então recebo 401

## 5. Nota depois do ciclo de melhorias (27/09/2026)

| # | Critério | Antes | Depois | O que mudou |
|---|---|---|---|---|
| C1 | Núcleo de valor | 6 | 9 | RF01–RF07 com regras garantidas; admin só por operação. |
| C2 | Estados | 3 | 9 | Status corretos (201/400/401/403/404/409/422/500) e mensagens em português. |
| C3 | Contrato | 4 | 8 | Formato único de erro, `/login` com objeto, contrato documentado. |
| C4 | Segurança | 1 | 8 | Segredo por ambiente, fim do escalonamento, DTOs, zod, helmet, sem PII em log. Sobe para 9 quando o banco sair do Git. |
| C5 | Dados | 4 | 9 | 3FN com únicos NOCASE, CHECKs, FKs coerentes e índices. |
| C6 | Testes | 0 | 7 | 8 testes de integração; faltam testes unitários dos serviços. |
| C7 | Qualidade de código | 5 | 8 | Validação, erros e mapeamento em camadas próprias; `strict: true`. |
| C8 | Desempenho | 6 | 8 | Índices compostos para as listagens; destinatário e tag buscados em paralelo. |
| C9 | Operação | 2 | 8 | `build`/`start`, `/health`, `.env.example`, migrations na subida. |
| C10 | Documentação | 5 | 8 | README com contrato e execução; `docs/` completo; licença. |

**Nota depois: 8,30 / 10 — APROVADO** (C1 = 9 e C4 = 8).
