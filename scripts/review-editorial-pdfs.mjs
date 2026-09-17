import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { basename, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const candidatesRoot = join(root, 'dist', 'editorial-pdf-candidates');
const reviewRoot = join(root, 'dist', 'editorial-pdf-review');
const manifestPath = join(candidatesRoot, 'CANDIDATE_MANIFEST.json');

function fail(message) { throw new Error(`[review-editorial-pdfs] ${message}`); }
function commandExists(command) {
  const probe = spawnSync(command, ['-v'], { stdio: 'ignore' });
  return !probe.error && probe.status === 0;
}
function escapeHtml(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }

let manifest;
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); }
catch { fail('CANDIDATE_MANIFEST.json ausente/inválido; execute npm run export:editorial-pdfs antes.'); }
if (manifest.status !== 'internal-pdf-candidates-visual-review-pending' || !Array.isArray(manifest.products) || manifest.products.length !== 5) fail('manifesto de candidatos inválido.');
if (!commandExists('pdftoppm')) fail('pdftoppm (Poppler) não encontrado. A revisão deve renderizar localmente os PDFs reais; nenhuma aprovação será simulada.');

await rm(reviewRoot, { recursive: true, force: true });
await mkdir(join(reviewRoot, 'pages'), { recursive: true });
const rendered = [];

for (const product of manifest.products) {
  const pdfPath = join(root, product.output);
  const productPagesDir = join(reviewRoot, 'pages', product.id);
  await mkdir(productPagesDir, { recursive: true });
  const prefix = join(productPagesDir, 'page');
  const run = spawnSync('pdftoppm', ['-png', '-r', '120', pdfPath, prefix], { cwd: root, encoding: 'utf8', timeout: 120000 });
  if (run.error || run.status !== 0) fail(`${product.id}: falha ao renderizar: ${(run.stderr || run.error?.message || '').trim()}`);

  const pages = [];
  for (let page = 1; ; page += 1) {
    const candidates = [join(productPagesDir, `page-${page}.png`), join(productPagesDir, `page-${String(page).padStart(2,'0')}.png`), join(productPagesDir, `page-${String(page).padStart(3,'0')}.png`)];
    let found = null;
    for (const p of candidates) { try { await stat(p); found = p; break; } catch {} }
    if (!found) break;
    const info = await stat(found);
    pages.push({ page, file: `pages/${product.id}/${basename(found)}`, bytes: info.size });
  }
  if (!pages.length) fail(`${product.id}: nenhuma página PNG produzida.`);
  rendered.push({
    id: product.id, sourcePdf: product.output, candidateSha256: product.sha256,
    declaredPages: null, renderedPages: pages.length, pageCountMatches: null, pages,
    status: 'rendered-for-human-review-not-approved',
  });
}

const report = {
  generatedAt: new Date().toISOString(), status: 'rendered-for-human-review-not-approved',
  release_ready: false, publication_authorized: false, products: rendered,
};
await writeFile(join(reviewRoot, 'RENDER_REPORT.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');

const cards = rendered.flatMap((product) => product.pages.map((page) => {
  const hash = manifest.products.find((p) => p.id === product.id)?.sha256 || '';
  return `<article><h2>${escapeHtml(product.id)} — página ${page.page}</h2><p><code>${escapeHtml(hash)}</code></p><img src="${escapeHtml(page.file)}" alt="${escapeHtml(product.id)} — página ${page.page}"></article>`;
})).join('\n');
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>JPN — revisão editorial PDF</title><style>body{font-family:Arial,sans-serif;max-width:1100px;margin:32px auto;padding:0 20px;background:#eef2f4;color:#13202b}header,article{background:white;padding:20px;margin:0 0 24px;border-radius:8px}img{display:block;max-width:100%;height:auto;margin:auto;border:1px solid #ccd5db}code{overflow-wrap:anywhere}</style></head><body><header><h1>JPN — revisão editorial PDF</h1><p><strong>evidência de renderização, não aprovação automática</strong>. Inspecione cada página e confirme o hash do candidato. release_ready=false · publication_authorized=false.</p></header>${cards}</body></html>`;
await writeFile(join(reviewRoot, 'index.html'), html, 'utf8');
console.log(`Revisão editorial renderizada: ${rendered.length} documentos. Estado preservado: revisão humana pendente.`);
