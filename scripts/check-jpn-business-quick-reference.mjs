import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const indexPath = join(root, 'docs/products/jpn-business/BUSINESS_INDEX.json');
const referencePath = join(root, 'docs/products/jpn-business/JPN_BUSINESS_QUICK_REFERENCE_v1.md');

function fail(message) {
  console.error(`JPN Business quick reference: ${message}`);
  process.exitCode = 1;
}

const [indexRaw, reference] = await Promise.all([
  readFile(indexPath, 'utf8'),
  readFile(referencePath, 'utf8'),
]);

const index = JSON.parse(indexRaw);
const playbooks = index.playbooks ?? [];
const errors = [];

if (playbooks.length !== 12) errors.push(`BUSINESS_INDEX.json deveria conter 12 playbooks; encontrados ${playbooks.length}`);

const canonicalIds = Array.from({ length: 12 }, (_, i) => `JB-${String(i + 1).padStart(2, '0')}`);
const actualIds = playbooks.map((item) => item.id);
if (JSON.stringify(actualIds) !== JSON.stringify(canonicalIds)) {
  errors.push('ordem canônica JB-01..JB-12 diverge no índice');
}

for (const playbook of playbooks) {
  const canonicalLabel = `${playbook.id} — ${playbook.name}`;
  if (!reference.includes(canonicalLabel)) errors.push(`${playbook.id}: nome canônico ausente na referência rápida`);

  const links = playbook.prompt_pack_links ?? [];
  if (!Array.isArray(links) || links.length === 0) {
    errors.push(`${playbook.id}: sem prompt_pack_links no índice`);
    continue;
  }
  for (const link of links) {
    if (!reference.includes(`\`${link}\``)) errors.push(`${playbook.id}: vínculo ${link} não aparece na referência rápida`);
  }
}

const requiredSections = [
  '## Como usar em 60 segundos',
  '## Roteamento por situação',
  '## Mapa por área',
  '## Atalhos de combinação',
  '## Regra de parada',
  '## Checklist antes de concluir um playbook',
  '## Estado deste material',
];
for (const section of requiredSections) {
  if (!reference.includes(section)) errors.push(`seção obrigatória ausente: ${section}`);
}

const requiredAreas = ['Comercial', 'Atendimento', 'Operações', 'Marketing', 'Gestão', 'Conhecimento'];
for (const area of requiredAreas) {
  if (!reference.includes(`### ${area}`)) errors.push(`área obrigatória ausente: ${area}`);
}

const requiredGuardrails = [
  'Nenhuma condição comercial foi inventada',
  'publicação',
  'anúncio',
  'compra',
  'contratação',
  'dado pessoal',
  'candidate companion / editorial and visual QA pending',
];
for (const token of requiredGuardrails) {
  if (!reference.toLowerCase().includes(token.toLowerCase())) errors.push(`guardrail/estado ausente: ${token}`);
}

const forbiddenClaims = [
  /garante\s+(resultado|vendas|roi)/i,
  /100%\s+privad[oa]/i,
  /sem\s+erros/i,
  /elimina\s+alucina[cç][aã]o/i,
  /substitui\s+(especialista|revis[aã]o humana)/i,
];
for (const pattern of forbiddenClaims) {
  if (pattern.test(reference)) errors.push(`claim proibido detectado: ${pattern}`);
}

if (errors.length) {
  for (const error of errors) fail(error);
  process.exit();
}

console.log('JPN Business quick reference OK: 12 playbooks canônicos, vínculos PP-*, roteamento, combinações e guardrails presentes; QA editorial/visual continua pendente.');
