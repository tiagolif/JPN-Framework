import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const faqPath = path.join(root, 'docs/commercial/PRODUCT_FAQ_OBJECTIONS_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const matrixPath = path.join(root, 'docs/commercial/PRODUCT_COMPARISON_MATRIX_v1.json');

const faq = JSON.parse(await readFile(faqPath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const matrix = JSON.parse(await readFile(matrixPath, 'utf8'));
const errors = [];

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const canonicalIds = new Set((portfolio.products ?? []).map((item) => item.id));
const matrixIds = new Set((matrix.products ?? []).map((item) => item.product_id));
const faqProducts = Array.isArray(faq.products) ? faq.products : [];

if (faq.version !== '1.0.0') errors.push('PRODUCT_FAQ_OBJECTIONS_v1.json deve usar version 1.0.0.');
if (faq.framework !== portfolio.framework) errors.push('framework do FAQ diverge do portfólio canônico.');
if (faq.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (faq.release_effect !== 'none') errors.push('release_effect deve permanecer none.');

if (faqProducts.length !== canonicalIds.size) {
  errors.push(`FAQ deve cobrir exatamente ${canonicalIds.size} produtos; encontrado ${faqProducts.length}.`);
}

const seenProducts = new Set();
const seenEntryIds = new Set();
for (const product of faqProducts) {
  if (!canonicalIds.has(product.product_id)) errors.push(`Produto inválido no FAQ: ${product.product_id}.`);
  if (!matrixIds.has(product.product_id)) errors.push(`Produto ${product.product_id} não está coberto pela matriz comparativa.`);
  if (seenProducts.has(product.product_id)) errors.push(`Produto duplicado no FAQ: ${product.product_id}.`);
  seenProducts.add(product.product_id);

  if (!Array.isArray(product.faq) || product.faq.length < 2) errors.push(`${product.product_id}: deve ter ao menos 2 FAQs.`);
  if (!Array.isArray(product.objections) || product.objections.length < 1) errors.push(`${product.product_id}: deve ter ao menos 1 objeção.`);

  for (const entry of [...(product.faq ?? []), ...(product.objections ?? [])]) {
    if (!nonEmpty(entry.id)) errors.push(`${product.product_id}: entrada sem id.`);
    if (seenEntryIds.has(entry.id)) errors.push(`ID duplicado: ${entry.id}.`);
    seenEntryIds.add(entry.id);
    const prompt = entry.question ?? entry.objection;
    const response = entry.answer ?? entry.response;
    if (!nonEmpty(prompt)) errors.push(`${entry.id ?? product.product_id}: pergunta/objeção vazia.`);
    if (!nonEmpty(response)) errors.push(`${entry.id ?? product.product_id}: resposta vazia.`);
  }
}

for (const id of canonicalIds) {
  if (!seenProducts.has(id)) errors.push(`${id}: ausente do FAQ.`);
}

const allText = JSON.stringify(faq).toLowerCase();
const riskyClaims = [
  /roi\s+garantid/,
  /resultado(s)?\s+garantid/,
  /vendas?\s+garantid/,
  /100%\s+(corret|precis)/,
  /elimina\s+alucina/,
  /substitui\s+revis[aã]o\s+humana/,
];
for (const claim of riskyClaims) {
  if (claim.test(allText)) errors.push(`FAQ contém claim de risco: ${claim}`);
}

const forbiddenCommerce = [
  /compre\s+agora/,
  /checkout/,
  /desconto\s+de\s+\d/,
  /últimas?\s+vagas?/,
  /oferta\s+expira/,
];
for (const claim of forbiddenCommerce) {
  if (claim.test(allText.replace(/sem checkout/g, ''))) errors.push(`FAQ contém linguagem comercial proibida: ${claim}`);
}

const gestao = faqProducts.find((item) => item.product_id === 'jpn-gestao-facil');
const gestaoText = JSON.stringify(gestao ?? {}).toLowerCase();
for (const required of ['contabilidade', 'banco', 'fiscal', 'erp']) {
  if (!gestaoText.includes(required)) errors.push(`Gestão Fácil precisa manter limite explícito sobre ${required}.`);
}

const proKit = faqProducts.find((item) => item.product_id === 'jpn-pro-kit');
const proKitText = JSON.stringify(proKit ?? {}).toLowerCase();
if (!proKitText.includes('gates finais')) errors.push('Pro Kit precisa manter dependência explícita dos gates finais.');
if (!proKitText.includes('menor produto suficiente')) errors.push('Pro Kit precisa preservar a regra do menor produto suficiente.');

if (!Array.isArray(faq.global_faq) || faq.global_faq.length < 5) errors.push('global_faq deve ter ao menos 5 respostas gerais.');
if (!Array.isArray(faq.guardrails) || faq.guardrails.length < 5) errors.push('guardrails deve ter ao menos 5 itens.');

if (errors.length > 0) {
  console.error('Product FAQ/objections check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Product FAQ/objections check OK: ${faqProducts.length} produtos, ${seenEntryIds.size} entradas específicas e ${(faq.global_faq ?? []).length} FAQs gerais validados.`);
