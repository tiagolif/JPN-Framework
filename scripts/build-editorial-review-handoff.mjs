import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const scopePath = join(root, 'docs', 'product-system', 'EDITORIAL_REVIEW_SCOPE_v1.json');
const releasePath = join(root, 'docs', 'product-system', 'PRODUCT_RELEASE_STATUS_v1.json');
const renderReportPath = join(root, 'dist', 'editorial-pdf-review', 'RENDER_REPORT.json');
const outputMarkdownPath = join(root, 'dist', 'editorial-pdf-review', 'EDITORIAL_HUMAN_REVIEW_PACKET.md');
const outputStatePath = join(root, 'dist', 'editorial-pdf-review', 'EDITORIAL_HUMAN_REVIEW_STATE.json');
const checkOnly = process.argv.includes('--check');

function fail(message) {
  throw new Error(`[editorial-review-handoff] ${message}`);
}

async function readJson(path, label) {
  try {
    await access(path, constants.R_OK);
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    fail(`${label} ausente, ilegível ou inválido: ${error.message}`);
  }
}

async function mustExist(relativePath, label) {
  const path = join(root, relativePath);
  try {
    await access(path, constants.R_OK);
  } catch {
    fail(`${label} ausente ou ilegível: ${relativePath}`);
  }
}

function assertExact(actual, expected, label) {
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(`${label} deve ser exatamente [${expected.join(', ')}]; encontrou [${actual.join(', ')}].`);
  }
}

const scope = await readJson(scopePath, 'EDITORIAL_REVIEW_SCOPE_v1.json');
const release = await readJson(releasePath, 'PRODUCT_RELEASE_STATUS_v1.json');

if (scope.status !== 'human-review-scope-only') fail(`status de escopo inesperado: ${scope.status}`);
if (scope.release_effect !== 'none') fail('release_effect precisa permanecer none.');
if (scope.publication_authorized !== false) fail('publication_authorized precisa permanecer false.');

const expectedProductIds = ['metodo-jpn', 'jpn-prompt-pack'];
const expectedDependencies = ['revisao-editorial-humana', 'pdf-final'];
const expectedChecklist = [
  'hierarquia-e-diagramacao',
  'sem-clipping-ou-overflow',
  'acentuacao-e-fontes',
  'tabelas-codigo-e-urls',
  'sem-paginas-vazias-indevidas',
  'legibilidade-normal-e-reduzida',
  'coerencia-com-fonte-canonica',
];

if (!Array.isArray(scope.products)) fail('scope.products precisa ser array.');
if (!Array.isArray(scope.checklist)) fail('scope.checklist precisa ser array.');
assertExact(scope.products.map((product) => product.id), expectedProductIds, 'ordem dos produtos');
assertExact(scope.checklist, expectedChecklist, 'checklist editorial');

const releaseById = new Map(release.products.map((product) => [product.id, product]));
for (const product of scope.products) {
  assertExact(product.release_dependencies, expectedDependencies, `${product.id}.release_dependencies`);
  await mustExist(product.source, `${product.id}.source`);
  await mustExist(product.audit, `${product.id}.audit`);

  const canonical = releaseById.get(product.id);
  if (!canonical) fail(`produto ${product.id} ausente do contrato canônico de release.`);
  const canonicalDeps = canonical.dependencies.map((dependency) => dependency.id);
  assertExact(canonicalDeps, expectedDependencies, `${product.id} dependências canônicas`);

  for (const dependency of canonical.dependencies) {
    if (!['pending', 'in-progress', 'blocked'].includes(dependency.status)) {
      fail(`${product.id}/${dependency.id} está em ${dependency.status}; este handoff só é válido enquanto a revisão final permanece aberta.`);
    }
  }
}

if (checkOnly) {
  console.log('Handoff editorial: CHECK PASS');
  console.log(`- produtos: ${expectedProductIds.join(', ')}`);
  console.log(`- checklist por página: ${expectedChecklist.length} itens`);
  console.log('- estado preservado: revisão humana e PDF final continuam abertos');
  console.log('- release_effect: none; publication_authorized: false');
  process.exit(0);
}

const renderReport = await readJson(renderReportPath, 'RENDER_REPORT.json');
if (renderReport.status !== 'rendered-for-human-review-not-approved') {
  fail(`RENDER_REPORT possui status inesperado: ${renderReport.status}`);
}
if (!Array.isArray(renderReport.products)) fail('RENDER_REPORT.products precisa ser array.');

const renderedById = new Map(renderReport.products.map((product) => [product.id, product]));
const handoffProducts = [];
for (const product of scope.products) {
  const rendered = renderedById.get(product.id);
  if (!rendered) fail(`${product.id} não aparece no RENDER_REPORT.`);
  if (rendered.status !== 'rendered-for-human-review-not-approved') {
    fail(`${product.id} possui estado de renderização inesperado: ${rendered.status}`);
  }
  if (!Array.isArray(rendered.pages) || rendered.pages.length === 0) {
    fail(`${product.id} não possui páginas renderizadas.`);
  }
  if (rendered.renderedPages !== rendered.pages.length) {
    fail(`${product.id}: renderedPages diverge do array pages.`);
  }
  if (rendered.pageCountMatches === false) {
    fail(`${product.id}: contagem de páginas do candidato e renderização divergem.`);
  }

  handoffProducts.push({
    id: product.id,
    title: product.title,
    source: product.source,
    audit: product.audit,
    sourcePdf: rendered.sourcePdf,
    candidateSha256: rendered.candidateSha256,
    renderedPages: rendered.pages.length,
    status: 'human-editorial-review-pending',
    releaseDependencies: product.release_dependencies.map((id) => ({ id, status: 'PENDING' })),
    pages: rendered.pages.map((page) => ({
      page: page.page,
      preview: page.file,
      previewBytes: page.bytes,
      status: 'PENDING',
      checks: Object.fromEntries(scope.checklist.map((check) => [check, 'PENDING'])),
      evidence: null,
      reviewer: null,
      reviewedAt: null,
      notes: null,
    })),
  });
}

const totalPages = handoffProducts.reduce((sum, product) => sum + product.renderedPages, 0);
const state = {
  generatedAt: new Date().toISOString(),
  status: 'editorial-human-review-packet-ready-all-items-pending',
  release_effect: 'none',
  publication_authorized: false,
  sourceScope: 'docs/product-system/EDITORIAL_REVIEW_SCOPE_v1.json',
  sourceRenderReport: 'dist/editorial-pdf-review/RENDER_REPORT.json',
  totals: {
    products: handoffProducts.length,
    pages: totalPages,
    pageChecks: totalPages * scope.checklist.length,
    passed: 0,
    failed: 0,
    pending: totalPages * scope.checklist.length,
  },
  rules: [
    'Gerar este pacote não aprova revisão editorial nem PDF final.',
    'Toda página e todo check começam PENDING.',
    'Uma alteração na fonte ou no candidato invalida a revisão anterior do documento afetado.',
    'candidateSha256 identifica somente o candidato revisado; não é hash final de release.',
    'Publicação, venda, anúncio e checkout permanecem não autorizados por este artefato.',
  ],
  products: handoffProducts,
};

const lines = [
  '# JPN — Pacote de revisão editorial humana',
  '',
  '> Estado: `editorial-human-review-packet-ready-all-items-pending`. Este documento organiza a inspeção; não aprova conteúdo, PDF, release ou publicação.',
  '',
  `Produtos no escopo: **${handoffProducts.length}** · páginas renderizadas: **${totalPages}** · verificações de página: **${state.totals.pageChecks}**, todas **PENDING**.`,
  '',
  '## Regra de execução',
  '',
  'Compare cada preview com a fonte Markdown canônica. Registre resultado, evidência, revisor, data e observações somente após inspeção humana real. Se a fonte ou o PDF candidato mudar, descarte a revisão anterior do documento afetado e regenere este pacote.',
  '',
];

for (const product of handoffProducts) {
  lines.push(`## ${product.title}`);
  lines.push('');
  lines.push(`- Fonte canônica: \`${product.source}\``);
  lines.push(`- Auditoria de referência: \`${product.audit}\``);
  lines.push(`- PDF candidato: \`${product.sourcePdf}\``);
  lines.push(`- SHA-256 candidato: \`${product.candidateSha256}\``);
  lines.push(`- Páginas renderizadas: ${product.renderedPages}`);
  lines.push('- Dependências de release: `revisao-editorial-humana=PENDING`, `pdf-final=PENDING`');
  lines.push('');

  for (const page of product.pages) {
    lines.push(`### Página ${page.page}`);
    lines.push('');
    lines.push(`Preview: \`${page.preview}\``);
    lines.push('');
    for (const check of scope.checklist) lines.push(`- [ ] ${check} — **PENDING**`);
    lines.push('- Resultado da página: `PENDING`');
    lines.push('- Evidência:');
    lines.push('- Revisor:');
    lines.push('- Data:');
    lines.push('- Observações:');
    lines.push('');
  }
}

lines.push('## Critério de saída');
lines.push('');
lines.push('Este pacote só pode servir como evidência de revisão quando todas as páginas tiverem inspeção registrada e qualquer correção tiver sido reexportada, rerenderizada e reinspecionada. A promoção de `revisao-editorial-humana` e `pdf-final` continua sendo uma ação separada, baseada em evidência verificável.');
lines.push('');

await mkdir(dirname(outputMarkdownPath), { recursive: true });
await writeFile(outputMarkdownPath, lines.join('\n'), 'utf8');
await writeFile(outputStatePath, JSON.stringify(state, null, 2) + '\n', 'utf8');

console.log('Pacote de revisão editorial humana gerado.');
console.log(`- produtos: ${handoffProducts.length}`);
console.log(`- páginas: ${totalPages}`);
console.log(`- verificações pendentes: ${state.totals.pending}`);
console.log('- revisão humana: ainda obrigatória');
console.log('- release_effect: none; publication_authorized: false');
