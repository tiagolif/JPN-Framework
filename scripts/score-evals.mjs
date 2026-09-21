import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Uso: npm run eval:score -- <arquivo-de-resultados.json>');
  process.exit(1);
}

const absoluteInput = path.resolve(inputPath);
const resultsDoc = JSON.parse(fs.readFileSync(absoluteInput, 'utf8'));
if (resultsDoc.schema_version !== '1.0') throw new Error('schema_version de resultados deve ser 1.0');
if (!resultsDoc.run || typeof resultsDoc.run !== 'object') throw new Error('metadados run ausentes');
if (!resultsDoc.run.model || resultsDoc.run.model === 'MODEL_NAME_HERE') throw new Error('modelo real não registrado');
if (!resultsDoc.run.provider || resultsDoc.run.provider === 'PROVIDER_HERE') throw new Error('provider real não registrado');

const datasetPath = path.resolve(resultsDoc.run.dataset || 'evals/dataset.v1.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const cases = new Map(dataset.cases.map((item) => [item.id, item]));

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}
function fraction(flags) {
  return flags.length ? flags.filter(Boolean).length / flags.length : null;
}

const normalized = [];
const seen = new Set();
for (const row of resultsDoc.results ?? []) {
  const testCase = cases.get(row.case_id);
  if (!testCase) throw new Error(`case_id desconhecido: ${row.case_id}`);
  if (!['baseline', 'jpn'].includes(row.condition)) throw new Error(`condition inválida em ${row.case_id}`);
  const key = `${row.case_id}/${row.condition}`;
  if (seen.has(key)) throw new Error(`resultado duplicado: ${key}`);
  seen.add(key);
  if (typeof row.response !== 'string' || !row.response.trim()) throw new Error(`response vazia em ${key}`);
  if (!Array.isArray(row.requirement_scores) || row.requirement_scores.length !== testCase.requirements.length || row.requirement_scores.some((v) => typeof v !== 'boolean')) throw new Error(`requirement_scores incompatível em ${key}`);
  if (!Array.isArray(row.acceptance_scores) || row.acceptance_scores.length !== testCase.acceptance_criteria.length || row.acceptance_scores.some((v) => typeof v !== 'boolean')) throw new Error(`acceptance_scores incompatível em ${key}`);
  if (!Number.isInteger(row.hallucination_count) || row.hallucination_count < 0) throw new Error(`hallucination_count inválido em ${key}`);
  if (!Number.isInteger(row.rework_count) || row.rework_count < 0) throw new Error(`rework_count inválido em ${key}`);
  if (row.human_utility !== null && (!Number.isInteger(row.human_utility) || row.human_utility < 1 || row.human_utility > 5)) throw new Error(`human_utility deve ser null ou inteiro de 1 a 5 em ${key}`);

  normalized.push({ case_id: row.case_id, condition: row.condition, requirement_coverage: fraction(row.requirement_scores), acceptance_coverage: fraction(row.acceptance_scores), hallucination_count: row.hallucination_count, rework_count: row.rework_count, human_utility: row.human_utility });
}
if (!normalized.length) throw new Error('nenhum resultado registrado');

const evaluatedCaseIds = [...new Set(normalized.map((row) => row.case_id))];
for (const id of evaluatedCaseIds) {
  for (const condition of ['baseline', 'jpn']) {
    if (!seen.has(`${id}/${condition}`)) throw new Error(`par incompleto: ${id} sem ${condition}`);
  }
}

const grouped = {};
for (const condition of ['baseline', 'jpn']) {
  const rows = normalized.filter((row) => row.condition === condition);
  grouped[condition] = {
    n: rows.length,
    requirement_coverage_mean: mean(rows.map((row) => row.requirement_coverage).filter((v) => v !== null)),
    acceptance_coverage_mean: mean(rows.map((row) => row.acceptance_coverage).filter((v) => v !== null)),
    hallucination_count_total: rows.reduce((sum, row) => sum + row.hallucination_count, 0),
    rework_count_total: rows.reduce((sum, row) => sum + row.rework_count, 0),
    human_utility_mean: mean(rows.map((row) => row.human_utility).filter((v) => v !== null)),
  };
}

const report = {
  schema_version: '1.0',
  source: path.relative(process.cwd(), absoluteInput),
  dataset: resultsDoc.run.dataset || 'evals/dataset.v1.json',
  model: resultsDoc.run.model,
  provider: resultsDoc.run.provider,
  paired_cases: evaluatedCaseIds.length,
  aggregates: grouped,
  rows: normalized,
  caveat: 'Este relatório resume avaliações registradas. Ele não prova causalidade nem eficácia geral do JPN.'
};

const outputPath = absoluteInput.replace(/\.json$/i, '.score.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
console.log(`\nRelatório salvo em ${outputPath}`);
