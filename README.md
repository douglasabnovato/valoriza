<h1 align="center">Valoriza</h1>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=8257E5&labelColor=000000">

  <img src="https://img.shields.io/static/v1?label=NLW&message=Together&color=8257E5&labelColor=000000" alt="NLW Together" />
</p>

<p align="center">
  <img alt="Preview" src="./.github/preview.png">
</p>


## 💻 Projeto

Valoriza é uma plataforma para promover o reconhecimento entre companheiros de equipe.

## ✨ Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- VSCode: editor de código
- [Node.js](https://nodejs.org/en/): 
- Npm, Yarn: Gerenciador de pacotes
- Insomnia: testar as requisições
- Beekeeper: Gerenciador de bd
- [Typescript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [JSONWebToken](https://github.com/auth0/node-jsonwebtoken#readme)
- Extensão: jetbrains mono
- Postgree: banco de dados
- Linguagem SQL
- TypeORM

## 💻 Detalhes do Projeto

### Liftoff
Instalar, Configurar e Testar o typescript no projeto
- [x] criar o projeto: `yarn init -y`: para criar o package.json
- [x] adicionar o typescript: `yarn add typescript -D`
- [x] executar no node: `node testtypescript.ts`
- [x] inicializar o typescript: `yarn tsc --init` 
- [x] converter o typescript: `yarn tsc` então cria o `testtypescript.js` 
- [x] executar no node: `node testtypescript.js`

Instalar, Configurar e Testar o express no projeto
- [x] adicionar o express: `yarn add express`
- [x] adicionar o biblioteca de tipagem: `yarn add @types/express -D`
- [x] converter o typescript: `yarn tsc` então cria o `server.js` 
- [x] executar no node: `node src/server.js`
- [x] `yarn add ts-node-dev -D`: para não ficar executando tsc todo vez.
- [x] src/server.ts
````typescript
import express from "express";
const app = express();//@types/express
app.listen(3000, () => console.log("Server is running"));//http://localhost:3000
````

Instalar, Configurar e Testar as routes no projeto
- [x] métodos disponíveis no protocolo http: get(buscar), post(inserir), put(editar), delete(remover), patch(alterar uma informação específica)
- [x] request(entrando), response(saíndo)
- [x] duas rotas testes
````typescript 
app.get("/test", (req, res) => {
  return res.send("Olá NLW, método GET.")
})
app.post("/test-post", (req, res) => {
  return res.send("Olá NLW, método POST")
}) 
````
- [x] o método post não funciona diretamente pelo navegador, somente o get. Por isso, vamos ao insomnia para testar nossos métodos de requisição.

Construir e testar as requisições as rotas no insomnia
- [x] rota test com método GET
- [x] rota test-post com método POST

### Maximum Speed
Modelar, Criar e entender o banco de dados
- [x] O modelo de informações
- [x] Tipos de Parâmetros de requisições:
- Routes params: http://localhost:3000/produtos/78347583458345
- Query params: http://localhost:3000/produtos?name=teclado&descreption=tecladobom
- Body params: {"name": "teclado", "description":"tecladobom"}
- [x] Escolha do banco de dados para nossa necessidade de armazenamento de informações: 
- Opções de banco de dados: Postgree 
- Três formas de usar o banco de dados na aplicação: driver nativo do bd(Postgree), query builders(Knexjs), ORM(Sequelize, TypeORM, Prisma)
- Escolha para nossa aplicação é o TypeORM

Criar, configurar o banco de dados em ormconfig.json
- [x] TypeORM
- Instalação: `yarn add typeorm reflect-metadata sqlite3`
- Configuração através do arquivo json: `ormconfig.json`
- Inicialização do bd: `src/database/index.ts`
- Importação do bd no server: `import "./database";`
- [x] Migrations: controle de versionamento de tabelas
- configuração no ormconfig.json - cli: migrationsDir, entitiesDir
- `yarn typeorm -help`
- [x] Criar entidades Migrations (Usuário)
- `yarn typeorm migration:create -n CreateUsersTest`
- métodos up e down 
- configurando em createTable na CreateUsers conforme o modelo de negócios apresentado anteriormente.
- configurando em dropTable na CreateUsers
- rodar a migrations para inserir no banco de dados:`yarn typeorm migration:run`
- rodar a migrations para reverter no banco de dados:`yarn typeorm migration:revert`
- criar entidades no banco de dados: `yarn typeorm entity:create -n User`
- em tsconfig.json, configurar "experimentalDecorators": true, "emitDecoratorMetadata": true e "strictPropertyInitialization": false
- instalar biblioteca: `yarn add uuid` e suas tipagens: `yarn add @types/uuid -D`

Criar a camada Repositório que comunica nossa entidade com o BD
- Configurar os métodos CRUD para interagir com o bd: `Repositories/UsersRepositories.ts`
- Configurar os services - as regras de negócio

As regras de Negócio
Cadastro de Usuário
- Não é permitido cadastrar mais de um usuário com o mesmo e-mail
- Não é permitido cadastrar usuário sem e-mail
Cadastro de TAG
- Não é permitido cadastrar mais de uma tag com o mesmo nome
- Não é permitido cadastrar tag sem nome
- Não é permitido o cadastro por usuários que não sejam administradores
Cadastro de elogios
- Não é permitido um usuário cadastrar um elogio para si mesmo
- Não é permitido cadastrar elogios para usuários inválidos
- O usuário precisa estar autenticado na aplicação

Criar e configurar a camada Services
- CreateUserService.ts

Criar e configurar a camada Controllers
- CreateUserController.ts
- Insomnia: CreateUser, POST, JSON
- gerir as rotas: criar arquivo routes.ts
- testar no insomnia _.baseURL/users com CreateUser[POST/JSON]

- [ ] Cadastro de usuários 
- [ ] Cadastro de tags (elogios possíveis): somente usuário administrador
- [ ] Cadastro de elogios: id do usuário, id da tag, data da criação
- [ ] Autenticação de usuário: gerar token jwt, validar usuário logado nas rotas necessárias
- [ ] Listagem de Usuários, Listagem de tags, Listagem de elogios por usuários

## 🔖 Detalhes no Notion

Podemos ver mais detalhes do projeto através [desse link](https://www.notion.so/Mission-Node-js-a25b063cc195465180563951d03e2459) no Notion.  

## 🚀 Como executar

- Clone o repositório
- Rode `yarn` para baixar as dependências
- Rode `yarn typeorm migration:run` para criar as tabelas do banco de dados.
- Rode o `yarn dev` para iniciar a aplicação.

Por fim, a aplicação estará disponível em `http://localhost:3000`

## 📄 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---  

Feito com ❤️ por Douglas A B Novato 👋🏽 [Entre em contato!](https://www.linkedin.com/in/douglasabnovato/).<br/>
Fonte do projeto Por Rocketseat no [Next Level Week Together](https://nextlevelweek.com/)
