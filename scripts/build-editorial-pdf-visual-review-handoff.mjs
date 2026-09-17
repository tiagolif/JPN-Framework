import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const reviewRoot = join(root, 'dist', 'editorial-pdf-review');
const candidateManifestPath = join(root, 'dist', 'editorial-pdf-candidates', 'CANDIDATE_MANIFEST.json');
const renderReportPath = join(reviewRoot, 'RENDER_REPORT.json');
const outputPath = join(reviewRoot, 'PDF_VISUAL_HUMAN_REVIEW_PACKET.md');
const statePath = join(reviewRoot, 'PDF_VISUAL_HUMAN_REVIEW_STATE.json');

const expectedIds = ['metodo-jpn', 'jpn-prompt-pack', 'jpn-business', 'gestao-facil-manual', 'pro-kit-leia-primeiro'];
const checks = ['hierarquia-e-diagramacao', 'sem-clipping-ou-overflow', 'acentuacao-e-fontes', 'tabelas-codigo-e-urls', 'sem-paginas-vazias-indevidas', 'legibilidade-normal-e-reduzida', 'coerencia-com-fonte-canonica'];

function fail(message) { throw new Error(`[editorial-pdf-visual-handoff] ${message}`); }
async function readJson(path, label) {
  try { await access(path, constants.R_OK); return JSON.parse(await readFile(path, 'utf8')); }
  catch (error) { fail(`${label} ausente, ilegível ou inválido: ${error.message}`); }
}
function assertIds(items, label) {
  const ids = items.map((item) => item.id);
  if (ids.join('|') !== expectedIds.join('|')) fail(`${label} precisa manter a ordem canônica dos cinco produtos.`);
}

const candidates = await readJson(candidateManifestPath, 'CANDIDATE_MANIFEST.json');
const rendered = await readJson(renderReportPath, 'RENDER_REPORT.json');
if (candidates.status !== 'internal-pdf-candidates-visual-review-pending') fail('status de candidatos inesperado.');
if (rendered.status !== 'rendered-for-human-review-not-approved') fail('status de renderização inesperado.');
if (candidates.release_ready !== false || candidates.publication_authorized !== false) fail('guardrails dos candidatos foram promovidos indevidamente.');
assertIds(candidates.products, 'manifesto de candidatos');
assertIds(rendered.products, 'relatório de renderização');

const candidateById = new Map(candidates.products.map((item) => [item.id, item]));
const products = rendered.products.map((product) => {
  const candidate = candidateById.get(product.id);
  if (!candidate || candidate.sha256 !== product.candidateSha256) fail(`${product.id}: hash do candidato diverge da renderização.`);
  if (!Array.isArray(product.pages) || product.pages.length === 0 || product.renderedPages !== product.pages.length) fail(`${product.id}: páginas renderizadas inválidas.`);
  if (product.pageCountMatches === false) fail(`${product.id}: contagem de páginas divergente.`);
  return {
    id: product.id,
    title: candidate.title,
    sourceHtml: candidate.sourceHtml,
    sourcePdf: candidate.output,
    candidateSha256: candidate.sha256,
    pages: product.pages.map((page) => ({ page: page.page, preview: page.file, status: 'PENDING_HUMAN', checks: Object.fromEntries(checks.map((check) => [check, 'PENDING_HUMAN'])), evidence: null, reviewer: null, reviewedAt: null, notes: null })),
    status: 'PENDING_HUMAN',
  };
});

const totalPages = products.reduce((sum, product) => sum + product.pages.length, 0);
const state = {
  generatedAt: new Date().toISOString(),
  status: 'pdf-visual-human-review-packet-ready-all-items-pending',
  release_ready: false,
  publication_authorized: false,
  products,
  totals: { products: products.length, pages: totalPages, checks: totalPages * checks.length, passed: 0, failed: 0, pending: totalPages * checks.length },
  rules: ['Este pacote organiza revisão humana; não aprova PDF, release ou publicação.', 'Toda página e todo critério começam PENDING_HUMAN.', 'Mudança no SHA-256 do PDF candidato invalida a revisão anterior do documento.', 'Aprovação visual não autoriza publicação, anúncio, venda ou checkout.'],
};

const lines = ['# JPN — Handoff visual dos PDFs candidatos', '', '> Estado: `PENDING_HUMAN`. Este pacote cobre os cinco PDFs candidatos e não autoriza release ou publicação.', '', `Produtos: **${products.length}** · páginas: **${totalPages}** · verificações: **${state.totals.checks}**, todas pendentes.`, '', 'Compare cada preview com seu HTML de origem. Registre evidência somente após inspeção humana real. Se o SHA-256 do candidato mudar, descarte a revisão anterior do documento afetado.', ''];
for (const product of products) {
  lines.push(`## ${product.title || product.id}`, '', `- Origem: \`${product.sourceHtml}\``, `- PDF candidato: \`${product.sourcePdf}\``, `- SHA-256: \`${product.candidateSha256}\``, `- Estado: \`${product.status}\``, '');
  for (const page of product.pages) {
    lines.push(`### Página ${page.page}`, '', `Preview: \`${page.preview}\``, '');
    for (const check of checks) lines.push(`- [ ] ${check} — **PENDING_HUMAN**`);
    lines.push('- Resultado: `PENDING_HUMAN`', '- Evidência:', '- Revisor:', '- Data:', '- Observações:', '');
  }
}
lines.push('## Critério de saída', '', 'Somente uma inspeção humana real pode alterar os estados acima. Correções exigem nova exportação, nova renderização e nova inspeção do PDF afetado. A autorização de publicação permanece uma decisão separada.', '');

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, lines.join('\n'), 'utf8');
await writeFile(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
console.log(`Handoff visual dos PDFs preparado: ${products.length} produtos, ${totalPages} páginas, ${state.totals.pending} verificações PENDING_HUMAN.`);
console.log('release_ready=false; publication_authorized=false');
