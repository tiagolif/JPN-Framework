import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const statusPath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');

const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const status = JSON.parse(await readFile(statusPath, 'utf8'));
const errors = [];

const allowed = new Set(status.allowed_statuses ?? []);
if (allowed.size === 0) errors.push('allowed_statuses não pode ser vazio.');

const portfolioById = new Map(portfolio.products.map((product) => [product.id, product]));
const statusById = new Map(status.products.map((product) => [product.id, product]));

if (portfolioById.size !== portfolio.products.length) errors.push('PRODUCT_PORTFOLIO_v1.json contém IDs duplicados.');
if (statusById.size !== status.products.length) errors.push('PRODUCT_RELEASE_STATUS_v1.json contém IDs duplicados.');

for (const [id, product] of portfolioById) {
  const record = statusById.get(id);
  if (!record) {
    errors.push(`${id}: ausente do registro de status.`);
    continue;
  }

  const expected = new Set(product.release_dependencies ?? []);
  const actual = new Set((record.dependencies ?? []).map((dependency) => dependency.id));

  if (actual.size !== (record.dependencies ?? []).length) {
    errors.push(`${id}: dependências duplicadas no registro de status.`);
  }

  for (const dependency of expected) {
    if (!actual.has(dependency)) errors.push(`${id}: dependência ${dependency} ausente do registro de status.`);
  }
  for (const dependency of actual) {
    if (!expected.has(dependency)) errors.push(`${id}: dependência ${dependency} não existe no contrato de portfólio.`);
  }

  for (const dependency of record.dependencies ?? []) {
    if (!allowed.has(dependency.status)) {
      errors.push(`${id}/${dependency.id}: status inválido '${dependency.status}'.`);
    }
    if (typeof dependency.note !== 'string' || dependency.note.trim().length < 12) {
      errors.push(`${id}/${dependency.id}: note deve explicar o estado atual.`);
    }

    if (dependency.status === 'passed') {
      if (typeof dependency.evidence !== 'string' || dependency.evidence.trim() === '') {
        errors.push(`${id}/${dependency.id}: status passed exige evidence.`);
      } else if (!/^https:\/\/github\.com\/|^https:\/\/api\.github\.com\/|^[A-Za-z0-9_.\/-]+$/.test(dependency.evidence)) {
        errors.push(`${id}/${dependency.id}: evidence tem formato não permitido.`);
      } else if (!dependency.evidence.startsWith('http')) {
        try {
          const evidenceStat = await stat(path.join(root, dependency.evidence));
          if (!evidenceStat.isFile()) errors.push(`${id}/${dependency.id}: evidence local não é arquivo.`);
        } catch {
          errors.push(`${id}/${dependency.id}: evidence local ausente: ${dependency.evidence}`);
        }
      }
    }
  }
}

for (const id of statusById.keys()) {
  if (!portfolioById.has(id)) errors.push(`${id}: produto existe no registro de status, mas não no portfólio.`);
}

if (!Array.isArray(status.guardrails) || status.guardrails.length < 3) {
  errors.push('O registro de status deve conter guardrails explícitos.');
}

if (errors.length > 0) {
  console.error('Falha no contrato de status de release:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const total = status.products.reduce((sum, product) => sum + product.dependencies.length, 0);
const passed = status.products.reduce(
  (sum, product) => sum + product.dependencies.filter((dependency) => dependency.status === 'passed').length,
  0,
);

console.log(`Product release status OK: ${status.products.length} produtos, ${passed}/${total} dependências passed.`);
