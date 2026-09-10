import { readFile } from 'node:fs/promises';

const indexPath = new URL('../docs/products/prompt-pack/PROMPT_INDEX.json', import.meta.url);
const workbookPath = new URL('../docs/products/prompt-pack/PROMPT_SELECTION_WORKBOOK_v1.md', import.meta.url);

const [indexRaw, workbook] = await Promise.all([
  readFile(indexPath, 'utf8'),
  readFile(workbookPath, 'utf8'),
]);

const index = JSON.parse(indexRaw);
const templates = Array.isArray(index.templates) ? index.templates : [];
const failures = [];

if (index.product !== 'JPN Prompt Pack') failures.push('produto inesperado no índice');
if (templates.length !== 18) failures.push(`esperados 18 templates, encontrados ${templates.length}`);

const requiredSections = [
  '# JPN Prompt Pack — Workbook de Seleção e Adaptação v1',
  'candidate companion / editorial and operational QA pending',
  '## Folha 1 — Classificação da tarefa',
  '## Folha 2 — Mapa de escolha dos 18 templates',
  '## Folha 3 — Teste de aderência',
  '## Folha 4 — Adaptação JPN',
  '### Jornada',
  '### Precisão',
  '### Narrativa',
  '## Folha 5 — Política de confiança',
  '## Folha 6 — Registro do teste',
  '## Folha 7 — Diagnóstico de falha',
  '## Folha 8 — Reutilização responsável',
  '## Combinações mínimas sugeridas',
  '## Regras de parada',
  '## Exercícios fictícios',
  '## Checklist final',
  '## Limites e estado',
];

for (const section of requiredSections) {
  if (!workbook.includes(section)) failures.push(`seção obrigatória ausente: ${section}`);
}

for (const template of templates) {
  if (!workbook.includes(`| ${template.id} | ${template.name} |`)) {
    failures.push(`workbook não preserva ${template.id} — ${template.name}`);
  }
}

for (const state of ['`confirmed`', '`inferred`', '`unknown`', '`conflicting`']) {
  if (!workbook.includes(state)) failures.push(`estado de confiança ausente: ${state}`);
}

for (const exercise of ['EX-PP-01', 'EX-PP-02', 'EX-PP-03', 'EX-PP-04', 'EX-PP-05']) {
  if (!workbook.includes(`### ${exercise}`)) failures.push(`exercício ausente: ${exercise}`);
}

const requiredSignals = [
  'Use o menor template suficiente para a tarefa atual.',
  'Se houver 2 ou mais respostas negativas, reavalie a escolha antes de executar.',
  'Nunca transforme `inferred`, `unknown` ou `conflicting` em `confirmed`',
  'Reutilização não significa execução automática',
  'Não trate essas combinações como fluxo obrigatório, pacote comercial ou promessa de desempenho.',
  'aceite de termos legais ou compromisso em nome de outra pessoa',
  'criação de conta que exija verificação de identidade',
  'dado financeiro real',
  'O QA físico contextual do JPN Prompt Builder em celular continua pendente.',
  '`GF-QA-10` da Gestão Fácil continua pendente',
  '`REPOR` continua sendo apenas alerta operacional',
  'O JPN Pro Kit permanece `EM PREPARAÇÃO`.',
];

for (const signal of requiredSignals) {
  if (!workbook.includes(signal)) failures.push(`guardrail/estado obrigatório ausente: ${signal}`);
}

const forbiddenClaims = [
  /resultado garantido/i,
  /aumento garantido/i,
  /redução garantida/i,
  /100% de acerto/i,
  /superioridade comprovada/i,
  /compatibilidade universal comprovada/i,
];

for (const pattern of forbiddenClaims) {
  if (pattern.test(workbook)) failures.push(`claim proibido encontrado: ${pattern}`);
}

const comboSignals = [
  '`PP-01 → PP-03`',
  '`PP-02 → PP-17`',
  '`PP-07 → PP-06`',
  '`PP-10 → PP-11`',
  '`PP-13 → PP-14 → PP-15`',
  '`PP-16 → PP-18`',
];
for (const signal of comboSignals) {
  if (!workbook.includes(signal)) failures.push(`combinação mínima ausente: ${signal}`);
}

if (!workbook.includes('não substitui `JPN_PROMPT_PACK_v1.md`, `PROMPT_INDEX.json`')) {
  failures.push('workbook precisa preservar fontes canônicas');
}
if (!workbook.includes('Os 18 templates continuam sendo a estrutura canônica do Prompt Pack.')) {
  failures.push('workbook precisa declarar os 18 templates como estrutura canônica');
}

if (failures.length) {
  console.error('Falha no gate do workbook de seleção do JPN Prompt Pack:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('JPN Prompt Pack selection workbook: consistente (18 templates, 8 folhas, 5 exercícios e guardrails validados).');
