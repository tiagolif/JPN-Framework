import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const dataset = JSON.parse(fs.readFileSync(path.join(root, 'evals/dataset.v1.json'), 'utf8'));
const testCase = dataset.cases[0];
if (!testCase) throw new Error('dataset de avaliação sem casos');

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'jpn-eval-scorer-'));
const datasetCopy = path.join(temp, 'dataset.json');
fs.writeFileSync(datasetCopy, JSON.stringify(dataset, null, 2));

function row(condition) {
  return {
    case_id: testCase.id,
    condition,
    response: `Resposta sintética ${condition} para teste do scorer.`,
    requirement_scores: testCase.requirements.map(() => true),
    acceptance_scores: testCase.acceptance_criteria.map(() => true),
    hallucination_count: 0,
    rework_count: 0,
    human_utility: 4,
    evaluator_notes: 'Fixture sintética; não é evidência de eficácia.'
  };
}

function run(doc, name) {
  const file = path.join(temp, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(doc, null, 2));
  return spawnSync(process.execPath, [path.join(root, 'scripts/score-evals.mjs'), file], { encoding: 'utf8' });
}

const valid = {
  schema_version: '1.0',
  run: { dataset: datasetCopy, model: 'fixture-model', provider: 'fixture-provider' },
  results: [row('baseline'), row('jpn')]
};
const ok = run(valid, 'valid');
if (ok.status !== 0) throw new Error(`scorer rejeitou fixture válida: ${ok.stderr || ok.stdout}`);
const report = JSON.parse(fs.readFileSync(path.join(temp, 'valid.score.json'), 'utf8'));
if (report.paired_cases !== 1 || report.aggregates.baseline.n !== 1 || report.aggregates.jpn.n !== 1) {
  throw new Error('relatório válido não preservou o pareamento esperado');
}
if (!String(report.caveat).includes('não prova causalidade')) throw new Error('caveat obrigatório ausente');

const invalidCases = [
  ['placeholder-model', { ...valid, run: { ...valid.run, model: 'MODEL_NAME_HERE' } }, 'modelo real não registrado'],
  ['empty-response', { ...valid, results: [{ ...row('baseline'), response: ' ' }, row('jpn')] }, 'response vazia'],
  ['duplicate', { ...valid, results: [row('baseline'), row('baseline'), row('jpn')] }, 'resultado duplicado'],
  ['incomplete-pair', { ...valid, results: [row('baseline')] }, 'par incompleto'],
  ['bad-human-score', { ...valid, results: [{ ...row('baseline'), human_utility: 6 }, row('jpn')] }, 'human_utility']
];

for (const [name, doc, expected] of invalidCases) {
  const result = run(doc, name);
  if (result.status === 0) throw new Error(`scorer aceitou fixture inválida: ${name}`);
  const output = `${result.stderr}\n${result.stdout}`;
  if (!output.includes(expected)) throw new Error(`falha ${name} não expôs causa esperada: ${output}`);
}

console.log('Eval scorer contract: OK');
