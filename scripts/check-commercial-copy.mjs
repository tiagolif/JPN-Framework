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

const negationWindow = /(?:não|nao|sem|evitar|proibid[oa]s?|bloquead[oa]s?|não usar|nao usar)[^.!?]{0,120}$/iu;

function isNegated(content, index, windowSize = 180) {
  const before = content
    .slice(Math.max(0, index - windowSize), index)
    .replace(/\s+/gu, ' ');
  return negationWindow.test(before);
}

for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const content = fs.readFileSync(file, 'utf8');

  for (const { re, label } of blockedPatterns) {
    re.lastIndex = 0;
    for (const match of content.matchAll(re)) {
      if (isNegated(content, match.index)) continue;
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

const copyBankPath = path.join(commercialDir, 'COPY_BANK_v1.md');
if (!fs.existsSync(copyBankPath)) {
  errors.push('docs/commercial/COPY_BANK_v1.md ausente.');
} else {
  const copy = fs.readFileSync(copyBankPath, 'utf8');
  const requiredMarkers = [
    '# JPN — Copy Bank v1',
    'Jornada · Precisão · Narrativa',
    'Método JPN',
    'JPN Prompt Pack',
    'JPN Business',
    'JPN Prompt Builder',
    'JPN Gestão Fácil',
    'JPN Pro Kit',
    '18 templates canônicos',
    'Doze playbooks empresariais',
    'GF-QA-10 continua pendente',
    'QA físico contextual em celular continua pendente',
    'Estado atual: `EM PREPARAÇÃO`',
    'Comece pelo menor recurso suficiente.',
    'Claims bloqueados sem evidência',
    'não publicado',
  ];

  for (const marker of requiredMarkers) {
    if (!copy.includes(marker)) errors.push(`COPY_BANK_v1.md perdeu marcador obrigatório: ${marker}`);
  }

  const ctaSection = copy.match(/## 10\. CTAs aprováveis sem transação([\s\S]*?)## 11\./u)?.[1] ?? '';
  const approvedCtas = ctaSection.match(/^- /gmu)?.length ?? 0;
  if (approvedCtas < 8) errors.push(`COPY_BANK_v1.md deve manter ao menos 8 CTAs informativos; encontrados ${approvedCtas}.`);

  const socialSection = copy.match(/## 11\. Frases curtas para arte e social interno([\s\S]*?)## 12\./u)?.[1] ?? '';
  const socialLines = socialSection.match(/^- /gmu)?.length ?? 0;
  if (socialLines < 8) errors.push(`COPY_BANK_v1.md deve manter ao menos 8 frases curtas; encontradas ${socialLines}.`);

  const transactionalPatterns = [
    { re: /\bR\$\s*\d/giu, label: 'preço monetário' },
    { re: /https?:\/\//giu, label: 'URL externa' },
    { re: /<form\b/giu, label: 'formulário' },
    { re: /\bcheckout\b/giu, label: 'checkout' },
    { re: /\bpix\b/giu, label: 'PIX' },
    { re: /\bcart[aã]o\s+de\s+cr[eé]dito\b/giu, label: 'cartão de crédito' },
  ];

  for (const { re, label } of transactionalPatterns) {
    re.lastIndex = 0;
    for (const match of copy.matchAll(re)) {
      if (isNegated(copy, match.index)) continue;
      const line = copy.slice(0, match.index).split('\n').length;
      errors.push(`COPY_BANK_v1.md:${line} contém ${label} transacional não autorizado: “${match[0]}”.`);
    }
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

console.log(`Gate comercial aprovado: ${files.length} arquivo(s) Markdown verificado(s), incluindo Copy Bank v1.`);

await import('./check-social-content-library.mjs');
await import('./check-commercial-one-pagers.mjs');
await import('./check-product-page-copy.mjs');
await import('./check-commercial-page-copy-sync.mjs');
