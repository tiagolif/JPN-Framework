import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const preflightPath = path.join(root, 'docs/product-system/EDITORIAL_PREFLIGHT_v1.json');
const releasePath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');

const preflight = JSON.parse(await readFile(preflightPath, 'utf8'));
const release = JSON.parse(await readFile(releasePath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const errors = [];

const expectedProducts = ['metodo-jpn', 'jpn-prompt-pack', 'jpn-business'];
const products = Array.isArray(preflight.products) ? preflight.products : [];
const byReleaseId = new Map((release.products ?? []).map((item) => [item.id, item]));
const portfolioIds = new Set((portfolio.products ?? []).map((item) => item.id));
const seen = new Set();

if (preflight.version !== '1.0.0') errors.push('EDITORIAL_PREFLIGHT_v1.json deve usar version 1.0.0.');
if (preflight.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (preflight.release_effect !== 'none') errors.push('release_effect deve permanecer none.');

for (const product of products) {
  if (!expectedProducts.includes(product.product_id)) errors.push(`produto editorial inesperado: ${product.product_id}`);
  if (seen.has(product.product_id)) errors.push(`produto duplicado: ${product.product_id}`);
  seen.add(product.product_id);
  if (!portfolioIds.has(product.product_id)) errors.push(`${product.product_id}: ausente do portfólio canônico.`);

  for (const key of ['title', 'cover', 'target_artifact']) {
    if (typeof product[key] !== 'string' || product[key].trim() === '') errors.push(`${product.product_id}: ${key} ausente.`);
  }

  for (const listKey of ['primary_sources', 'supporting_review_sources', 'editorial_order', 'required_release_dependencies', 'preflight_checks']) {
    if (!Array.isArray(product[listKey]) || product[listKey].length === 0) errors.push(`${product.product_id}: ${listKey} vazio.`);
  }

  for (const source of [...(product.primary_sources ?? []), ...(product.supporting_review_sources ?? []), product.cover].filter(Boolean)) {
    try {
      await access(path.join(root, source));
    } catch {
      errors.push(`${product.product_id}: fonte/capa inexistente: ${source}`);
    }
  }

  const releaseProduct = byReleaseId.get(product.product_id);
  if (!releaseProduct) {
    errors.push(`${product.product_id}: sem estado no PRODUCT_RELEASE_STATUS_v1.json.`);
    continue;
  }

  const releaseDependencies = (releaseProduct.dependencies ?? []).map((item) => item.id).sort();
  const expectedDependencies = [...(product.required_release_dependencies ?? [])].sort();
  if (JSON.stringify(releaseDependencies) !== JSON.stringify(expectedDependencies)) {
    errors.push(`${product.product_id}: dependências do preflight divergem do contrato de release.`);
  }

  for (const dependency of releaseProduct.dependencies ?? []) {
    if (dependency.id === 'revisao-editorial-humana' && dependency.status === 'passed' && !dependency.evidence) {
      errors.push(`${product.product_id}: revisão editorial humana não pode estar passed sem evidência.`);
    }
    if (dependency.id === 'pdf-final' && dependency.status === 'passed' && !dependency.evidence) {
      errors.push(`${product.product_id}: pdf-final não pode estar passed sem evidência.`);
    }
  }
}

for (const id of expectedProducts) {
  if (!seen.has(id)) errors.push(`produto editorial ausente: ${id}`);
}
if (products.length !== expectedProducts.length) errors.push(`esperados ${expectedProducts.length} produtos editoriais; encontrados ${products.length}.`);

const stateSequence = [
  'source-ready',
  'human-editorial-review-pending',
  'layout-candidate',
  'visual-qa-pending',
  'pdf-candidate',
  'page-by-page-review-pending',
  'release-decision-pending',
];
if (JSON.stringify(preflight.handoff_states) !== JSON.stringify(stateSequence)) {
  errors.push('handoff_states diverge da sequência editorial canônica.');
}

const sharedRules = (preflight.shared_editorial_rules ?? []).join(' ').toLowerCase();
for (const required of ['preço', 'checkout', 'dados financeiros', 'revisão humana', 'página a página']) {
  if (!sharedRules.includes(required)) errors.push(`guardrail compartilhado ausente: ${required}`);
}

const riskyPositiveClaims = [
  /garantia de resultado/i,
  /100% precis/i,
  /substitui revisão humana/i,
  /publica(c|ç)[aã]o autorizada/i,
];
for (const product of products) {
  const positiveText = `${product.title ?? ''} ${(product.editorial_order ?? []).join(' ')} ${(product.preflight_checks ?? []).join(' ')}`;
  for (const pattern of riskyPositiveClaims) {
    if (pattern.test(positiveText)) errors.push(`${product.product_id}: superfície positiva contém claim de risco: ${pattern}`);
  }
}

if (errors.length > 0) {
  console.error('Editorial preflight check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Editorial preflight check OK: ${products.length} produtos editoriais, fontes, dependências, handoff e guardrails validados.`);
