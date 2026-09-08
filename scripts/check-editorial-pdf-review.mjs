import { createHash } from 'node:crypto';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const candidatesRoot = join(root, 'dist', 'editorial-pdf-candidates');
const reviewRoot = join(root, 'dist', 'editorial-pdf-review');
const candidateManifestPath = join(candidatesRoot, 'CANDIDATE_MANIFEST.json');
const renderReportPath = join(reviewRoot, 'RENDER_REPORT.json');
const reviewIndexPath = join(reviewRoot, 'index.html');

const expectedIds = [
  'metodo-jpn',
  'jpn-prompt-pack',
  'jpn-business',
  'gestao-facil-manual',
  'pro-kit-leia-primeiro',
];

function fail(message) {
  throw new Error(`[editorial-pdf-review] ${message}`);
}

async function mustRead(path) {
  try {
    await access(path, constants.R_OK);
    return await readFile(path);
  } catch {
    fail(`arquivo obrigatório ausente ou ilegível: ${path}`);
  }
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function assertExactIds(items, label) {
  const ids = items.map((item) => item.id);
  if (ids.length !== expectedIds.length) {
    fail(`${label} deve conter exatamente ${expectedIds.length} documentos; encontrou ${ids.length}.`);
  }
  if (new Set(ids).size !== ids.length) fail(`${label} contém IDs duplicados.`);
  if (ids.join('|') !== expectedIds.join('|')) {
    fail(`${label} está fora da ordem canônica: ${ids.join(', ')}.`);
  }
}

const candidateManifest = JSON.parse((await mustRead(candidateManifestPath)).toString('utf8'));
const renderReport = JSON.parse((await mustRead(renderReportPath)).toString('utf8'));
const reviewIndex = (await mustRead(reviewIndexPath)).toString('utf8');

if (candidateManifest.status !== 'internal-pdf-candidates-visual-review-pending') {
  fail(`status inesperado no manifesto de candidatos: ${candidateManifest.status}`);
}
if (renderReport.status !== 'rendered-for-human-review-not-approved') {
  fail(`status inesperado no relatório de renderização: ${renderReport.status}`);
}
if (!Array.isArray(candidateManifest.products) || !Array.isArray(renderReport.products)) {
  fail('manifestos precisam declarar products como arrays.');
}
assertExactIds(candidateManifest.products, 'CANDIDATE_MANIFEST.json');
assertExactIds(renderReport.products, 'RENDER_REPORT.json');

const candidateById = new Map(candidateManifest.products.map((item) => [item.id, item]));
let totalPages = 0;
const digestParts = [];

for (const rendered of renderReport.products) {
  const candidate = candidateById.get(rendered.id);
  if (!candidate) fail(`candidato ausente para ${rendered.id}.`);
  if (rendered.status !== 'rendered-for-human-review-not-approved') {
    fail(`${rendered.id} foi promovido para estado inesperado: ${rendered.status}`);
  }
  if (rendered.sourcePdf !== candidate.output) {
    fail(`${rendered.id}: sourcePdf diverge do output do candidato.`);
  }
  if (rendered.candidateSha256 !== candidate.sha256) {
    fail(`${rendered.id}: SHA-256 registrado na renderização diverge do candidato.`);
  }

  const pdfPath = join(root, candidate.output);
  const pdfBytes = await mustRead(pdfPath);
  if (pdfBytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
    fail(`${basename(pdfPath)} não possui assinatura PDF válida.`);
  }
  const pdfInfo = await stat(pdfPath);
  if (pdfInfo.size !== candidate.bytes) {
    fail(`${rendered.id}: bytes do PDF divergentes (${pdfInfo.size} != ${candidate.bytes}).`);
  }
  const actualPdfSha = sha256(pdfBytes);
  if (actualPdfSha !== candidate.sha256) {
    fail(`${rendered.id}: hash real do PDF diverge do manifesto.`);
  }

  if (!Array.isArray(rendered.pages) || rendered.pages.length === 0) {
    fail(`${rendered.id}: nenhuma página renderizada.`);
  }
  if (rendered.renderedPages !== rendered.pages.length) {
    fail(`${rendered.id}: renderedPages não corresponde ao array pages.`);
  }
  if (rendered.declaredPages != null && rendered.declaredPages !== rendered.pages.length) {
    fail(`${rendered.id}: número de páginas declarado e renderizado diverge.`);
  }
  if (rendered.pageCountMatches === false) {
    fail(`${rendered.id}: pageCountMatches=false.`);
  }

  for (const [index, page] of rendered.pages.entries()) {
    if (page.page !== index + 1) fail(`${rendered.id}: numeração de páginas fora de sequência.`);
    const pagePath = join(reviewRoot, page.file);
    const pageInfo = await stat(pagePath).catch(() => null);
    if (!pageInfo) fail(`${rendered.id}: página ausente: ${page.file}.`);
    if (extname(page.file).toLowerCase() !== '.png') fail(`${rendered.id}: preview não é PNG: ${page.file}.`);
    if (pageInfo.size !== page.bytes) fail(`${rendered.id}: bytes divergentes em ${page.file}.`);
    if (pageInfo.size < 1024) fail(`${rendered.id}: preview pequeno demais em ${page.file}.`);
    digestParts.push(`${rendered.id}:${page.page}:${page.file}:${pageInfo.size}`);
  }

  if (!reviewIndex.includes(candidate.sha256)) fail(`${rendered.id}: hash do candidato não aparece na galeria HTML.`);
  if (!reviewIndex.includes(`${rendered.id} — página 1`)) fail(`${rendered.id}: primeira página não aparece na galeria HTML.`);
  totalPages += rendered.pages.length;
  digestParts.push(`${rendered.id}:${candidate.output}:${candidate.sha256}:${candidate.bytes}:${rendered.pages.length}`);
}

const pngFiles = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extname(entry.name).toLowerCase() === '.png') pngFiles.push(path);
  }
}
await walk(join(reviewRoot, 'pages'));
if (pngFiles.length !== totalPages) {
  fail(`quantidade física de previews (${pngFiles.length}) diverge das páginas declaradas (${totalPages}).`);
}

const forbiddenApprovalSignals = [
  'publication_authorized: true',
  'visual_qa: approved',
  'status: approved',
  'release_ready: true',
];
for (const signal of forbiddenApprovalSignals) {
  if (reviewIndex.toLowerCase().includes(signal.toLowerCase())) {
    fail(`a galeria contém sinal proibido de promoção automática: ${signal}`);
  }
}

if (!reviewIndex.includes('evidência de renderização, não aprovação automática')) {
  fail('a galeria perdeu o aviso de que renderização não equivale a aprovação.');
}

const sourceStateDigest = sha256(Buffer.from(digestParts.join('\n'), 'utf8'));
console.log(`Integridade da revisão editorial PDF: PASS`);
console.log(`- documentos: ${expectedIds.length}`);
console.log(`- páginas renderizadas: ${totalPages}`);
console.log(`- source_state_digest: ${sourceStateDigest}`);
console.log('- estado preservado: revisão humana pendente; publicação não autorizada');
