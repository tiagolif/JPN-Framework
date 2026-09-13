import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contractPath = path.join(root, 'docs/commercial/COMMERCIAL_COPY_CONTRACT_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');

const contract = JSON.parse(await readFile(contractPath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const errors = [];

const expectedIds = (portfolio.products ?? []).map((item) => item.id).sort();
const products = Array.isArray(contract.products) ? contract.products : [];
const actualIds = products.map((item) => item.product_id).sort();
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;

if (contract.version !== '1.0.0') errors.push('COMMERCIAL_COPY_CONTRACT_v1.json deve usar version 1.0.0.');
if (contract.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (contract.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
  errors.push(`Cobertura de produtos diverge do portfólio: ${actualIds.join(', ')} != ${expectedIds.join(', ')}.`);
}

try {
  await access(path.join(root, contract.source));
} catch {
  errors.push(`Fonte do contrato inexistente: ${contract.source}`);
}

const seen = new Set();
const positiveSurfaces = [];
for (const product of products) {
  if (seen.has(product.product_id)) errors.push(`Produto duplicado: ${product.product_id}`);
  seen.add(product.product_id);
  for (const key of ['headline', 'subheadline', 'short_description', 'neutral_cta', 'mandatory_limit']) {
    if (!nonEmpty(product[key])) errors.push(`${product.product_id}: ${key} ausente.`);
  }
  positiveSurfaces.push(product.headline ?? '', product.subheadline ?? '', product.short_description ?? '', product.neutral_cta ?? '');
}

const navigationCtas = Array.isArray(contract.approved_navigation_ctas) ? contract.approved_navigation_ctas : [];
if (navigationCtas.length < 6) errors.push('approved_navigation_ctas deve preservar o banco de CTAs informativos.');
for (const cta of navigationCtas) positiveSurfaces.push(cta);

const positiveText = positiveSurfaces.join('\n').toLowerCase();
for (const blocked of contract.blocked_claim_patterns ?? []) {
  const normalized = String(blocked).toLowerCase().replace('x%', '').replace('x horas', '').trim();
  if (normalized && positiveText.includes(normalized)) errors.push(`Claim bloqueado apareceu em superfície positiva: ${blocked}`);
}

const byId = new Map(products.map((item) => [item.product_id, item]));
if (!/18\s+templates/i.test(byId.get('jpn-prompt-pack')?.subheadline ?? '')) errors.push('Prompt Pack deve preservar a contagem canônica de 18 templates.');
if (!/doze\s+playbooks/i.test(byId.get('jpn-business')?.subheadline ?? '')) errors.push('JPN Business deve preservar a contagem canônica de 12 playbooks.');
if (!/repor/i.test(byId.get('jpn-gestao-facil')?.mandatory_limit ?? '')) errors.push('Gestão Fácil deve preservar o limite operacional de REPOR.');
if (!/em prepara[cç][aã]o/i.test(byId.get('jpn-pro-kit')?.mandatory_limit ?? '')) errors.push('Pro Kit deve permanecer explicitamente EM PREPARAÇÃO.');
if (!/qa.*celular|celular.*qa/i.test(byId.get('jpn-prompt-builder')?.mandatory_limit ?? '')) errors.push('Prompt Builder deve preservar a pendência de QA físico/contextual em celular.');

const forbiddenTransactionalCta = /(comprar|assinar|checkout|reservar|garantir vaga|pagar)/i;
for (const cta of [...navigationCtas, ...products.map((item) => item.neutral_cta ?? '')]) {
  if (forbiddenTransactionalCta.test(cta)) errors.push(`CTA transacional não permitido: ${cta}`);
}

const guardrails = (contract.guardrails ?? []).join(' ').toLowerCase();
for (const term of ['preço', 'urgência', 'release final', 'dados pessoais']) {
  if (!guardrails.includes(term)) errors.push(`Guardrail obrigatório ausente: ${term}`);
}

if (errors.length > 0) {
  console.error('Commercial copy contract check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial copy contract check OK: ${products.length} produtos e ${navigationCtas.length} CTAs informativos validados.`);
