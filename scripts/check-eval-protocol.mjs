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

// Check semantic anchors that are intentionally present in the protocol instead of
// coupling this gate to one editorial sentence. The dedicated blind-review file
// carries the stricter blinding procedure contract below.
requireText(readme, ['baseline', 'jpn', 'humana cega', 'não resultados comparativos'], 'evals/README.md');
requireText(blind, ['cego', 'baseline', 'jpn'], 'BLIND_REVIEW_PROTOCOL_v1.md');
// Protect the actual evidence-reporting policy: limitations must be reviewed and
// one complete round must not be promoted to general efficacy. Do not require a
// specific technical term (for example, "causal") when the policy states the
// same guardrail explicitly in Portuguese.
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

// Keep the tracked results file unmistakably a template without coupling the
// contract to the English words "placeholder" or "example". The canonical
// template intentionally carries unresolved model/provider sentinels, empty
// responses and no human utility score until a real run is performed.
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

console.log(`Evaluation protocol contract OK: ${cases.length} dataset cases; blind-review and evidence-reporting guardrails present.`);
