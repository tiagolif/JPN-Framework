import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const runbookPath = 'docs/product-system/RELEASE_RUNBOOK_v1.md';
const packagePath = 'package.json';
const statusPath = 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json';
const planPath = 'docs/product-system/RELEASE_EXECUTION_PLAN_v1.json';
const editorialPdfCheckerPath = 'scripts/check-editorial-pdf-review.mjs';

const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const readJson = (p) => JSON.parse(readText(p));
const assert = (condition, message) => {
  if (!condition) throw new Error(`[release-runbook] ${message}`);
};

const runbook = readText(runbookPath);
const pkg = readJson(packagePath);
const status = readJson(statusPath);
const plan = readJson(planPath);

assert(runbook.includes('Status: **interno / não autoriza publicação**'), 'status interno/sem publicação ausente.');
assert(runbook.includes('Freeze vem antes dos hashes finais'), 'regra freeze → hashes finais ausente.');
assert(runbook.includes('CI precisa estar associado ao SHA que será congelado'), 'regra de CI/SHA ausente.');
assert(fs.existsSync(path.join(root, editorialPdfCheckerPath)), 'verificador editorial PDF obrigatório ausente.');
assert(runbook.includes(`node ${editorialPdfCheckerPath}`), 'runbook não referencia diretamente o verificador editorial PDF existente.');

for (const heading of [
  '## Fase 0 — Consistência local',
  '## Fase 1 — Candidatos editoriais',
  '## Fase 2 — Inspeção editorial e visual',
  '## Fase 3 — JPN Prompt Builder',
  '## Fase 4 — JPN Gestão Fácil',
  '## Fase 5 — JPN Pro Kit',
  '## Fase 6 — Freeze e hashes finais',
  '## Fase 7 — CI do SHA definitivo',
  '## Fase 8 — Atualização de status',
]) {
  assert(runbook.includes(heading), `fase obrigatória ausente: ${heading}`);
}

const commands = [
  'build',
  'build:editorial-print',
  'check:editorial-print-staging',
  'export:editorial-pdfs',
  'review:editorial-pdfs',
  'check:prompt-builder-staging',
  'stage:prompt-builder',
  'check:pro-kit',
  'check:pro-kit-manifest',
  'stage:pro-kit',
  'check:pro-kit-staging',
  'check:product-release-status',
  'check:release-execution-plan',
  'check:product-readiness-report',
  'report:release-readiness',
];

for (const command of commands) {
  assert(pkg.scripts?.[command], `script npm obrigatório ausente: ${command}`);
  assert(runbook.includes(`npm run ${command}`), `runbook não referencia npm run ${command}.`);
}

const dependencies = status.products.flatMap((product) =>
  product.dependencies.map((dependency) => `${product.id}::${dependency.id}`),
);
const planned = plan.items.map((item) => `${item.product_id}::${item.dependency_id}`);
assert(dependencies.length === planned.length, 'quantidade de dependências diverge entre status e plano.');
for (const key of dependencies) {
  assert(planned.includes(key), `dependência sem item correspondente no plano: ${key}`);
}

for (const requiredText of [
  'Microsoft Excel',
  'LibreOffice Calc',
  'Google Sheets',
  'GF-QA-10',
  'SHA-256',
  'servidor HTTP local',
  'mesmo XLSX candidato',
  'mesmo bundle candidato',
]) {
  assert(runbook.includes(requiredText), `evidência/ambiente obrigatório ausente: ${requiredText}`);
}

for (const forbidden of [
  /publicação autorizada:\s*sim/i,
  /venda autorizada:\s*sim/i,
  /comprar agora/i,
  /pagar agora/i,
  /checkout disponível/i,
  /garante resultado/i,
]) {
  assert(!forbidden.test(runbook), `linguagem proibida encontrada: ${forbidden}`);
}

assert(plan.publication_authorized === false, 'plano de execução não pode autorizar publicação.');

console.log(`Release runbook OK: ${commands.length} comandos npm + gate PDF direto, ${dependencies.length} dependências formais preservadas.`);
