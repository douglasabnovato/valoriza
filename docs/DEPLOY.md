# Deploy · Valoriza API

Plano de ação para publicar a API em hospedagem gratuita.

> **Situação em 18/11/2026: publicação parada.** A API está fora do ar desde a conferência de 31/10/2026. `curl -sI https://valoriza-api.onrender.com/health`, 18/11/2026 20h11: HTTP 404 com `x-render-routing: no-server` (não há serviço no Render). Publicar de novo ou não é decisão do responsável ([#16](https://github.com/douglasabnovato/valoriza/issues/16)). Para usar a API, rode localmente (README, seção "Como executar"). O plano abaixo fica como registro de como publicar.

## 1. Desafio

Colocar no ar, sem custo, uma API Express + TypeORM + SQLite com login JWT e papel de admin, **sem publicar os dados reais** que estão no histórico do Git.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **Render, web service free (escolhida)** | Mesmo padrão dos outros projetos Node do portfólio; Blueprint versionado; disco temporário é aceitável para demonstração |
| alwaysdata (free, 100 MB, disco persistente) | Mantém os dados, mas o deploy é manual (SSH/Git) e foge do padrão do portfólio |
| Render + banco gerenciado | Exigiria trocar SQLite por Postgres (mudança estrutural, fora do escopo do deploy) |

### O que foi ajustado no código para produção

| Mudança | Arquivo | Por quê |
|---|---|---|
| Admin garantido na subida por `ADMIN_EMAIL` e `ADMIN_PASSWORD` | `src/database/seedAdmin.ts`, `src/server.ts`, `src/config.ts` | O plano free não tem Shell para `npm run admin:promote` e o banco volta vazio a cada reinício |
| Teste do seed (cria, promove, ignora sem variáveis) | `tests/api.test.ts` | Eram 9 testes na época; hoje `npm test` roda 17 (18/11/2026) |
| Variáveis novas documentadas | `.env.example` | Contrato do ambiente |
| Blueprint do Render | `render.yaml` | Infraestrutura como código |
| Seção de hospedagem e link para este plano | `README.md` | Porta de entrada do projeto |

Verificação feita antes da entrega: `npm ci` limpo, 9 testes passando, `typecheck` e `build` ok, e subida em modo produção (`/health`, login do admin e criação de tag).

### Pontos de atenção (LGPD e segurança)

- **O `src/database/database.sqlite` saiu do Git em 02/11/2026 (PR #9), mas segue no histórico** em 5 versões; a maior tem 9 usuários. Não dá para afirmar se os registros são reais ou de teste (conferência de 10/11/2026 no `docs/MVP.md`, critério 9). Limpar o histórico ou aceitar o risco é decisão do responsável ([#11](https://github.com/douglasabnovato/valoriza/issues/11)). Tirar do índice não apaga do histórico: quem clonar o repositório público ainda acessa os commits antigos.
- As 11 vulnerabilidades do `npm audit` da época foram resolvidas com o `typeorm` 1 e o `jsonwebtoken` 9 (PR #9 e #10). `npm audit --omit=dev`, 18/11/2026: 0 vulnerabilidades.

### Limitações conhecidas do plano gratuito

- O serviço dorme após 15 min sem acesso e leva cerca de 1 min para acordar.
- O SQLite fica em `/tmp`: usuários, tags e elogios somem a cada deploy ou reinício; só o admin volta sozinho.
- As 750 horas gratuitas por mês são da conta inteira do Render, somando todos os serviços.

## 3. Solução (passo a passo)

### Etapa 0 · Proteger os dados reais (antes de qualquer push)

Escolha **uma** das opções:

1. **Mais simples:** deixar o repositório **privado** no GitHub (Settings → General → Danger Zone → Change visibility). O Render funciona com repositório privado.
2. **Para manter público:** limpar o histórico com `git filter-repo`:
   1. `pip install git-filter-repo`
   2. Fazer um clone novo só para a limpeza: `git clone --mirror https://github.com/douglasabnovato/valoriza.git valoriza-limpeza && cd valoriza-limpeza`
   3. `git filter-repo --invert-paths --path src/database/database.sqlite`
   4. `git push --force --mirror`
   5. Voltar para a pasta de trabalho e sincronizar: `git fetch origin && git reset --hard origin/<sua-branch>` (faça isso só depois de commitar e empurrar as mudanças da Etapa 2, ou rode a limpeza depois da Etapa 2).

### Etapa 1 · Validar localmente (Git Bash)

1. Entrar na pasta do clone (`cd valoriza`)
2. `npm ci`
3. `npm run typecheck && npm test && npm run build` (esperado em 18/11/2026: 17 testes passando)

### Etapa 2 · Subir para o GitHub

> Já feita: o banco e os rascunhos saíram do Git em 02/11/2026 (PR #9) e 06/11/2026 (PR #17). Os passos ficam como registro.

1. `git rm --cached src/database/database.sqlite` (o arquivo continua na sua máquina, só sai do Git)
2. `git rm testtypescript.ts testtypescript.js` (arquivos de rascunho)
3. `git status` (não podem aparecer `.env`, `dist/` nem `*.sqlite`)
4. `git add -A`
5. `git commit -m "feat(deploy): seed de admin por ambiente, blueprint do Render e plano de deploy"`
6. `git push`

### Etapa 3 · Criar o serviço no Render

1. Entrar em **render.com** com a conta do GitHub e autorizar o repositório `valoriza`.
2. **New → Blueprint** e escolher `douglasabnovato/valoriza`.
3. O Render pede os valores marcados como `sync: false`:
   - `ADMIN_EMAIL`: e-mail do admin da demonstração (ex.: `admin@valoriza.dev`).
   - `ADMIN_PASSWORD`: senha com no mínimo 8 caracteres (não reutilize senha pessoal).
4. Conferir o serviço `valoriza-api`, plano **Free**, e clicar em **Apply**.
5. Acompanhar **Logs** até aparecer `Admin do ambiente criado.` e `Valoriza API em http://localhost:10000`.

### Etapa 4 · Conferir no ar (Git Bash)

1. `URL=https://valoriza-api.onrender.com`
2. `curl $URL/health` → `{"status":"ok"}`
3. Login do admin:
   `curl -s -X POST $URL/login -H "Content-Type: application/json" -d '{"email":"admin@valoriza.dev","password":"<sua senha>"}'` → copiar o `token`
4. Criar uma tag:
   `curl -s -X POST $URL/tags -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"name":"Inovação"}'` → `201`
5. Cadastro público com `"admin": true` deve voltar `admin: false`.
6. `curl $URL/users` sem token → `401`.

### Etapa 5 · Fechar

1. Se a URL real for diferente de `https://valoriza-api.onrender.com`, corrigir no `README.md`, commit e push (o Render publica sozinho).
2. No GitHub, **About → Website**: colar a URL do `/health`.
