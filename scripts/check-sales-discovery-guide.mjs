import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const guidePath = path.join(root, 'docs/commercial/SALES_DISCOVERY_GUIDE_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const copyPath = path.join(root, 'docs/commercial/COMMERCIAL_COPY_CONTRACT_v1.json');

const [guide, portfolio, copy] = await Promise.all([
  readFile(guidePath, 'utf8').then(JSON.parse),
  readFile(portfolioPath, 'utf8').then(JSON.parse),
  readFile(copyPath, 'utf8').then(JSON.parse),
]);

const errors = [];
const ids = (portfolio.products ?? []).map((p) => p.id).sort();
const routed = (guide.routing ?? []).map((p) => p.product_id).sort();
const copyIds = (copy.products ?? []).map((p) => p.product_id).sort();

if (guide.version !== '1.0.0') errors.push('Guia deve usar version 1.0.0.');
if (guide.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (guide.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (JSON.stringify(ids) !== JSON.stringify(routed)) errors.push('Roteamento deve cobrir exatamente os produtos do portfólio.');
if (JSON.stringify(ids) !== JSON.stringify(copyIds)) errors.push('Contrato de copy e portfólio divergem em product_id.');
if (!Array.isArray(guide.discovery_questions) || guide.discovery_questions.length < 6) errors.push('Guia deve ter ao menos 6 perguntas de descoberta.');
if (!Array.isArray(guide.safe_outcomes) || !guide.safe_outcomes.some((x) => /nenhum produto/i.test(x))) errors.push('Guia deve permitir explicitamente concluir que nenhum produto é necessário.');

for (const item of guide.routing ?? []) {
  if (!Array.isArray(item.signals) || item.signals.length < 2) errors.push(`${item.product_id}: signals insuficientes.`);
  if (!item.qualifying_question) errors.push(`${item.product_id}: qualifying_question ausente.`);
  if (!item.do_not_recommend_when) errors.push(`${item.product_id}: do_not_recommend_when ausente.`);
}

const serialized = JSON.stringify(guide).toLowerCase();
for (const pattern of copy.blocked_claim_patterns ?? []) {
  if (serialized.includes(String(pattern).toLowerCase())) errors.push(`Guia contém claim bloqueado literal: ${pattern}`);
}

const requiredProtections = [
  /não solicitar dados pessoais|não solicitar cpf/i,
  /não inventar preço/i,
  /não.*press(ão|ionar)/i,
];
for (const re of requiredProtections) if (!re.test(serialized)) errors.push(`Proteção obrigatória ausente: ${re}`);

const proKit = (guide.routing ?? []).find((x) => x.product_id === 'jpn-pro-kit');
if (!/em preparação/i.test(proKit?.do_not_recommend_when ?? '')) errors.push('Pro Kit deve permanecer explicitamente EM PREPARAÇÃO.');

const builder = (guide.routing ?? []).find((x) => x.product_id === 'jpn-prompt-builder');
if (!/qa físico contextual em celular|qa físico\/contextual em celular/i.test(builder?.do_not_recommend_when ?? '')) errors.push('Prompt Builder deve preservar pendência de QA físico/contextual em celular.');

const gestao = (guide.routing ?? []).find((x) => x.product_id === 'jpn-gestao-facil');
if (!/qa multiplataforma/i.test(gestao?.do_not_recommend_when ?? '')) errors.push('Gestão Fácil deve preservar pendência de QA multiplataforma.');

if (errors.length) {
  console.error('Sales discovery guide check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Sales discovery guide check OK: ${routed.length} produtos cobertos, descoberta não coercitiva e guardrails preservados.`);
