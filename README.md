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

## 💻 Detalhes do Projeto

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
