import { readFile } from 'node:fs/promises';

const indexPath = new URL('../docs/products/prompt-pack/PROMPT_INDEX.json', import.meta.url);
const packPath = new URL('../docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md', import.meta.url);
const qaPath = new URL('../docs/products/prompt-pack/QA_CASES_v1.md', import.meta.url);
const quickReferencePath = new URL('../docs/products/prompt-pack/JPN_PROMPT_PACK_QUICK_REFERENCE_v1.md', import.meta.url);

const [indexRaw, pack, qa, quickReference] = await Promise.all([
  readFile(indexPath, 'utf8'),
  readFile(packPath, 'utf8'),
  readFile(qaPath, 'utf8'),
  readFile(quickReferencePath, 'utf8'),
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
  if (pattern.test(quickReference)) failures.push(`claim proibido encontrado na referência rápida: ${pattern}`);
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

const quickReferenceRequired = [
  '# JPN Prompt Pack — Referência Rápida Operacional v1',
  'candidate companion / editorial and visual QA pending',
  'Fonte canônica: `JPN_PROMPT_PACK_v1.md` + `PROMPT_INDEX.json`',
  '## Como usar em 60 segundos',
  '## Mapa dos 18 templates',
  '## Roteamento por área',
  '## Combinações úteis',
  '## Regra de parada',
  '## Checklist antes de executar qualquer template',
  '## Checklist depois da resposta',
  '## Limites desta referência',
];
for (const required of quickReferenceRequired) {
  if (!quickReference.includes(required)) failures.push(`referência rápida sem seção/estado obrigatório: ${required}`);
}

for (const template of templates) {
  if (!quickReference.includes(`| ${template.id} | ${template.name} |`)) {
    failures.push(`referência rápida não preserva ${template.id} — ${template.name}`);
  }
}

const expectedRoutingAreas = [
  '### Estruturação e decisão',
  '### Pesquisa, documentação e continuidade',
  '### Comunicação, vendas e atendimento',
  '### Operações',
  '### Dados e tecnologia',
];
for (const area of expectedRoutingAreas) {
  if (!quickReference.includes(area)) failures.push(`área de roteamento ausente: ${area}`);
}

const stopRuleSignals = [
  'preço, estoque, desconto, prazo, condição comercial ou disponibilidade não confirmados',
  'ação externa irreversível, publicação, envio, compra, exclusão, aceite legal ou mudança de conta sem autorização explícita',
  'conflito entre fontes que altere a conclusão',
  'requisito, arquitetura, dado ou comportamento técnico que esteja sendo apenas presumido',
];
for (const signal of stopRuleSignals) {
  if (!quickReference.includes(signal)) failures.push(`regra de parada incompleta: ${signal}`);
}

const checklistSignals = [
  'O objetivo está explícito?',
  'O contexto confirmado foi separado de inferências?',
  'Critérios de aceitação estão claros?',
  'Não há preço, dado, prazo, fonte, resultado ou condição inventados?',
  'Fatos, inferências, conflitos e desconhecidos continuam distinguíveis?',
];
for (const signal of checklistSignals) {
  if (!quickReference.includes(signal)) failures.push(`checklist operacional incompleto: ${signal}`);
}

if (!quickReference.includes('não substitui o `JPN_PROMPT_PACK_v1.md`')) {
  failures.push('referência rápida precisa declarar que não substitui o documento canônico');
}
if (!quickReference.includes('não autoriza publicação ou venda')) {
  failures.push('referência rápida precisa preservar bloqueio de publicação/venda');
}

if (failures.length) {
  console.error('Falha no gate de QA editorial do JPN Prompt Pack:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`JPN Prompt Pack QA: consistente (${expectedCases.length}/${expectedCases.length} casos fictícios, 18 templates indexados e referência rápida validada).`);
