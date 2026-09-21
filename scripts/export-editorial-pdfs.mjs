import { createHash } from 'node:crypto';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(process.cwd());
const stagingRoot = join(root, 'dist', 'editorial-print-staging');
const outRoot = join(root, 'dist', 'editorial-pdf-candidates');
const stagingManifestPath = join(stagingRoot, 'manifest.json');

function fail(message) { throw new Error(`[export-editorial-pdfs] ${message}`); }
function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function commandExists(command) {
  const probe = spawnSync(command, ['--version'], { stdio: 'ignore' });
  return !probe.error && probe.status === 0;
}

async function mustRead(path) {
  try { await access(path, constants.R_OK); return await readFile(path); }
  catch { fail(`arquivo obrigatório ausente ou ilegível: ${path}`); }
}

const manifest = JSON.parse((await mustRead(stagingManifestPath)).toString('utf8'));
if (manifest.status !== 'internal-print-staging' || !Array.isArray(manifest.products) || manifest.products.length !== 5) {
  fail('manifesto do staging editorial inválido; execute npm run build:editorial-print antes.');
}

const engines = [
  ['chromium', 'chromium'],
  ['chromium-browser', 'chromium-browser'],
  ['google-chrome', 'google-chrome'],
  ['google-chrome-stable', 'google-chrome-stable'],
];
const selected = engines.find(([, command]) => commandExists(command));
if (!selected) fail('nenhum Chromium/Chrome headless encontrado. Instale/use um motor PDF local e execute novamente; nenhum serviço externo é chamado.');
const [engine, command] = selected;

await rm(outRoot, { recursive: true, force: true });
await mkdir(outRoot, { recursive: true });
const products = [];

for (const product of manifest.products) {
  const htmlPath = join(root, product.output);
  await access(htmlPath, constants.R_OK).catch(() => fail(`HTML de staging ausente: ${product.output}`));
  const output = `dist/editorial-pdf-candidates/${product.id}.pdf`;
  const pdfPath = join(root, output);
  await mkdir(dirname(pdfPath), { recursive: true });
  const args = [
    '--headless', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf-no-header',
    `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href,
  ];
  const run = spawnSync(command, args, { cwd: root, encoding: 'utf8', timeout: 120000 });
  if (run.error || run.status !== 0) fail(`${product.id}: falha no motor ${engine}: ${(run.stderr || run.error?.message || '').trim()}`);
  const bytes = await mustRead(pdfPath);
  if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') fail(`${basename(pdfPath)} não possui assinatura PDF válida.`);
  const info = await stat(pdfPath);
  products.push({
    id: product.id, title: product.title, version: product.version, sourceHtml: product.output,
    output, bytes: info.size, sha256: sha256(bytes), engine,
    status: 'internal-pdf-candidate-visual-review-pending',
  });
}

const candidateManifest = {
  generatedAt: new Date().toISOString(),
  status: 'internal-pdf-candidates-visual-review-pending',
  engine,
  release_ready: false,
  publication_authorized: false,
  products,
};
await writeFile(join(outRoot, 'CANDIDATE_MANIFEST.json'), JSON.stringify(candidateManifest, null, 2) + '\n', 'utf8');
console.log(`PDFs editoriais candidatos gerados localmente: ${products.length} (${engine}). Revisão humana continua obrigatória.`);
