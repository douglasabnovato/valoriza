/*
 * api.test.ts · testes de integração da API (node:test + supertest) com SQLite em memória.
 * Cobrem os critérios de aceite: admin não se autoconcede, sem vazamento de senha, e-mail único e JWT.
 */
process.env.JWT_SECRET = "segredo-de-teste-com-mais-de-32-caracteres";
process.env.BCRYPT_COST = "4";

import "reflect-metadata";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { sign } from "jsonwebtoken";
import { Connection } from "typeorm";
import { createDatabaseConnection } from "../src/database";
import { createApp } from "../src/app";
import { seedAdmin } from "../src/database/seedAdmin";

let connection: Connection;
const app = createApp();

/* Cadastra e autentica um usuário, devolvendo token e id. */
async function signUp(name: string, email: string, extra: object = {}) {
  const created = await request(app).post("/users").send({ name, email, password: "senha-forte", ...extra });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const login = await request(app).post("/login").send({ email, password: "senha-forte" });
  assert.equal(login.status, 200);
  return { id: created.body.id as string, token: login.body.token as string };
}

before(async () => {
  connection = await createDatabaseConnection(":memory:");
});

after(async () => {
  await connection.close();
});

test("cadastro ignora admin:true e não devolve a senha", async () => {
  const response = await request(app).post("/users").send({ name: "Eva", email: "EVA@Empresa.com", password: "senha-forte", admin: true });
  assert.equal(response.status, 201);
  assert.equal(response.body.admin, false);
  assert.equal(response.body.email, "eva@empresa.com");
  assert.equal(response.body.password, undefined);
});

test("e-mail duplicado (sem diferenciar maiúsculas) responde 409", async () => {
  await request(app).post("/users").send({ name: "Bia", email: "bia@empresa.com", password: "senha-forte" });
  const response = await request(app).post("/users").send({ name: "Bia 2", email: "BIA@empresa.com", password: "senha-forte" });
  assert.equal(response.status, 409);
  assert.match(response.body.error, /Já existe/);
});

test("validação de entrada responde 400 com mensagem clara", async () => {
  const response = await request(app).post("/users").send({ name: "", email: "x", password: "1" });
  assert.equal(response.status, 400);
  assert.equal(typeof response.body.error, "string");
  const badJson = await request(app).post("/users").set("Content-Type", "application/json").send("{oops");
  assert.equal(badJson.status, 400);
});

test("login errado responde 401 com mensagem única", async () => {
  const unknown = await request(app).post("/login").send({ email: "ninguem@empresa.com", password: "qualquer" });
  assert.equal(unknown.status, 401);
  assert.equal(unknown.body.error, "E-mail ou senha incorretos.");
});

test("token forjado com o segredo antigo do repositório é recusado", async () => {
  const forged = sign({}, "4f93ac9d10cb751b8c9c646bc9dbccb9", { subject: "qualquer" });
  const response = await request(app).get("/tags").set("Authorization", `Bearer ${forged}`);
  assert.equal(response.status, 401);
});

test("só admin cria tag; nome duplicado responde 409", async () => {
  const user = await signUp("Caio", "caio@empresa.com");
  const denied = await request(app).post("/tags").set("Authorization", `Bearer ${user.token}`).send({ name: "Coragem" });
  assert.equal(denied.status, 403);

  await connection.query(`UPDATE users SET admin = 1 WHERE id = ?`, [user.id]);
  const created = await request(app).post("/tags").set("Authorization", `Bearer ${user.token}`).send({ name: "Coragem" });
  assert.equal(created.status, 201);
  assert.equal(created.body.name_custom, "#Coragem");
  const duplicated = await request(app).post("/tags").set("Authorization", `Bearer ${user.token}`).send({ name: "coragem" });
  assert.equal(duplicated.status, 409);
});

test("elogio completo: regras de negócio e listagens sem dados sensíveis", async () => {
  const admin = await signUp("Dani", "dani@empresa.com");
  await connection.query(`UPDATE users SET admin = 1 WHERE id = ?`, [admin.id]);
  const tag = await request(app).post("/tags").set("Authorization", `Bearer ${admin.token}`).send({ name: "Parceria" });
  const receiver = await signUp("Rui", "rui@empresa.com");
  const auth = { Authorization: `Bearer ${admin.token}` };

  const self = await request(app).post("/compliments").set(auth).send({ tag_id: tag.body.id, user_receiver: admin.id, message: "Eu mesmo" });
  assert.equal(self.status, 422);

  const noTag = await request(app).post("/compliments").set(auth).send({ tag_id: "7c9e6679-7425-40de-944b-e07fc1f90ae7", user_receiver: receiver.id, message: "Oi" });
  assert.equal(noTag.status, 404);

  const empty = await request(app).post("/compliments").set(auth).send({ tag_id: tag.body.id, user_receiver: receiver.id, message: "   " });
  assert.equal(empty.status, 400);

  const ok = await request(app).post("/compliments").set(auth).send({ tag_id: tag.body.id, user_receiver: receiver.id, message: "Obrigado pela ajuda!" });
  assert.equal(ok.status, 201);
  assert.equal(ok.body.tag.name_custom, "#Parceria");

  const received = await request(app).get("/users/compliments/receive").set("Authorization", `Bearer ${receiver.token}`);
  assert.equal(received.status, 200);
  assert.equal(received.body.length, 1);
  assert.equal(received.body[0].sender.name, "Dani");
  assert.ok(!JSON.stringify(received.body).includes("password"));
  assert.ok(!JSON.stringify(received.body).includes("$2"));

  const sent = await request(app).get("/users/compliments/send").set(auth);
  assert.equal(sent.body[0].receiver.name, "Rui");

  const users = await request(app).get("/users").set(auth);
  assert.ok(users.body.every((user: object) => Object.keys(user).sort().join() === "id,name"));
});

test("rotas protegidas sem token respondem 401 e rota inexistente 404", async () => {
  assert.equal((await request(app).get("/users")).status, 401);
  assert.equal((await request(app).get("/nada")).status, 404);
  assert.equal((await request(app).get("/health")).body.status, "ok");
});
test("seedAdmin cria o admin do ambiente, promove se já existir e ignora sem variáveis", async () => {
  assert.equal(await seedAdmin("", ""), "ignorado");
  assert.equal(await seedAdmin("Ops@Empresa.com", "senha-forte"), "criado");
  const login = await request(app).post("/login").send({ email: "ops@empresa.com", password: "senha-forte" });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.admin, true);
  assert.equal(await seedAdmin("ops@empresa.com", "senha-forte"), "promovido");
});
/* fim de api.test.ts */
