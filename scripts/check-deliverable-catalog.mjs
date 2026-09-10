import './check-delivery-handoff-guide.mjs';
import './check-release-evidence-register.mjs';
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

if (catalog.version !== '1.0.1') errors.push('DELIVERABLE_CATALOG_v1.json deve usar version 1.0.1.');
if (catalog.framework !== portfolio.framework) errors.push('framework do catálogo diverge do portfólio canônico.');
if (!/candidate inventory/i.test(catalog.state ?? '')) errors.push('estado do catálogo deve permanecer candidato.');

const products = Array.isArray(catalog.products) ? catalog.products : [];
const portfolioProducts = Array.isArray(portfolio.products) ? portfolio.products : [];
if (products.length !== portfolioProducts.length) {
  errors.push(`Quantidade de produtos divergente: catálogo=${products.length}, portfólio=${portfolioProducts.length}.`);
}

const minimumCandidateCounts = new Map([
  ['metodo-jpn', 3],
  ['jpn-prompt-pack', 4],
  ['jpn-business', 10],
  ['jpn-prompt-builder', 5],
  ['jpn-pro-kit', 6],
  ['jpn-gestao-facil', 6],
]);

const requiredRecentDeliverables = [
  'docs/products/metodo-jpn/METODO_JPN_PRACTICE_WORKBOOK_v1.md',
  'docs/products/prompt-pack/PROMPT_SELECTION_WORKBOOK_v1.md',
  'docs/products/jpn-business/IMPLEMENTATION_WORKBOOK_v1.md',
  'docs/products/jpn-business/OPERATIONAL_SCORECARD_v1.md',
  'docs/products/jpn-business/30_DAY_IMPLEMENTATION_SPRINT_v1.md',
  'docs/products/jpn-business/WEEKLY_OPERATING_REVIEW_v1.md',
  'docs/products/prompt-builder/PROMPT_BUILDER_QUICK_START_v1.md',
  'docs/products/pro-kit/USAGE_ROUTING_GUIDE_v1.md',
  'docs/products/gestao-facil/OPERATIONAL_DATA_DICTIONARY_v0.1.md',
  'docs/products/gestao-facil/STARTER_DATA_KIT_v0.1.md',
];

const catalogById = new Map(products.map((product) => [product.id, product]));
const allProductDeliverables = new Set();
for (const canonical of portfolioProducts) {
  const product = catalogById.get(canonical.id);
  if (!product) {
    errors.push(`${canonical.id}: ausente do catálogo de entregáveis.`);
    continue;
  }
  if (product.canonical_name !== canonical.canonical_name) errors.push(`${canonical.id}: nome canônico divergente.`);
  if (product.release_ready !== false) errors.push(`${canonical.id}: release_ready deve permanecer false até evidência final.`);
  if (!Array.isArray(product.candidate_deliverables) || product.candidate_deliverables.length === 0) {
    errors.push(`${canonical.id}: candidate_deliverables vazio.`);
  } else {
    const minimum = minimumCandidateCounts.get(canonical.id) ?? 1;
    if (product.candidate_deliverables.length < minimum) {
      errors.push(`${canonical.id}: catálogo regressou para ${product.candidate_deliverables.length} candidatos; mínimo atual=${minimum}.`);
    }
    for (const relative of product.candidate_deliverables) {
      allProductDeliverables.add(relative);
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

for (const required of requiredRecentDeliverables) {
  if (!allProductDeliverables.has(required)) errors.push(`Entregável recente não registrado no catálogo: ${required}`);
}

const shared = catalog.shared_candidate_surfaces ?? [];
if (shared.length < 24) errors.push(`Superfícies compartilhadas regressaram para ${shared.length}; mínimo atual=24.`);
for (const relative of shared) {
  try {
    await access(path.join(root, relative));
  } catch {
    errors.push(`Superfície compartilhada ausente: ${relative}`);
  }
}

for (const required of [
  'docs/brand/SOCIAL_PRODUCTION_KIT_v1.md',
  'docs/commercial/COPY_BANK_v1.md',
  'docs/commercial/OBJECTION_RESPONSE_LIBRARY_v1.md',
  'docs/commercial/SOCIAL_CONTENT_LIBRARY_v1.md',
  'docs/commercial/PRODUCT_ONE_PAGERS_v1.md',
  'docs/product-system/CUSTOMER_DELIVERY_HANDOFF_v1.md',
  'docs/product-system/RELEASE_EVIDENCE_REGISTER_v1.md',
  'docs/product-system/RELEASE_EVIDENCE_REGISTER_v1.csv',
  'deliverables/templates/README_ENTREGA.template.md',
  'deliverables/templates/SHA256SUMS.template.txt',
]) {
  if (!shared.includes(required)) errors.push(`Superfície compartilhada recente não registrada: ${required}`);
}

for (const phrase of [
  'QA físico contextual em celular continua pendente',
  'GF-QA-10 continua pendente',
  'EM PREPARAÇÃO',
  'Hash só pode ser chamado de final depois do freeze',
  'atualizar este catálogo na mesma cadeia de trabalho',
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

console.log(`Deliverable catalog check OK: ${products.length} produtos, ${allProductDeliverables.size} candidatos de produto e ${shared.length} superfícies compartilhadas verificadas.`);