import { readFile } from 'node:fs/promises';

const docPath = new URL('../docs/products/jpn-business/30_DAY_OUTCOME_REVIEW_v1.md', import.meta.url);
const logPath = new URL('../docs/products/jpn-business/30_DAY_OUTCOME_REVIEW_LOG_v1.csv', import.meta.url);

const [doc, log] = await Promise.all([
  readFile(docPath, 'utf8'),
  readFile(logPath, 'utf8'),
]);

const failures = [];

for (let i = 1; i <= 10; i += 1) {
  const id = `R30-${String(i).padStart(2, '0')}`;
  if (!doc.includes(id)) failures.push(`seção ausente: ${id}`);
}

for (const state of ['confirmed', 'inferred', 'unknown', 'conflicting']) {
  if (!doc.includes(state)) failures.push(`estado de confiança ausente: ${state}`);
}

for (const decision of ['MANTER', 'AJUSTAR', 'PAUSAR', 'DESCARTAR_NESTE_CASO']) {
  if (!doc.includes(decision)) failures.push(`decisão ausente: ${decision}`);
}

for (const marker of ['12 playbooks canônicos', 'JB-01..JB-12', 'GF-QA-10', 'SEM_EVIDENCIA']) {
  if (!doc.includes(marker)) failures.push(`marcador obrigatório ausente: ${marker}`);
}

const expectedHeader = 'review_id,cycle_label,problem_initial,component_or_playbook,used,evidence_summary,confidence,clarity,consistency,rework,time_perceived,decision,next_cycle_step,status';
const [header, ...rows] = log.trim().split(/\r?\n/);
if (header !== expectedHeader) failures.push('cabeçalho inesperado no log de 30 dias');
if (rows.length !== 1) failures.push(`log candidato deve conter exatamente 1 linha fictícia; encontrado: ${rows.length}`);
if (!rows[0]?.includes('R30-EXAMPLE-01')) failures.push('linha fictícia R30-EXAMPLE-01 ausente');
if (!rows[0]?.endsWith(',PENDING')) failures.push('linha fictícia deve permanecer PENDING');

const forbiddenPatterns = [
  /release_ready\s*[:=]\s*true/i,
  /GF-QA-10.{0,40}(PASSED|APROVADO|CONCLUIDO)/i,
  /\b(api[_ -]?key|access[_ -]?token|private[_ -]?key|senha real)\b/i,
  /\b(lucro|receita|faturamento|ticket médio)\s*[:=]\s*R\$/i,
  /https?:\/\/(?!example\.com)/i,
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(`${doc}\n${log}`)) failures.push(`padrão proibido encontrado: ${pattern}`);
}

if (!doc.includes('não exige dados financeiros reais')) failures.push('guardrail de dados financeiros reais ausente');
if (!doc.includes('não autoriza novas ações externas')) failures.push('guardrail de ação externa ausente');

if (failures.length) {
  console.error('Falha no gate da revisão de resultado em 30 dias do JPN Business:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('JPN Business 30-day outcome review: consistente (R30-01..R30-10, 1 exemplo fictício PENDING).');
