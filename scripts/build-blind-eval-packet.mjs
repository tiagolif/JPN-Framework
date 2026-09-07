import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [, , resultsArg = 'evals/results.example.json', datasetArg = 'evals/dataset.v1.json'] = process.argv;
const salt = process.env.JPN_EVAL_BLIND_SALT;

if (!salt || salt.trim().length < 8) {
  console.error('Defina JPN_EVAL_BLIND_SALT com pelo menos 8 caracteres antes de gerar um pacote cego.');
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'run';
}

function decideSwap(caseId) {
  const digest = crypto.createHash('sha256').update(`${salt}:${caseId}`).digest();
  return (digest[0] & 1) === 1;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const results = readJson(resultsArg);
const dataset = readJson(datasetArg);
assert(Array.isArray(results.results), 'Arquivo de resultados sem array results.');
assert(Array.isArray(dataset.cases), 'Dataset sem array cases.');

const datasetById = new Map(dataset.cases.map((item) => [item.id, item]));
const grouped = new Map();
for (const item of results.results) {
  assert(item.case_id, 'Resultado sem case_id.');
  assert(item.condition === 'baseline' || item.condition === 'jpn', `Condição inválida em ${item.case_id}.`);
  assert(typeof item.response === 'string' && item.response.trim(), `Resposta vazia em ${item.case_id}/${item.condition}.`);
  if (!grouped.has(item.case_id)) grouped.set(item.case_id, {});
  const pair = grouped.get(item.case_id);
  assert(!pair[item.condition], `Condição duplicada em ${item.case_id}/${item.condition}.`);
  pair[item.condition] = item;
}

assert(grouped.size > 0, 'Nenhum par de respostas disponível para revisão.');

const packetCases = [];
const keyCases = [];
for (const [caseId, pair] of grouped.entries()) {
  assert(pair.baseline && pair.jpn, `Par incompleto em ${caseId}: baseline e jpn são obrigatórios.`);
  const spec = datasetById.get(caseId);
  assert(spec, `Caso ${caseId} não existe no dataset.`);

  const swap = decideSwap(caseId);
  const mapping = swap
    ? { A: 'jpn', B: 'baseline' }
    : { A: 'baseline', B: 'jpn' };

  packetCases.push({
    case_id: caseId,
    domain: spec.domain,
    context: spec.context,
    evidence: spec.evidence,
    requirements: spec.requirements,
    acceptance_criteria: spec.acceptance_criteria,
    forbidden_claims: spec.forbidden_claims,
    responses: {
      A: pair[mapping.A].response,
      B: pair[mapping.B].response
    },
    review: {
      A: { human_utility: null, evaluator_notes: '' },
      B: { human_utility: null, evaluator_notes: '' }
    }
  });

  keyCases.push({ case_id: caseId, A: mapping.A, B: mapping.B });
}

const sourceFingerprint = crypto
  .createHash('sha256')
  .update(JSON.stringify({ dataset, results }))
  .digest('hex');
const runName = safeName(`${results.run?.provider || 'provider'}-${results.run?.model || 'model'}`);
const outDir = path.resolve('dist/evals', runName);
fs.mkdirSync(outDir, { recursive: true });

const packet = {
  schema_version: '1.0',
  status: 'blind-review-pending',
  source_fingerprint_sha256: sourceFingerprint,
  instructions: {
    scale: '1 a 5',
    rule: 'Avalie A e B sem tentar inferir qual condição produziu a resposta.',
    anchors: {
      '1': 'inútil ou inadequada para a tarefa',
      '3': 'parcialmente útil, mas exige correções relevantes',
      '5': 'útil e aceitável com pouco ou nenhum retrabalho'
    }
  },
  cases: packetCases
};

const key = {
  schema_version: '1.0',
  status: 'confidential-condition-key',
  source_fingerprint_sha256: sourceFingerprint,
  warning: 'Não disponibilizar este arquivo ao avaliador antes de concluir as notas cegas.',
  cases: keyCases
};

const packetPath = path.join(outDir, 'BLIND_REVIEW_PACKET.json');
const keyPath = path.join(outDir, 'BLIND_CONDITION_KEY.json');
fs.writeFileSync(packetPath, `${JSON.stringify(packet, null, 2)}\n`);
fs.writeFileSync(keyPath, `${JSON.stringify(key, null, 2)}\n`);

console.log(`Pacote cego criado: ${packetPath}`);
console.log(`Chave de condições criada separadamente: ${keyPath}`);
console.log(`Casos preparados: ${packetCases.length}`);
console.log('Status: blind-review-pending (nenhum resultado de eficácia foi inferido).');
