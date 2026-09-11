import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scopePath = path.join(root, 'docs/products/prompt-builder/HUMAN_QA_SCOPE_v1.json');
const releasePath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const outDir = path.join(root, 'dist/prompt-builder-human-qa');
const checkOnly = process.argv.includes('--check');

function fail(message) {
  console.error(`[prompt-builder-human-qa] ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`Arquivo ausente: ${path.relative(root, file)}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const scope = readJson(scopePath);
const release = readJson(releasePath);

if (scope.product_id !== 'jpn-prompt-builder') fail('product_id inesperado.');
if (scope.status !== 'human-qa-handoff-prep-only') fail('status deve permanecer em preparação de handoff.');
if (scope.release_effect !== 'none') fail('release_effect deve permanecer none.');
if (scope.publication_authorized !== false) fail('publication_authorized deve permanecer false.');

const product = release.products?.find((item) => item.id === scope.product_id);
if (!product) fail('Produto não encontrado no contrato canônico de release.');
const dependency = product.dependencies?.find((item) => item.id === scope.release_dependency?.id);
if (!dependency) fail('Dependência física/contextual não encontrada no contrato canônico.');
if (dependency.status !== scope.release_dependency.required_status) {
  fail(`Dependência ${dependency.id} está ${dependency.status}; o handoff exige ${scope.release_dependency.required_status}.`);
}

for (const source of scope.source_documents ?? []) {
  if (!fs.existsSync(path.join(root, source))) fail(`Fonte de QA ausente: ${source}`);
}

const tracks = scope.tracks ?? [];
if (tracks.length !== 2) fail('São esperadas exatamente duas trilhas de QA humano.');
const checks = tracks.flatMap((track) => track.checks ?? []);
if (checks.length !== 14) fail(`São esperados 14 checks; encontrados ${checks.length}.`);
const ids = checks.map((check) => check.id);
if (new Set(ids).size !== ids.length) fail('IDs de checks duplicados.');
if (checks.some((check) => check.status !== 'PENDING')) fail('Todos os checks devem nascer PENDING.');

const expectedMobile = ['PB-HQA-M01','PB-HQA-M02','PB-HQA-M03','PB-HQA-M04','PB-HQA-M05','PB-HQA-M06'];
const expectedAssistive = ['PB-HQA-A01','PB-HQA-A02','PB-HQA-A03','PB-HQA-A04','PB-HQA-A05','PB-HQA-A06','PB-HQA-A07','PB-HQA-A08'];
for (const id of [...expectedMobile, ...expectedAssistive]) {
  if (!ids.includes(id)) fail(`Check obrigatório ausente: ${id}`);
}

const summary = scope.summary ?? {};
if (summary.total_checks !== 14 || summary.passed !== 0 || summary.failed !== 0 || summary.pending !== 14) {
  fail('Resumo inicial deve ser 14 total, 0 passed, 0 failed, 14 pending.');
}

if (checkOnly) {
  console.log('[prompt-builder-human-qa] PASS estrutural; revisão humana continua obrigatória.');
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
const state = {
  version: scope.version,
  product_id: scope.product_id,
  state: 'human-qa-packet-ready-all-items-pending',
  release_effect: 'none',
  publication_authorized: false,
  canonical_dependency: {
    id: dependency.id,
    status: dependency.status,
    evidence: dependency.evidence ?? null
  },
  totals: { total: 14, passed: 0, failed: 0, pending: 14 },
  tracks: tracks.map((track) => ({
    id: track.id,
    title: track.title,
    source: track.source,
    checks: track.checks.map((check) => ({
      ...check,
      evidence: null,
      reviewer: null,
      reviewed_at: null,
      notes: null
    }))
  }))
};
fs.writeFileSync(path.join(outDir, 'human-qa-state.json'), `${JSON.stringify(state, null, 2)}\n`);

const lines = [
  '# JPN Prompt Builder — pacote de QA humano',
  '',
  '> Estado inicial: todos os itens PENDING. Este pacote não aprova release, acessibilidade, compatibilidade assistiva ou experiência móvel.',
  '',
  `Dependência canônica: \`${dependency.id}\` = \`${dependency.status}\`.`,
  ''
];
for (const track of tracks) {
  lines.push(`## ${track.title}`, '', `Fonte: \`${track.source}\``, '');
  for (const check of track.checks) {
    lines.push(
      `### ${check.id} — ${check.label}`,
      '',
      `- Resultado: \`PENDING\``,
      '- Evidência:',
      '- Revisor:',
      '- Data:',
      '- Observações:',
      ''
    );
  }
}
lines.push(
  '## Regra de promoção',
  '',
  'Somente evidência humana registrada pode justificar alteração deliberada dos itens. A atualização do contrato canônico de release é uma ação separada e não é executada por este script.',
  ''
);
fs.writeFileSync(path.join(outDir, 'HUMAN_QA_PACKET.md'), `${lines.join('\n')}\n`);
console.log('[prompt-builder-human-qa] Pacote gerado com 14 itens PENDING.');
