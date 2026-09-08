import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const playbookPath = path.join(root, 'docs/commercial/SALES_ENABLEMENT_PLAYBOOK_v1.md');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');

function fail(message) {
  console.error(`sales enablement check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(playbookPath)) fail('playbook ausente');
if (!fs.existsSync(portfolioPath)) fail('portfólio canônico ausente');

const playbook = fs.readFileSync(playbookPath, 'utf8');
const portfolio = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));

if (!Array.isArray(portfolio.products) || portfolio.products.length !== 6) {
  fail('esperados exatamente 6 produtos no portfólio canônico');
}

for (const product of portfolio.products) {
  if (!product.canonical_name || !playbook.includes(product.canonical_name)) {
    fail(`produto canônico não representado no playbook: ${product.id}`);
  }
}

const requiredSections = [
  '## 1. Princípio de uso',
  '## 2. Mapa de indicação por necessidade',
  '## 3. Qualificação curta',
  '## 4. Roteiro de demonstração sem promessas',
  '## 5. Objeções e respostas seguras',
  '## 6. Encaminhamento entre produtos',
  '## 8. Mini-casos fictícios',
  '## 9. Checklist antes de enviar proposta ou link',
  '## 11. Claims que exigem evidência antes de uso',
  '## 12. Estado do material'
];

for (const section of requiredSections) {
  if (!playbook.includes(section)) fail(`seção obrigatória ausente: ${section}`);
}

const requiredGuardrails = [
  'não prometer ganho de receita, produtividade, precisão ou economia sem evidência específica',
  'não inventar preço, desconto, bônus, prazo, compatibilidade ou disponibilidade',
  'não apresentar candidato interno como produto final',
  'não pressionar o cliente com urgência artificial',
  'não representa publicação, oferta comercial ativa, preço ou autorização de venda'
];

for (const guardrail of requiredGuardrails) {
  if (!playbook.includes(guardrail)) fail(`guardrail obrigatório ausente: ${guardrail}`);
}

const unsafeAssertions = [
  /garante\s+(mais\s+)?vendas/i,
  /garante\s+resultado/i,
  /100%\s+privad[oa]/i,
  /substitui\s+(seu\s+)?contador/i,
  /publica(?:ção)?\s+autorizada/i,
  /release_ready\s*:\s*true/i
];

for (const pattern of unsafeAssertions) {
  if (pattern.test(playbook)) fail(`afirmação promocional indevida detectada: ${pattern}`);
}

if (!playbook.includes('não há garantia de resultado') && !playbook.includes('Não há garantia de resultado')) {
  fail('disclaimer explícito de ausência de garantia não encontrado');
}

console.log(`sales enablement playbook OK: ${portfolio.products.length} produtos canônicos cobertos`);
