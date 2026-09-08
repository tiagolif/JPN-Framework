import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const statusPath = 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json';
const planPath = 'docs/product-system/RELEASE_EXECUTION_PLAN_v1.json';
const status = readJson(statusPath);
const plan = readJson(planPath);

assert(plan.version === '1.0.0', 'RELEASE_EXECUTION_PLAN_v1.json deve usar version 1.0.0.');
assert(plan.release_status_contract === statusPath, 'release_status_contract divergente.');
assert(plan.publication_authorized === false, 'O plano não pode autorizar publicação.');
assert(Array.isArray(plan.items), 'items deve ser array.');
assert(Array.isArray(plan.guardrails) && plan.guardrails.length >= 5, 'Guardrails insuficientes.');

const modes = new Set(plan.allowed_execution_modes || []);
for (const required of ['autonomous-local','requires-human-inspection','requires-external-environment','requires-ci','requires-explicit-authorization']) {
  assert(modes.has(required), `Modo obrigatório ausente: ${required}`);
}

const dependencies = [];
for (const product of status.products) {
  for (const dependency of product.dependencies) {
    dependencies.push({ product_id: product.id, dependency_id: dependency.id, status: dependency.status });
  }
}

assert(plan.items.length === dependencies.length, `Plano deve cobrir exatamente ${dependencies.length} dependências; recebeu ${plan.items.length}.`);

const seen = new Set();
for (const item of plan.items) {
  const key = `${item.product_id}::${item.dependency_id}`;
  assert(!seen.has(key), `Item duplicado: ${key}`);
  seen.add(key);
  assert(modes.has(item.execution_mode), `execution_mode inválido em ${key}: ${item.execution_mode}`);
  assert(['P0','P1','P2','P3'].includes(item.priority), `priority inválida em ${key}`);
  assert(typeof item.next_action === 'string' && item.next_action.trim().length >= 20, `next_action insuficiente em ${key}`);
  assert(typeof item.completion_evidence === 'string' && item.completion_evidence.trim().length >= 20, `completion_evidence insuficiente em ${key}`);
  assert(typeof item.can_run_without_new_authorization === 'boolean', `can_run_without_new_authorization ausente em ${key}`);

  const source = dependencies.find((dep) => dep.product_id === item.product_id && dep.dependency_id === item.dependency_id);
  assert(source, `Item sem dependência correspondente no contrato: ${key}`);

  if (item.execution_mode === 'requires-explicit-authorization') {
    assert(item.can_run_without_new_authorization === false, `${key} requer autorização explícita e não pode ser autônomo.`);
  }

  if (['requires-human-inspection','requires-external-environment','requires-ci'].includes(item.execution_mode)) {
    assert(source.status !== 'passed', `${key} não pode estar passed sem que o plano seja atualizado com evidência concreta.`);
  }
}

for (const dep of dependencies) {
  const key = `${dep.product_id}::${dep.dependency_id}`;
  assert(seen.has(key), `Dependência sem plano de execução: ${key}`);
}

const forbidden = /publicar agora|comprar agora|checkout|pagar agora|cart[aã]o de cr[eé]dito|dados financeiros reais/i;
for (const item of plan.items) {
  assert(!forbidden.test(item.next_action), `Ação proibida no plano: ${item.product_id}/${item.dependency_id}`);
}

console.log(`Release execution plan OK: ${plan.items.length} dependências cobertas, publicação não autorizada.`);
