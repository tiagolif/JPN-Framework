import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const faqPath = path.join(root, 'docs/commercial/COMMERCIAL_FAQ_v1.md');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const promptIndexPath = path.join(root, 'docs/products/prompt-pack/PROMPT_INDEX.json');
const businessIndexPath = path.join(root, 'docs/products/jpn-business/BUSINESS_INDEX.json');

function fail(message) {
  console.error(`commercial FAQ check failed: ${message}`);
  process.exit(1);
}

for (const [label, file] of [
  ['FAQ', faqPath],
  ['portfólio', portfolioPath],
  ['índice do Prompt Pack', promptIndexPath],
  ['índice do JPN Business', businessIndexPath],
]) {
  if (!fs.existsSync(file)) fail(`${label} ausente`);
}

const faq = fs.readFileSync(faqPath, 'utf8');
const portfolio = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));
const promptIndex = JSON.parse(fs.readFileSync(promptIndexPath, 'utf8'));
const businessIndex = JSON.parse(fs.readFileSync(businessIndexPath, 'utf8'));

if (!Array.isArray(portfolio.products) || portfolio.products.length !== 6) {
  fail('esperados exatamente 6 produtos no portfólio canônico');
}

for (const product of portfolio.products) {
  if (!product.canonical_name || !faq.includes(product.canonical_name)) {
    fail(`produto canônico ausente da FAQ: ${product.id}`);
  }
  if (!product.audience || !product.role) {
    fail(`produto canônico incompleto no portfólio: ${product.id}`);
  }
}

const promptCount = Array.isArray(promptIndex.templates) ? promptIndex.templates.length : null;
const businessCount = Array.isArray(businessIndex.playbooks) ? businessIndex.playbooks.length : null;
if (!Number.isInteger(promptCount) || promptCount < 1) fail('quantidade de templates não pôde ser derivada');
if (!Number.isInteger(businessCount) || businessCount < 1) fail('quantidade de playbooks não pôde ser derivada');
if (!new RegExp(`\\b${promptCount} templates\\b`, 'iu').test(faq)) {
  fail(`FAQ não declara a quantidade canônica atual de ${promptCount} templates`);
}
if (!new RegExp(`\\b${businessCount} playbooks\\b`, 'iu').test(faq)) {
  fail(`FAQ não declara a quantidade canônica atual de ${businessCount} playbooks`);
}

for (const dimension of ['Jornada', 'Precisão', 'Narrativa']) {
  if (!faq.includes(dimension)) fail(`dimensão canônica ausente: ${dimension}`);
}

const requiredSections = [
  '## Regras de uso',
  '## 3. O que é o Método JPN?',
  '## 4. O que é o JPN Prompt Pack?',
  '## 5. O que é o JPN Business?',
  '## 6. O que é o JPN Prompt Builder?',
  '## 7. O que é o JPN Gestão Fácil?',
  '## 8. O que é o JPN Pro Kit?',
  '## 13. Existe preço definido?',
  '## 14. Existe data de lançamento?',
  '## 15. Onde posso comprar?',
  '## 17. Posso usar os produtos com dados sensíveis?',
  '## 18. O material já está finalizado?',
  '## Claims bloqueados sem evidência',
  '## Estado comercial',
];
for (const section of requiredSections) {
  if (!faq.includes(section)) fail(`seção obrigatória ausente: ${section}`);
}

const requiredGuardrails = [
  'não inventar preço, desconto, bônus, prazo, disponibilidade ou compatibilidade',
  'não apresentar candidato interno como produto final',
  'não criar urgência ou escassez artificial',
  'Não há garantia de resultado',
  'não deve fornecer checkout, link de compra ou instrução de pagamento',
  'Materiais de demonstração e QA interno devem usar dados fictícios',
  'preço autorizado por esta FAQ: **não**',
  'checkout autorizado por esta FAQ: **não**',
  'venda autorizada por esta FAQ: **não**',
  'publicação autorizada por esta FAQ: **não**',
];
for (const guardrail of requiredGuardrails) {
  if (!faq.toLowerCase().includes(guardrail.toLowerCase())) {
    fail(`guardrail ausente: ${guardrail}`);
  }
}

const claimsStart = faq.indexOf('## Claims bloqueados sem evidência');
const stateStart = faq.indexOf('## Estado comercial');
if (claimsStart < 0 || stateStart <= claimsStart) fail('bloco de claims inválido');
const claims = faq.slice(claimsStart, stateStart);
for (const blocked of [
  'aumenta vendas',
  'reduz custos em X%',
  'economiza X horas',
  'melhora respostas em X%',
  'funciona em qualquer IA sem adaptação',
  '100% privado',
  'sem erros',
  'substitui funcionário, consultor, contador ou ERP',
  'garante resultado',
]) {
  if (!claims.includes(blocked)) fail(`claim bloqueado ausente: ${blocked}`);
}

if (!/GF-QA-10/.test(faq)) fail('FAQ não preserva a dependência GF-QA-10 da Gestão Fácil');
if (!/local\/offline/.test(faq)) fail('FAQ não preserva o caráter local/offline do Prompt Builder');
if (!/freeze real dos artefatos/.test(faq)) fail('FAQ não preserva o freeze do Pro Kit como dependência');

console.log(`Commercial FAQ OK: ${portfolio.products.length} produtos canônicos; Prompt Pack=${promptCount}; Business=${businessCount}; preço/venda/publicação permanecem não autorizados.`);
