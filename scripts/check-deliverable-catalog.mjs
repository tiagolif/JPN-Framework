import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const catalogPath = path.join(root, 'docs/product-system/DELIVERABLE_CATALOG_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const docPath = path.join(root, 'docs/product-system/DELIVERABLE_CATALOG_v1.md');

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const doc = await readFile(docPath, 'utf8');
const errors = [];

if (catalog.version !== '1.0.0') errors.push('DELIVERABLE_CATALOG_v1.json deve usar version 1.0.0.');
if (catalog.framework !== portfolio.framework) errors.push('framework do catálogo diverge do portfólio canônico.');
if (!/candidate inventory/i.test(catalog.state ?? '')) errors.push('estado do catálogo deve permanecer candidato.');

const products = Array.isArray(catalog.products) ? catalog.products : [];
const portfolioProducts = Array.isArray(portfolio.products) ? portfolio.products : [];
if (products.length !== portfolioProducts.length) {
  errors.push(`Quantidade de produtos divergente: catálogo=${products.length}, portfólio=${portfolioProducts.length}.`);
}

const catalogById = new Map(products.map((product) => [product.id, product]));
for (const canonical of portfolioProducts) {
  const product = catalogById.get(canonical.id);
  if (!product) {
    errors.push(`${canonical.id}: ausente do catálogo de entregáveis.`);
    continue;
  }
  if (product.canonical_name !== canonical.canonical_name) {
    errors.push(`${canonical.id}: nome canônico divergente.`);
  }
  if (product.release_ready !== false) {
    errors.push(`${canonical.id}: release_ready deve permanecer false até evidência final.`);
  }
  if (!Array.isArray(product.candidate_deliverables) || product.candidate_deliverables.length === 0) {
    errors.push(`${canonical.id}: candidate_deliverables vazio.`);
  } else {
    for (const relative of product.candidate_deliverables) {
      try {
        await access(path.join(root, relative));
      } catch {
        errors.push(`${canonical.id}: entregável candidato ausente: ${relative}`);
      }
    }
  }
  const expectedDeps = canonical.release_dependencies ?? [];
  const listedDeps = product.final_release_dependencies ?? [];
  for (const dep of expectedDeps) {
    if (!listedDeps.includes(dep)) errors.push(`${canonical.id}: dependência canônica ausente do catálogo: ${dep}`);
  }
}

for (const relative of catalog.shared_candidate_surfaces ?? []) {
  try {
    await access(path.join(root, relative));
  } catch {
    errors.push(`Superfície compartilhada ausente: ${relative}`);
  }
}

for (const phrase of [
  'QA físico contextual em celular continua pendente',
  'GF-QA-10 continua pendente',
  'EM PREPARAÇÃO',
  'Hash só pode ser chamado de final depois do freeze',
]) {
  if (!doc.includes(phrase)) errors.push(`DELIVERABLE_CATALOG_v1.md deve preservar: ${phrase}`);
}

const forbiddenReady = products.filter((product) => product.release_ready === true);
if (forbiddenReady.length) errors.push(`Produtos promovidos indevidamente: ${forbiddenReady.map((p) => p.id).join(', ')}`);

if (errors.length) {
  console.error('Deliverable catalog check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Deliverable catalog check OK: ${products.length} produtos e ${(catalog.shared_candidate_surfaces ?? []).length} superfícies compartilhadas verificadas.`);
