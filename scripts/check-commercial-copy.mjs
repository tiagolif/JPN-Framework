import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const commercialDir = path.join(root, 'docs', 'commercial');

const files = fs.readdirSync(commercialDir)
  .filter((name) => name.endsWith('.md'))
  .map((name) => path.join(commercialDir, name));

const errors = [];
const warnings = [];

const blockedPatterns = [
  { re: /\bgarante?\s+(?:resultado|respostas? corretas?|vendas?|faturamento|roi)\b/giu, label: 'garantia comercial não comprovada' },
  { re: /\belimina\s+(?:alucinações|erros)\b/giu, label: 'claim absoluto de eliminação' },
  { re: /\b(?:aumenta|melhora|reduz|economiza)\s+\d+(?:[.,]\d+)?\s*%/giu, label: 'claim percentual sem evidência' },
  { re: /\bmelhor\s+que\s+(?:qualquer|todos?|todas?)\b/giu, label: 'superioridade universal' },
  { re: /\b(?:compre|comprar)\s+agora\b/giu, label: 'CTA transacional não autorizado' },
  { re: /\búltimas?\s+(?:vagas?|unidades?)\b/giu, label: 'escassez artificial' },
  { re: /\boferta\s+por\s+tempo\s+limitado\b/giu, label: 'urgência comercial não autorizada' },
];

const negationWindow = /(?:não|nao|sem|evitar|proibid[oa]s?|bloquead[oa]s?|não usar|nao usar)[^.!?\n]{0,80}$/iu;

for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const content = fs.readFileSync(file, 'utf8');

  for (const { re, label } of blockedPatterns) {
    re.lastIndex = 0;
    for (const match of content.matchAll(re)) {
      const before = content.slice(Math.max(0, match.index - 90), match.index);
      if (negationWindow.test(before)) continue;
      const line = content.slice(0, match.index).split('\n').length;
      errors.push(`${relative}:${line} — ${label}: “${match[0]}”`);
    }
  }

  if (/JPN Pro Kit/iu.test(content) && !/EM PREPARAÇÃO/iu.test(content)) {
    warnings.push(`${relative} menciona JPN Pro Kit sem o marcador “EM PREPARAÇÃO”.`);
  }
}

const pageSystem = path.join(commercialDir, 'PRODUCT_PAGE_SYSTEM_v1.md');
if (!fs.existsSync(pageSystem)) {
  errors.push('docs/commercial/PRODUCT_PAGE_SYSTEM_v1.md ausente.');
} else {
  const page = fs.readFileSync(pageSystem, 'utf8');
  const requiredProducts = [
    'Método JPN',
    'JPN Prompt Builder',
    'JPN Prompt Pack',
    'JPN Business',
    'JPN Gestão Fácil',
    'JPN Pro Kit',
  ];
  for (const product of requiredProducts) {
    if (!page.includes(product)) errors.push(`PRODUCT_PAGE_SYSTEM_v1.md não cobre ${product}.`);
  }
}

if (warnings.length) {
  console.warn('Avisos comerciais:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error('Gate comercial falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Gate comercial aprovado: ${files.length} arquivo(s) Markdown verificado(s).`);
