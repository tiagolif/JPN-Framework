import { readFile } from 'node:fs/promises';

const indexPath = new URL('../docs/products/prompt-pack/PROMPT_INDEX.json', import.meta.url);
const packPath = new URL('../docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md', import.meta.url);
const qaPath = new URL('../docs/products/prompt-pack/QA_CASES_v1.md', import.meta.url);

const [indexRaw, pack, qa] = await Promise.all([
  readFile(indexPath, 'utf8'),
  readFile(packPath, 'utf8'),
  readFile(qaPath, 'utf8'),
]);

const index = JSON.parse(indexRaw);
const failures = [];
const templates = Array.isArray(index.templates) ? index.templates : [];
const templateIds = new Set(templates.map((item) => item.id));

const expectedCases = [
  ['PP-QA-01', 'PP-01'],
  ['PP-QA-02', 'PP-02'],
  ['PP-QA-03', 'PP-06'],
  ['PP-QA-04', 'PP-07'],
  ['PP-QA-05', 'PP-12'],
  ['PP-QA-06', 'PP-18'],
];

if (index.product !== 'JPN Prompt Pack') failures.push('produto inesperado no PROMPT_INDEX.json');
if (templates.length !== 18) failures.push(`esperados 18 templates, encontrados ${templates.length}`);
if (!qa.includes('Resultado:** 6/6 casos atendem aos critérios editoriais definidos')) {
  failures.push('QA_CASES_v1.md não declara o resultado agregado esperado');
}
if (!qa.includes('não é benchmark de modelo')) failures.push('disclaimer de benchmark ausente');
if (!qa.includes('não sustenta claim de superioridade')) failures.push('disclaimer de claim ausente');
if (!qa.includes('dados totalmente fictícios')) failures.push('declaração de dados fictícios ausente');

for (const [caseId, promptId] of expectedCases) {
  if (!qa.includes(`## ${caseId} `)) failures.push(`${caseId} ausente do QA`);
  if (!qa.includes(`**Prompt:** \`${promptId}\``)) failures.push(`${caseId} não referencia ${promptId}`);
  if (!templateIds.has(promptId)) failures.push(`${promptId} não existe no PROMPT_INDEX.json`);
  if (!pack.includes(promptId.replace('PP-', '# ')) && !pack.includes(index.templates.find((item) => item.id === promptId)?.name ?? '')) {
    failures.push(`${promptId} não pôde ser relacionado ao documento humano do pack`);
  }
}

const passCount = (qa.match(/\*\*Resultado:\*\* `PASS`\./g) || []).length;
if (passCount !== expectedCases.length) {
  failures.push(`esperados ${expectedCases.length} resultados PASS, encontrados ${passCount}`);
}

const forbidden = [
  /resultado garantido/i,
  /aumento garantido/i,
  /redução garantida/i,
  /100% de acerto/i,
  /superioridade comprovada/i,
];
for (const pattern of forbidden) {
  if (pattern.test(qa)) failures.push(`claim proibido encontrado: ${pattern}`);
}

const pendingMarkers = [
  'revisão ortográfica fina: pendente',
  'revisão visual/PDF: pendente',
  'CI do head candidato: pendente',
  'freeze e checksum final: pendentes',
];
for (const marker of pendingMarkers) {
  if (!qa.includes(marker)) failures.push(`pendência obrigatória ausente: ${marker}`);
}

if (failures.length) {
  console.error('Falha no gate de QA editorial do JPN Prompt Pack:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`JPN Prompt Pack QA: consistente (${expectedCases.length}/${expectedCases.length} casos fictícios, 18 templates indexados).`);
