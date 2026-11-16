/*
 * openapi.test.ts · confere que cada rota de src/routes.ts (e /health) está descrita em docs/openapi.yaml.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const raiz = join(__dirname, "..");
const rotas = readFileSync(join(raiz, "src", "routes.ts"), "utf8");
const doc = readFileSync(join(raiz, "docs", "openapi.yaml"), "utf8");

/* Pares método + caminho declarados no router, mais o /health do app.ts */
const declaradas = [...rotas.matchAll(/router\.(get|post|put|patch|delete)\(\s*"([^"]+)"/g)].map((m) => [m[1], m[2]] as const);
declaradas.push(["get", "/health"]);

/* Bloco de um caminho no YAML: do "  /caminho:" até o próximo caminho de mesmo nível */
function bloco(caminho: string) {
  const inicio = doc.indexOf(`\n  ${caminho}:\n`);
  if (inicio < 0) return "";
  const resto = doc.slice(inicio + 1);
  const proximo = resto.slice(1).search(/\n  \/[^\n]*:\n/);
  return proximo < 0 ? resto : resto.slice(0, proximo + 1);
}

test("toda rota do router aparece no openapi.yaml com o método certo", () => {
  assert.ok(declaradas.length >= 10, `só ${declaradas.length} rotas lidas`);
  for (const [metodo, caminho] of declaradas) {
    assert.match(bloco(caminho), new RegExp(`\n    ${metodo}:\n`), `${metodo.toUpperCase()} ${caminho} não está em docs/openapi.yaml`);
  }
});
/* fim de openapi.test.ts */
