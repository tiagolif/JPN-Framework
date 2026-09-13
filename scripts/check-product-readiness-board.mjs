import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readJson = async (rel) => JSON.parse(await readFile(path.join(root, rel), 'utf8'));
const portfolio = await readJson('docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const release = await readJson('docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const board = await readJson('docs/product-system/PRODUCT_READINESS_BOARD_v1.json');
const errors = [];

const portfolioProducts = Array.isArray(portfolio.products) ? portfolio.products : [];
const releaseProducts = Array.isArray(release.products) ? release.products : [];
const boardProducts = Array.isArray(board.products) ? board.products : [];
const portfolioIds = portfolioProducts.map((p) => p.id).sort();
const boardIds = boardProducts.map((p) => p.id).sort();

if (board.version !== '1.0.0') errors.push('PRODUCT_READINESS_BOARD_v1.json deve usar version 1.0.0.');
if (board.portfolio_contract !== 'docs/product-system/PRODUCT_PORTFOLIO_v1.json') errors.push('portfolio_contract inválido.');
if (board.release_status_contract !== 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json') errors.push('release_status_contract inválido.');
if (board.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (board.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (JSON.stringify(portfolioIds) !== JSON.stringify(boardIds)) errors.push('Board deve cobrir exatamente os produtos canônicos do portfólio.');

const releaseById = new Map(releaseProducts.map((p) => [p.id, p]));
let expectedReady = 0;
let expectedBlocked = 0;
let expectedInProgress = 0;

for (const item of boardProducts) {
  const releaseProduct = releaseById.get(item.id);
  if (!releaseProduct) {
    errors.push(`${item.id}: ausente de PRODUCT_RELEASE_STATUS_v1.json.`);
    continue;
  }

  const deps = Array.isArray(releaseProduct.dependencies) ? releaseProduct.dependencies : [];
  const pending = deps.filter((d) => d.status === 'pending' || d.status === 'blocked').map((d) => d.id).sort();
  const inProgress = deps.filter((d) => d.status === 'in-progress').map((d) => d.id).sort();
  const unresolved = deps.filter((d) => !['passed', 'not-applicable'].includes(d.status));
  const shouldBeReady = unresolved.length === 0;
  const expectedReadiness = shouldBeReady ? 'ready' : inProgress.length > 0 ? 'in-progress' : 'blocked';

  if (item.release_ready !== shouldBeReady) errors.push(`${item.id}: release_ready diverge do contrato de release.`);
  if (item.readiness !== expectedReadiness) errors.push(`${item.id}: readiness deveria ser ${expectedReadiness}.`);
  if (JSON.stringify([...(item.open_dependencies ?? [])].sort()) !== JSON.stringify(pending)) {
    errors.push(`${item.id}: open_dependencies divergem das dependências pending/blocked.`);
  }
  if (JSON.stringify([...(item.in_progress_dependencies ?? [])].sort()) !== JSON.stringify(inProgress)) {
    errors.push(`${item.id}: in_progress_dependencies divergem das dependências in-progress.`);
  }
  if (typeof item.next_safe_action !== 'string' || item.next_safe_action.trim().length < 20) {
    errors.push(`${item.id}: next_safe_action ausente ou insuficiente.`);
  }
  const evidenceDeps = item.requires_human_or_external_evidence ?? [];
  for (const dep of evidenceDeps) {
    if (!deps.some((d) => d.id === dep)) errors.push(`${item.id}: evidence dependency desconhecida: ${dep}.`);
  }

  if (shouldBeReady) expectedReady += 1;
  else if (expectedReadiness === 'in-progress') expectedInProgress += 1;
  else expectedBlocked += 1;
}

const summary = board.portfolio_summary ?? {};
if (summary.total_products !== portfolioProducts.length) errors.push('portfolio_summary.total_products incorreto.');
if (summary.release_ready !== expectedReady) errors.push('portfolio_summary.release_ready incorreto.');
if (summary.blocked !== expectedBlocked) errors.push('portfolio_summary.blocked incorreto.');
if (summary.in_progress !== expectedInProgress) errors.push('portfolio_summary.in_progress incorreto.');

const forbidden = /\b(comprar|assinar|pagar|checkout|publicar agora|anunciar agora)\b/i;
for (const item of boardProducts) {
  if (forbidden.test(item.next_safe_action ?? '')) errors.push(`${item.id}: next_safe_action contém ação transacional/publicação indevida.`);
}

if (errors.length) {
  console.error('Product readiness board check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Product readiness board check OK: ${boardProducts.length} produtos, ${expectedReady} release-ready, ${expectedInProgress} em andamento e ${expectedBlocked} bloqueados.`);
