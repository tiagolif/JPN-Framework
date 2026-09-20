import fs from 'node:fs';

const requiredFiles = [
  'evals/README.md',
  'evals/dataset.v1.json',
  'evals/results.example.json',
  'evals/BLIND_REVIEW_PROTOCOL_v1.md',
  'evals/EVIDENCE_REPORTING_v1.md',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) throw new Error(`Evaluation protocol missing required file: ${file}`);
}

const readme = fs.readFileSync('evals/README.md', 'utf8');
const blind = fs.readFileSync('evals/BLIND_REVIEW_PROTOCOL_v1.md', 'utf8');
const reporting = fs.readFileSync('evals/EVIDENCE_REPORTING_v1.md', 'utf8');
const dataset = JSON.parse(fs.readFileSync('evals/dataset.v1.json', 'utf8'));
const example = JSON.parse(fs.readFileSync('evals/results.example.json', 'utf8'));

const requireText = (text, needles, label) => {
  for (const needle of needles) {
    if (!text.toLowerCase().includes(needle.toLowerCase())) {
      throw new Error(`${label} must mention: ${needle}`);
    }
  }
};

requireText(readme, ['baseline', 'jpn', 'avaliação humana cega', 'não resultados comparativos'], 'evals/README.md');
requireText(blind, ['cego', 'baseline', 'jpn'], 'BLIND_REVIEW_PROTOCOL_v1.md');
requireText(reporting, ['limita', 'causal'], 'EVIDENCE_REPORTING_v1.md');

const cases = Array.isArray(dataset) ? dataset : dataset.cases;
if (!Array.isArray(cases) || cases.length < 4) {
  throw new Error('dataset.v1.json must contain at least four auditable cases');
}
const ids = cases.map((item) => item.id);
if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
  throw new Error('dataset.v1.json case ids must be present and unique');
}
for (const item of cases) {
  const serialized = JSON.stringify(item).toLowerCase();
  if (!serialized.includes('baseline') || !serialized.includes('jpn')) {
    throw new Error(`Dataset case ${item.id} must define both baseline and JPN conditions`);
  }
}

const exampleText = JSON.stringify(example).toLowerCase();
if (!exampleText.includes('placeholder') && !exampleText.includes('example')) {
  throw new Error('results.example.json must remain visibly non-production/example data');
}

console.log(`Evaluation protocol contract OK: ${cases.length} dataset cases; blind-review and evidence-reporting guardrails present.`);
