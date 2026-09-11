import { readFile } from 'node:fs/promises';

const pagePath = new URL('../docs/commercial/PRODUCT_PAGE_COPY_v1.md', import.meta.url);
const page = await readFile(pagePath, 'utf8');
const failures = [];

const requiredProducts = [
  'Método JPN',
  'JPN Prompt Builder',
  'JPN Prompt Pack',
  'JPN Business',
  'JPN Gestão Fácil',
  'JPN Pro Kit',
];

for (const product of requiredProducts) {
  if (!page.includes(product)) failures.push(`produto ausente da copy de página: ${product}`);
}

const requiredFacts = [
  '18 templates canônicos',
  '12 playbooks canônicos',
  'Jornada, Precisão e Narrativa',
  'GF-QA-10',
  'Excel, LibreOffice e Google Sheets',
  'QA físico contextual em celular',
  'REPOR` é somente um alerta operacional',
  '**EM PREPARAÇÃO**',
  'não autoriza publicação',
];

for (const fact of requiredFacts) {
  if (!page.includes(fact)) failures.push(`fato/guardrail obrigatório ausente: ${fact}`);
}

const requiredSections = [
  '# 1. Método JPN',
  '# 2. JPN Prompt Builder',
  '# 3. JPN Prompt Pack',
  '# 4. JPN Business',
  '# 5. JPN Gestão Fácil',
  '# 6. JPN Pro Kit',
  '# 7. Blocos globais reutilizáveis',
];
for (const section of requiredSections) {
  if (!page.includes(section)) failures.push(`seção ausente: ${section}`);
}

const blockedPatterns = [
  { re: /\b(?:compre|comprar)\s+agora\b/giu, label: 'CTA transacional' },
  { re: /\bR\$\s*\d/giu, label: 'preço monetário' },
  { re: /\b(?:desconto|cupom)\s+de\s+\d+%/giu, label: 'desconto' },
  { re: /\búltimas?\s+(?:vagas?|unidades?)\b/giu, label: 'escassez artificial' },
  { re: /\bgarante?\s+(?:resultado|vendas?|faturamento|roi|respostas? corretas?)\b/giu, label: 'garantia não comprovada' },
  { re: /\belimina\s+(?:erros|alucinações)\b/giu, label: 'claim absoluto' },
  { re: /https?:\/\//giu, label: 'URL externa' },
  { re: /<form\b/giu, label: 'formulário' },
];

const negationWindow = /(?:não|nao|sem|evitar|bloquead[oa]s?|não usar|nao usar)[^.!?\n]{0,70}$/iu;
for (const { re, label } of blockedPatterns) {
  re.lastIndex = 0;
  for (const match of page.matchAll(re)) {
    const before = page.slice(Math.max(0, match.index - 80), match.index);
    if (negationWindow.test(before)) continue;
    failures.push(`copy contém padrão bloqueado: ${label}: “${match[0]}”`);
  }
}

const ctaSection = page.match(/## CTAs informativos aprováveis nesta fase([\s\S]*?)## Claims/u)?.[1] ?? '';
const ctaCount = ctaSection.match(/^- /gmu)?.length ?? 0;
if (ctaCount < 8) failures.push(`esperados ao menos 8 CTAs informativos; encontrados ${ctaCount}`);

if (!page.includes('Modo Temporário')) failures.push('Prompt Builder perdeu referência ao Modo Temporário');
if (!page.includes('não deve ser apresentado como solução de DLP')) failures.push('limite de DLP/compliance do Builder ausente');
if (!page.includes('não substitui contabilidade')) failures.push('limite contábil da Gestão Fácil ausente');
if (!page.includes('não garante aumento de vendas')) failures.push('não-claim comercial do JPN Business ausente');

if (failures.length) {
  console.error('Falha no gate de Product Page Copy v1:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Product Page Copy v1: PASS');
console.log(`products=${requiredProducts.length}`);
console.log(`informational_ctas=${ctaCount}`);
console.log('publication_authorized=false');
