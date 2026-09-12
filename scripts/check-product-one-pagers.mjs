import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const onePagersPath = path.join(root, 'docs/commercial/PRODUCT_ONE_PAGERS_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const matrixPath = path.join(root, 'docs/commercial/PRODUCT_COMPARISON_MATRIX_v1.json');
const releasePath = path.join(root, 'docs/commercial/COMMERCIAL_RELEASE_STATE_v1.json');

const onePagers = JSON.parse(await readFile(onePagersPath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const matrix = JSON.parse(await readFile(matrixPath, 'utf8'));
const release = JSON.parse(await readFile(releasePath, 'utf8'));

const errors = [];
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const cards = Array.isArray(onePagers.products) ? onePagers.products : [];
const portfolioProducts = Array.isArray(portfolio.products) ? portfolio.products : [];
const matrixProducts = Array.isArray(matrix.products) ? matrix.products : [];
const releaseProducts = Array.isArray(release.products) ? release.products : [];

if (onePagers.version !== '1.0.0') errors.push('PRODUCT_ONE_PAGERS_v1.json deve usar version 1.0.0.');
if (onePagers.framework !== portfolio.framework) errors.push('framework dos one-pagers diverge do portfólio canônico.');
if (onePagers.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (onePagers.release_effect !== 'none') errors.push('release_effect deve permanecer none.');

const portfolioIds = new Set(portfolioProducts.map((item) => item.id));
const cardIds = cards.map((item) => item.product_id);
const seen = new Set();

if (cards.length !== portfolioProducts.length) {
  errors.push(`Cobertura incompleta dos one-pagers: cards=${cards.length}, portfólio=${portfolioProducts.length}.`);
}

const requiredFields = ['headline', 'problem', 'what_it_is', 'use_when', 'input', 'output', 'not_for'];
for (const card of cards) {
  const id = card.product_id;
  if (!portfolioIds.has(id)) errors.push(`${id ?? '<sem-id>'}: produto inexistente no portfólio.`);
  if (seen.has(id)) errors.push(`One-pager duplicado: ${id}`);
  seen.add(id);

  for (const field of requiredFields) {
    if (!nonEmpty(card[field])) errors.push(`${id ?? '<sem-id>'}: ${field} ausente.`);
  }

  if (!Array.isArray(card.next_if_needed)) errors.push(`${id ?? '<sem-id>'}: next_if_needed deve ser array.`);
  for (const next of card.next_if_needed ?? []) {
    if (!portfolioIds.has(next)) errors.push(`${id}: next_if_needed referencia produto inválido: ${next}.`);
  }

  const matrixItem = matrixProducts.find((item) => item.product_id === id);
  if (!matrixItem) {
    errors.push(`${id}: ausente da matriz comparativa.`);
  } else {
    const allowedNext = new Set(matrixItem.next_if_needed ?? []);
    for (const next of card.next_if_needed ?? []) {
      if (!allowedNext.has(next)) errors.push(`${id}: continuidade ${next} não está autorizada pela matriz comparativa.`);
    }
  }
}

for (const id of portfolioIds) {
  if (!seen.has(id)) errors.push(`${id}: produto canônico sem one-pager.`);
}

const descriptiveText = cards.map((card) => [card.headline, card.problem, card.what_it_is, card.use_when, card.output].join(' ')).join(' ');
const riskyClaims = [
  /garant(e|ia)\s+(de\s+)?resultado/i,
  /roi\s+garantid/i,
  /100%\s+precis/i,
  /elimina\s+alucina/i,
  /substitui\s+revis[aã]o\s+humana/i,
  /vendas?\s+garantid/i,
  /lucro\s+garantid/i,
];
for (const claim of riskyClaims) {
  if (claim.test(descriptiveText)) errors.push(`One-pagers contêm claim de risco: ${claim}`);
}

const forbiddenCommercialSurface = /\b(pre[cç]o|checkout|compre\s+agora|desconto|oferta\s+por\s+tempo|garantia\s+de\s+reembolso)\b/i;
if (forbiddenCommercialSurface.test(descriptiveText)) {
  errors.push('One-pagers contêm superfície comercial proibida para este estado interno.');
}

const gestao = cards.find((item) => item.product_id === 'jpn-gestao-facil');
if (gestao) {
  const text = `${gestao.what_it_is} ${gestao.not_for}`;
  for (const term of ['contabilidade', 'banco', 'fiscal', 'ERP', 'auditoria']) {
    if (!text.toLowerCase().includes(term.toLowerCase())) errors.push(`jpn-gestao-facil: limite deve mencionar ${term}.`);
  }
}

const proKit = cards.find((item) => item.product_id === 'jpn-pro-kit');
const proKitRelease = releaseProducts.find((item) => item.id === 'jpn-pro-kit');
if (proKit && proKitRelease?.open_dependencies?.length > 0) {
  const text = `${proKit.use_when} ${proKit.not_for}`.toLowerCase();
  if (!text.includes('depend') && !text.includes('gate') && !text.includes('final')) {
    errors.push('jpn-pro-kit: one-pager deve explicitar dependência de fechamento dos gates finais.');
  }
  if (proKitRelease.public_presentation_allowed !== false) {
    errors.push('jpn-pro-kit: estado comercial divergiu do guardrail esperado durante dependências abertas.');
  }
}

if (errors.length > 0) {
  console.error('Product one-pagers check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Product one-pagers check OK: ${cards.length} fichas canônicas validadas contra portfólio, matriz e estado comercial.`);
