/*
 * erros.test.ts · critério 8 numa API sem tela: toda resposta de erro tem {error} legível em português
 * e o status de cada caso está descrito em docs/openapi.yaml. Roda em processo próprio, com SQLite em memória.
 */
process.env.JWT_SECRET = "segredo-de-teste-com-mais-de-32-caracteres";
process.env.BCRYPT_COST = "4";

import "reflect-metadata";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import request from "supertest";
import { DataSource } from "typeorm";
import { createDatabaseConnection } from "../src/database";
import { createApp } from "../src/app";

let connection: DataSource;
const app = createApp();
const doc = readFileSync(join(__dirname, "..", "docs", "openapi.yaml"), "utf8").replace(/\r\n/g, "\n");

/* Mensagens padrão do Express e do Node em inglês que não podem chegar ao cliente */
const INGLES = /\b(Cannot|Not Found|Bad Request|Unauthorized|Forbidden|Conflict|Unprocessable|Internal Server Error|Payload Too Large|request entity|Unexpected token|Invalid|Required|Expected|must be|is required|error)\b/i;
/* Marcas do português nas mensagens da API: acentos, cedilha ou palavras usadas nelas */
const PORTUGUES = /[áàâãéêíóôõúç]|\b(Apenas|Informe|Erro|Escreva|deve|ficar|senha|incorretos)\b/i;

/* Confere o formato {error} e o idioma de uma resposta de erro */
function confereErro(res: request.Response, status: number, caso: string) {
  assert.equal(res.status, status, `${caso}: status ${res.status} ${JSON.stringify(res.body)}`);
  assert.match(String(res.headers["content-type"]), /application\/json/, `${caso}: resposta não é JSON`);
  assert.deepEqual(Object.keys(res.body), ["error"], `${caso}: corpo fora do formato {error}`);
  const msg = res.body.error;
  assert.equal(typeof msg, "string", caso);
  assert.ok(msg.length >= 10 && /\.$/.test(msg), `${caso}: mensagem curta ou sem ponto final: "${msg}"`);
  assert.doesNotMatch(msg, INGLES, `${caso}: mensagem em inglês: "${msg}"`);
  assert.match(msg, PORTUGUES, `${caso}: mensagem sem marca do português: "${msg}"`);
}

/* Bloco de uma operação (método + caminho) no openapi.yaml */
function operacao(metodo: string, caminho: string) {
  const inicio = doc.indexOf(`\n  ${caminho}:\n`);
  assert.ok(inicio >= 0, `${caminho} não está no openapi.yaml`);
  const resto = doc.slice(inicio + 1);
  const fimCaminho = resto.slice(1).search(/\n(  \/[^\n]*|[a-z][^\n]*):\n/);
  const blocoCaminho = fimCaminho < 0 ? resto : resto.slice(0, fimCaminho + 1);
  const m = blocoCaminho.indexOf(`\n    ${metodo}:\n`);
  assert.ok(m >= 0, `${metodo.toUpperCase()} ${caminho} não está no openapi.yaml`);
  const op = blocoCaminho.slice(m + 1);
  const fimOp = op.slice(1).search(/\n    [a-z]+:\n/);
  return fimOp < 0 ? op : op.slice(0, fimOp + 1);
}

/* Confere que o status está nas respostas da operação no OpenAPI */
function documentado(metodo: string, caminho: string, status: number) {
  assert.match(operacao(metodo, caminho), new RegExp(`\\n        "${status}":`), `${status} de ${metodo.toUpperCase()} ${caminho} não está no openapi.yaml`);
}

/* Cadastra e autentica, devolvendo token e id */
async function entrar(name: string, email: string) {
  const criado = await request(app).post("/users").send({ name, email, password: "senha-forte" });
  assert.equal(criado.status, 201, JSON.stringify(criado.body));
  const login = await request(app).post("/login").send({ email, password: "senha-forte" });
  return { id: criado.body.id as string, token: login.body.token as string };
}

before(async () => {
  connection = await createDatabaseConnection(":memory:");
});

after(async () => {
  if (connection.isInitialized) await connection.destroy();
});

test("erros 400, 401, 403, 404, 409 e 422 têm {error} em português e status descrito no OpenAPI", async () => {
  const ana = await entrar("Ana", "ana@empresa.test");
  const rui = await entrar("Rui", "rui@empresa.test");
  await connection.query(`UPDATE users SET admin = 1 WHERE id = ?`, [ana.id]);
  const admin = { Authorization: `Bearer ${ana.token}` };
  const comum = { Authorization: `Bearer ${rui.token}` };
  const tag = await request(app).post("/tags").set(admin).send({ name: "Clareza" });
  assert.equal(tag.status, 201);
  const semId = "00000000-0000-4000-8000-000000000000";

  const casos: Array<[string, string, number, () => request.Test]> = [
    ["post", "/users", 400, () => request(app).post("/users").send({ name: "", email: "x", password: "1" })],
    ["post", "/users", 400, () => request(app).post("/users").set("Content-Type", "application/json").send("{oops")],
    ["post", "/users", 409, () => request(app).post("/users").send({ name: "Ana 2", email: "ANA@empresa.test", password: "senha-forte" })],
    ["post", "/login", 400, () => request(app).post("/login").send({ email: "nao-e-email", password: "x" })],
    ["post", "/login", 401, () => request(app).post("/login").send({ email: "ana@empresa.test", password: "senha-errada" })],
    ["get", "/users", 401, () => request(app).get("/users")],
    ["get", "/tags", 401, () => request(app).get("/tags").set("Authorization", "Bearer token-quebrado")],
    ["post", "/tags", 400, () => request(app).post("/tags").set(admin).send({ name: "" })],
    ["post", "/tags", 403, () => request(app).post("/tags").set(comum).send({ name: "Outra" })],
    ["post", "/tags", 409, () => request(app).post("/tags").set(admin).send({ name: "clareza" })],
    ["post", "/compliments", 400, () => request(app).post("/compliments").set(comum).send({ tag_id: "x", user_receiver: ana.id, message: "Oi" })],
    ["post", "/compliments", 404, () => request(app).post("/compliments").set(comum).send({ tag_id: tag.body.id, user_receiver: semId, message: "Oi" })],
    ["post", "/compliments", 404, () => request(app).post("/compliments").set(comum).send({ tag_id: semId, user_receiver: ana.id, message: "Oi" })],
    ["post", "/compliments", 422, () => request(app).post("/compliments").set(comum).send({ tag_id: tag.body.id, user_receiver: rui.id, message: "Oi" })],
    ["get", "/users/compliments/send", 400, () => request(app).get("/users/compliments/send?limit=0").set(comum)],
    ["get", "/users/compliments/receive", 400, () => request(app).get("/users/compliments/receive?page=abc").set(comum)],
    ["get", "/users/compliments/summary", 401, () => request(app).get("/users/compliments/summary")],
  ];

  const vistos = new Set<number>();
  for (const [metodo, caminho, status, chamar] of casos) {
    const caso = `${metodo.toUpperCase()} ${caminho} (${status})`;
    confereErro(await chamar(), status, caso);
    documentado(metodo, caminho, status);
    vistos.add(status);
  }
  assert.deepEqual([...vistos].sort((a, b) => a - b), [400, 401, 403, 404, 409, 422]);
});

test("erros comuns (rota inexistente 404 e corpo grande 413) seguem o formato e estão no OpenAPI", async () => {
  confereErro(await request(app).get("/nada"), 404, "GET /nada");
  confereErro(await request(app).post("/nada").send({}), 404, "POST /nada");
  const grande = { name: "x".repeat(11 * 1024), email: "g@empresa.test", password: "senha-forte" };
  confereErro(await request(app).post("/users").send(grande), 413, "POST /users acima de 10 kB");
  assert.match(doc, /404 para rota inexistente/);
  assert.match(doc, /413 para corpo JSON acima de 10 kB/);
});

test("erro inesperado vira 500 com mensagem genérica em português, sem detalhe interno", async (t) => {
  const { token } = await entrar("Lia", "lia@empresa.test");
  const log = t.mock.method(console, "error", () => {});
  await connection.destroy();
  const res = await request(app).get("/tags").set("Authorization", `Bearer ${token}`);
  confereErro(res, 500, "GET /tags com o banco fechado");
  assert.equal(res.body.error, "Erro interno. Tente novamente em instantes.");
  assert.equal(log.mock.callCount(), 1, "o erro real fica só no log do servidor");
  assert.match(doc, /500 para erro interno/);
});
/* fim de erros.test.ts */
