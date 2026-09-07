import { access, mkdir, readFile, rm, stat, writeFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(process.cwd());
const candidatesRoot = join(root, 'dist', 'editorial-pdf-candidates');
const outputRoot = join(root, 'dist', 'editorial-pdf-review');
const pagesRoot = join(outputRoot, 'pages');

function commandExists(command) {
  const result = spawnSync(command, ['-h'], { encoding: 'utf8', timeout: 8000 });
  return !result.error && (result.status === 0 || result.status === 1);
}

function runOrThrow(command, args, timeout = 120000) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    timeout,
    env: { ...process.env },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error([`Falha ao executar ${command}.`, result.stdout, result.stderr].filter(Boolean).join('\n'));
  }
  return result;
}

async function ensureCandidates() {
  try {
    await access(join(candidatesRoot, 'CANDIDATE_MANIFEST.json'), constants.R_OK);
  } catch {
    runOrThrow(process.execPath, ['scripts/export-editorial-pdf-candidates.mjs']);
  }
}

function detectRenderer() {
  if (commandExists('pdftoppm')) return { kind: 'pdftoppm', command: 'pdftoppm' };
  if (commandExists('mutool')) return { kind: 'mutool', command: 'mutool' };
  throw new Error('Nenhum renderizador de páginas encontrado. Disponibilize pdftoppm (Poppler) ou mutool (MuPDF).');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function renderPdf(renderer, pdfPath, destinationDir) {
  await mkdir(destinationDir, { recursive: true });
  if (renderer.kind === 'pdftoppm') {
    runOrThrow(renderer.command, ['-png', '-r', '144', pdfPath, join(destinationDir, 'page')]);
  } else {
    runOrThrow(renderer.command, ['draw', '-r', '144', '-o', join(destinationDir, 'page-%03d.png'), pdfPath]);
  }

  const files = (await readdir(destinationDir))
    .filter((name) => extname(name).toLowerCase() === '.png')
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
  if (!files.length) throw new Error(`Nenhuma página renderizada para ${basename(pdfPath)}.`);

  const pages = [];
  for (const [index, name] of files.entries()) {
    const path = join(destinationDir, name);
    const info = await stat(path);
    if (info.size < 1024) throw new Error(`${name} parece pequeno demais (${info.size} bytes).`);
    pages.push({
      page: index + 1,
      file: relative(outputRoot, path).replaceAll('\\', '/'),
      bytes: info.size,
    });
  }
  return pages;
}

await ensureCandidates();
await rm(outputRoot, { recursive: true, force: true });
await mkdir(pagesRoot, { recursive: true });

const renderer = detectRenderer();
const candidateManifest = JSON.parse(await readFile(join(candidatesRoot, 'CANDIDATE_MANIFEST.json'), 'utf8'));
const rendered = [];

for (const product of candidateManifest.products) {
  const pdfPath = join(root, product.output);
  await access(pdfPath, constants.R_OK);
  const destinationDir = join(pagesRoot, product.id);
  const pages = await renderPdf(renderer, pdfPath, destinationDir);
  rendered.push({
    id: product.id,
    sourcePdf: product.output,
    candidateSha256: product.sha256,
    declaredPages: product.pages,
    renderedPages: pages.length,
    pageCountMatches: product.pages == null ? null : product.pages === pages.length,
    pages,
    status: 'rendered-for-human-review-not-approved',
  });
}

const problems = rendered.filter((item) => item.pageCountMatches === false);
if (problems.length) {
  throw new Error(`Divergência entre páginas declaradas e renderizadas em: ${problems.map((item) => item.id).join(', ')}`);
}

const sections = rendered.map((item) => {
  const cards = item.pages.map((page) => `
      <article class="page-card">
        <img src="${escapeHtml(page.file)}" alt="${escapeHtml(item.id)} — página ${page.page}" loading="lazy" />
        <div class="page-meta"><strong>Página ${page.page}</strong><span>${page.bytes.toLocaleString('pt-BR')} bytes</span></div>
        <label><input type="checkbox" /> capa/diagramação</label>
        <label><input type="checkbox" /> sem clipping</label>
        <label><input type="checkbox" /> acentos/fontes</label>
        <label><input type="checkbox" /> tabelas/código/links</label>
        <label><input type="checkbox" /> sem página vazia indevida</label>
      </article>`).join('\n');
  return `
  <section>
    <h2>${escapeHtml(item.id)}</h2>
    <p><code>${escapeHtml(item.sourcePdf)}</code> · SHA-256 candidato <code>${escapeHtml(item.candidateSha256)}</code> · ${item.renderedPages} página(s)</p>
    <div class="pages">${cards}</div>
  </section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>JPN — Revisão de PDFs editoriais</title>
<style>
:root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; background:#06121c; color:#f4f8fb; }
body { margin:0; padding:32px; }
header, section { max-width:1500px; margin:0 auto 42px; }
h1 { margin-bottom:8px; } p { color:#b8c7d1; } code { color:#8de3d7; }
.pages { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:22px; align-items:start; }
.page-card { background:#0b1f33; border:1px solid #18344d; border-radius:14px; padding:14px; box-shadow:0 10px 30px rgba(0,0,0,.18); }
.page-card img { width:100%; height:auto; display:block; background:white; border-radius:8px; }
.page-meta { display:flex; justify-content:space-between; gap:12px; padding:12px 0 8px; color:#d9e5ed; }
label { display:block; margin:7px 0; color:#b8c7d1; font-size:14px; }
.notice { border-left:4px solid #f2c94c; padding:12px 16px; background:#142436; }
</style>
</head>
<body>
<header>
  <h1>JPN — Revisão de PDFs editoriais</h1>
  <p class="notice">Esta galeria é evidência de renderização, não aprovação automática. Marque a revisão página a página somente após inspeção humana real.</p>
  <p>Renderizador: <code>${escapeHtml(renderer.command)}</code>. Produtos: ${rendered.length}. Páginas renderizadas: ${rendered.reduce((sum, item) => sum + item.renderedPages, 0)}.</p>
</header>
${sections}
</body>
</html>`;

const report = {
  generatedAt: new Date().toISOString(),
  status: 'rendered-for-human-review-not-approved',
  renderer,
  sourceManifest: 'dist/editorial-pdf-candidates/CANDIDATE_MANIFEST.json',
  rules: [
    'Renderização não equivale a aprovação visual.',
    'Todos os PDFs precisam ser inspecionados página a página em escala normal e reduzida.',
    'Qualquer correção exige nova exportação, nova renderização e nova revisão.',
    'Hashes candidatos não são hashes finais do Pro Kit.',
  ],
  products: rendered,
};

await writeFile(join(outputRoot, 'index.html'), html, 'utf8');
await writeFile(join(outputRoot, 'RENDER_REPORT.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');

console.log(`Galeria de revisão criada em ${join(outputRoot, 'index.html')}`);
console.log(`Produtos: ${rendered.length}; páginas: ${rendered.reduce((sum, item) => sum + item.renderedPages, 0)}`);
