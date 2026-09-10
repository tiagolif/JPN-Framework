import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const guidePath = path.join(root, 'docs/product-system/PRODUCT_FEEDBACK_LOOP_v1.md');
const registerPath = path.join(root, 'docs/product-system/PRODUCT_FEEDBACK_REGISTER_v1.csv');

const guide = await readFile(guidePath, 'utf8');
const register = await readFile(registerPath, 'utf8');
const errors = [];

for (const marker of ['FB-01', 'FB-02', 'FB-03', 'FB-04', 'FB-05', 'FB-06', 'FB-07']) {
  if (!guide.includes(marker)) errors.push(`Fluxo ausente: ${marker}`);
}

for (const product of ['Método JPN', 'JPN Prompt Pack', 'JPN Business', 'JPN Prompt Builder', 'JPN Gestão Fácil', 'JPN Pro Kit']) {
  if (!guide.includes(product)) errors.push(`Produto ausente do loop de feedback: ${product}`);
}

for (const confidence of ['confirmed', 'inferred', 'unknown', 'conflicting']) {
  if (!guide.includes(`\`${confidence}\``)) errors.push(`Estado de confiança ausente: ${confidence}`);
}

for (const category of ['USABILIDADE', 'CONTEUDO', 'PRECISAO', 'FLUXO', 'COMPATIBILIDADE', 'DOCUMENTACAO', 'COMERCIAL', 'ACESSIBILIDADE', 'OUTRO']) {
  if (!guide.includes(`\`${category}\``)) errors.push(`Categoria ausente: ${category}`);
}

for (const recurrence of ['UNICO', 'REPETIDO', 'RECORRENTE', 'DESCONHECIDO']) {
  if (!guide.includes(`\`${recurrence}\``)) errors.push(`Recorrência ausente: ${recurrence}`);
}

for (const impact of ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO']) {
  if (!guide.includes(`\`${impact}\``)) errors.push(`Impacto ausente: ${impact}`);
}

for (const decision of ['OBSERVAR', 'DOCUMENTAR', 'TESTAR', 'CORRIGIR_CANDIDATO', 'NAO_APLICAR', 'BLOQUEADO']) {
  if (!guide.includes(`\`${decision}\``)) errors.push(`Decisão ausente: ${decision}`);
}

for (const phrase of [
  'QA físico contextual em celular continua pendente',
  'GF-QA-10 continua pendente',
  'REPOR` permanece somente alerta operacional',
  'EM PREPARAÇÃO',
  '18 templates',
  '12 playbooks',
]) {
  if (!guide.includes(phrase)) errors.push(`Guardrail/estado ausente: ${phrase}`);
}

const expectedHeader = 'Feedback ID,Produto,Categoria,Descrição sanitizada,Origem,Confiança,Recorrência,Impacto,Evidência,Decisão,Próximo gate,Estado';
if (!register.startsWith(`${expectedHeader}\n`)) errors.push('Cabeçalho do PRODUCT_FEEDBACK_REGISTER_v1.csv divergente.');
if (!register.includes('FB-EX-01')) errors.push('Registro deve manter um único exemplo fictício FB-EX-01.');
if (!register.includes('Exemplo fictício')) errors.push('Exemplo do registro deve permanecer explicitamente fictício.');
if (!register.includes(',PENDING\n')) errors.push('Exemplo do registro deve permanecer PENDING.');

const dataLines = register.trim().split(/\r?\n/).slice(1);
if (dataLines.length !== 1) errors.push(`Registro candidato deve conter apenas 1 linha fictícia; encontrado=${dataLines.length}.`);

const forbidden = [
  /sk-[A-Za-z0-9_-]{12,}/i,
  /AIza[0-9A-Za-z_-]{20,}/,
  /https?:\/\//i,
  /checkout/i,
  /cart[aã]o\s*(de\s*)?cr[eé]dito/i,
  /PIX\s*[:=]\s*\S+/i,
  /release[_ -]?ready\s*[:=]\s*true/i,
];
for (const pattern of forbidden) {
  if (pattern.test(guide) || pattern.test(register)) errors.push(`Padrão proibido detectado: ${pattern}`);
}

if (errors.length) {
  console.error('Product feedback loop check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Product feedback loop check OK: fluxo FB-01..FB-07, registro sanitizado e guardrails verificados.');
