import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const builderPath = resolve(root, 'scripts/build-editorial-pdf-visual-review-handoff.mjs');
const packagePath = resolve(root, 'package.json');
const builder = await readFile(builderPath, 'utf8');
const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
const errors = [];

const requireText = (fragment, label) => {
  if (!builder.includes(fragment)) errors.push(`${label}: trecho obrigatório ausente: ${fragment}`);
};

for (const id of ['metodo-jpn', 'jpn-prompt-pack', 'jpn-business', 'gestao-facil-manual', 'pro-kit-leia-primeiro']) {
  requireText(`'${id}'`, `produto ${id}`);
}

for (const check of ['hierarquia-e-diagramacao', 'sem-clipping-ou-overflow', 'acentuacao-e-fontes', 'tabelas-codigo-e-urls', 'sem-paginas-vazias-indevidas', 'legibilidade-normal-e-reduzida', 'coerencia-com-fonte-canonica']) {
  requireText(`'${check}'`, `critério ${check}`);
}

for (const guardrail of [
  "status: 'PENDING_HUMAN'",
  'release_ready: false',
  'publication_authorized: false',
  "passed: 0",
  "failed: 0",
  'Mudança no SHA-256 do PDF candidato invalida a revisão anterior',
  'Aprovação visual não autoriza publicação, anúncio, venda ou checkout.',
]) {
  requireText(guardrail, 'guardrail');
}

for (const integrityRule of [
  "candidate.sha256 !== product.candidateSha256",
  "product.renderedPages !== product.pages.length",
  "product.pageCountMatches === false",
]) {
  requireText(integrityRule, 'integridade');
}

const command = packageJson?.scripts?.['build:editorial-pdf-visual-handoff'];
if (command !== 'node scripts/build-editorial-pdf-visual-review-handoff.mjs') {
  errors.push('package.json: build:editorial-pdf-visual-handoff ausente ou divergente.');
}

if (errors.length) {
  console.error('Editorial PDF visual review handoff check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Editorial PDF visual review handoff check OK: 5 produtos, 7 critérios, vínculo por SHA-256 e guardrails PENDING_HUMAN/release/publicação preservados.');
