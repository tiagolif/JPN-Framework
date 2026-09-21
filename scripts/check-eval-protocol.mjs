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

requireText(readme, ['baseline', 'jpn', 'humana cega', 'não resultados comparativos'], 'evals/README.md');
requireText(blind, ['cego', 'baseline', 'jpn'], 'BLIND_REVIEW_PROTOCOL_v1.md');
requireText(reporting, ['limita', 'não significa eficácia geral comprovada', 'linguagem proibida sem evidência adicional'], 'EVIDENCE_REPORTING_v1.md');

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

// The tracked example is the canonical result-shape template. It must cover every
// dataset case in both conditions so a future real run cannot silently omit a
// difficult case while still satisfying the scorer contract.
const run = example?.run ?? {};
const results = Array.isArray(example?.results) ? example.results : [];
const hasTemplateSentinels =
  typeof run.model === 'string' && /_HERE$/i.test(run.model) &&
  typeof run.provider === 'string' && /_HERE$/i.test(run.provider);
const hasUnfilledResults =
  results.length > 0 &&
  results.every((result) => result.response === '' && result.human_utility == null);
if (!hasTemplateSentinels || !hasUnfilledResults) {
  throw new Error('results.example.json must remain visibly non-production/template data');
}

const expectedPairs = new Set(cases.flatMap((item) => [
  `${item.id}:baseline`,
  `${item.id}:jpn`,
]));
const actualPairs = results.map((result) => `${result.case_id}:${result.condition}`);
if (actualPairs.length !== expectedPairs.size || new Set(actualPairs).size !== actualPairs.length) {
  throw new Error('results.example.json must contain exactly one baseline and one JPN row per dataset case');
}
for (const pair of actualPairs) {
  if (!expectedPairs.has(pair)) throw new Error(`Unexpected evaluation result row: ${pair}`);
}
for (const pair of expectedPairs) {
  if (!actualPairs.includes(pair)) throw new Error(`Missing evaluation result template row: ${pair}`);
}

const caseById = new Map(cases.map((item) => [item.id, item]));
for (const result of results) {
  const item = caseById.get(result.case_id);
  if (!Array.isArray(result.requirement_scores) || result.requirement_scores.length !== item.requirements.length) {
    throw new Error(`Requirement score shape mismatch for ${result.case_id}:${result.condition}`);
  }
  if (!Array.isArray(result.acceptance_scores) || result.acceptance_scores.length !== item.acceptance_criteria.length) {
    throw new Error(`Acceptance score shape mismatch for ${result.case_id}:${result.condition}`);
  }
}

console.log(`Evaluation protocol contract OK: ${cases.length} dataset cases; ${results.length} complete template rows; blind-review and evidence-reporting guardrails present.`);
