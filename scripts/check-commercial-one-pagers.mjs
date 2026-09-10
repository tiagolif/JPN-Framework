import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'docs', 'commercial', 'PRODUCT_ONE_PAGERS_v1.md');
const errors = [];

if (!fs.existsSync(file)) {
  console.error('Gate de one-pagers falhou: docs/commercial/PRODUCT_ONE_PAGERS_v1.md ausente.');
  process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');

const requiredMarkers = [
  '# JPN — Product One-Pagers v1',
  'Status: material comercial interno, candidato e não publicado.',
  'OP-01 — Método JPN',
  'OP-02 — JPN Prompt Pack',
  'OP-03 — JPN Business',
  'OP-04 — JPN Prompt Builder',
  'OP-05 — JPN Gestão Fácil',
  'OP-06 — JPN Pro Kit',
  '18 templates canônicos',
  '12 playbooks empresariais',
  'QA físico contextual em celular continua pendente',
  'GF-QA-10 continua pendente',
  'não autorização automática de compra',
  '`EM PREPARAÇÃO`',
  'Matriz rápida de encaminhamento',
  'candidate internal one-pagers / commercial and visual QA pending',
];

for (const marker of requiredMarkers) {
  if (!content.includes(marker)) errors.push(`PRODUCT_ONE_PAGERS_v1.md perdeu marcador obrigatório: ${marker}`);
}

const ids = [...content.matchAll(/^## (OP-\d{2}) —/gmu)].map((match) => match[1]);
const expectedIds = Array.from({ length: 6 }, (_, i) => `OP-${String(i + 1).padStart(2, '0')}`);

if (ids.length !== 6) errors.push(`Esperados 6 one-pagers; encontrados ${ids.length}.`);
for (const id of expectedIds) {
  if (!ids.includes(id)) errors.push(`One-pager obrigatório ausente: ${id}.`);
}

const requiredSections = [
  '### Em uma frase',
  '### Para quem pode fazer sentido',
  '### Problema que organiza',
  '### O que entrega',
  '### Limite real',
  '### Próximo passo informativo',
];

for (const id of expectedIds) {
  const start = content.indexOf(`## ${id} —`);
  const next = ids.indexOf(id) < ids.length - 1 ? content.indexOf(`## ${ids[ids.indexOf(id) + 1]} —`) : content.indexOf('## Matriz rápida de encaminhamento');
  const section = content.slice(start, next);
  for (const heading of requiredSections) {
    if (!section.includes(heading)) errors.push(`${id} não contém seção obrigatória: ${heading}.`);
  }
}

const blocked = [
  /\bR\$\s*\d/iu,
  /https?:\/\//iu,
  /\bcompre\s+agora\b/iu,
  /\bcheckout\b/iu,
  /\bpix\b/iu,
  /cart[aã]o\s+de\s+cr[eé]dito/iu,
  /\bgarante?\s+(?:resultado|vendas?|faturamento|roi)\b/iu,
  /\búltimas?\s+(?:vagas?|unidades?)\b/iu,
];

for (const pattern of blocked) {
  if (pattern.test(content)) errors.push(`Padrão comercial/transacional bloqueado encontrado: ${pattern}.`);
}

if (!/menor recurso suficiente/iu.test(content)) {
  errors.push('Regra do menor recurso suficiente ausente.');
}

if (errors.length) {
  console.error('Gate de one-pagers comerciais falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Gate de one-pagers comerciais aprovado: 6 fichas, estados e guardrails verificados.');
