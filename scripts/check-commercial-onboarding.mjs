import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docPath = path.join(root, 'docs/commercial/CUSTOMER_ONBOARDING_GUIDE_v1.md');
const pagePath = path.join(root, 'commercial-site/primeiros-passos.html');
const errors = [];

for (const file of [docPath, pagePath]) {
  if (!fs.existsSync(file)) errors.push(`${path.relative(root, file)} ausente`);
}

const stripMarkup = (value) => value
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/\s+/g, ' ')
  .trim();

const clauseIsNegated = (text, index) => {
  const start = Math.max(
    text.lastIndexOf('.', index),
    text.lastIndexOf(';', index),
    text.lastIndexOf(':', index),
    text.lastIndexOf('!', index),
    text.lastIndexOf('?', index),
  ) + 1;
  const prefix = text.slice(start, index);
  return /\b(?:não|sem|nunca|jamais)\b/i.test(prefix);
};

const findPositiveUse = (text, pattern) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const matcher = new RegExp(pattern.source, flags);
  let match;
  while ((match = matcher.exec(text)) !== null) {
    if (!clauseIsNegated(text, match.index)) return match[0];
    if (match[0].length === 0) matcher.lastIndex += 1;
  }
  return null;
};

if (!errors.length) {
  const doc = fs.readFileSync(docPath, 'utf8');
  const page = fs.readFileSync(pagePath, 'utf8');
  const combined = `${doc}\n${page}`;
  const text = stripMarkup(combined);

  const required = [
    'candidate companion / commercial QA pending',
    'Comece pelo menor recurso que resolva a necessidade atual',
    'Método JPN',
    'JPN Prompt Builder',
    'JPN Prompt Pack',
    'JPN Business',
    'JPN Gestão Fácil',
    'JPN Pro Kit',
    'QA físico contextual em celular',
    'GF-QA-10',
    'EM PREPARAÇÃO',
    'Método → Prompt Builder',
    'Prompt Pack → Business',
    'Business → Gestão Fácil',
    'não bundles',
  ];

  for (const token of required) {
    if (!combined.includes(token)) errors.push(`conteúdo obrigatório ausente: ${token}`);
  }

  if (!page.includes('noindex,nofollow')) errors.push('primeiros-passos.html deve permanecer noindex,nofollow');
  if (!page.includes('products/jpn-pro-kit.html')) errors.push('link relativo do Pro Kit ausente');
  if (!page.includes('casos-de-uso.html')) errors.push('link para casos de uso ausente');

  const structuralForbidden = [
    /R\$\s*\d/i,
    /href=["']https?:\/\//i,
    /<form\b/i,
    /<input\b/i,
    /compre agora/i,
    /últimas vagas/i,
  ];
  for (const pattern of structuralForbidden) {
    if (pattern.test(combined)) errors.push(`padrão comercial proibido encontrado: ${pattern}`);
  }

  for (const [label, pattern] of [
    ['checkout acionável', /\bcheckout\b/i],
    ['garantia de resultado', /\bgarantia de resultado\b/i],
  ]) {
    const positiveUse = findPositiveUse(text, pattern);
    if (positiveUse) errors.push(`${label} encontrado em contexto positivo: ${positiveUse}`);
  }

  if (!/gasto, publicação, compra, contratação ou aceite legal/i.test(doc)) {
    errors.push('regra de parada para compromissos externos ausente no guia');
  }
}

if (errors.length) {
  console.error('Falhas no onboarding comercial JPN:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Commercial onboarding check OK.');
