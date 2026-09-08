import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assetRoots = ['assets/covers', 'assets/social'];
const manifestPath = path.join(root, 'dist/visual-review/manifest.json');
const galleryPath = path.join(root, 'dist/visual-review/index.html');

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const fail = (message) => {
  console.error(`Visual review gallery integrity: FAIL - ${message}`);
  process.exit(1);
};

const expectedPaths = [];
for (const relativeDir of assetRoots) {
  const entries = (await readdir(path.join(root, relativeDir)))
    .filter((name) => name.endsWith('.svg'))
    .sort();
  for (const name of entries) expectedPaths.push(`${relativeDir}/${name}`);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const gallery = await readFile(galleryPath, 'utf8');

if (manifest.schema_version !== 1) fail('schema_version deve ser 1');
if (manifest.visual_review !== 'pending-human-inspection') fail('revisão visual não pode ser promovida automaticamente');
if (manifest.publication_authorized !== false) fail('publication_authorized deve permanecer false');
if (!Array.isArray(manifest.assets)) fail('assets ausente no manifesto');
if (manifest.total !== expectedPaths.length || manifest.assets.length !== expectedPaths.length) {
  fail(`contagem divergente: esperado ${expectedPaths.length}, manifesto ${manifest.total}`);
}

const manifestPaths = manifest.assets.map((asset) => asset.relativePath);
if (JSON.stringify(manifestPaths) !== JSON.stringify(expectedPaths)) {
  fail('ordem ou inventário de assets diverge das fontes canônicas');
}

const seen = new Set();
const digestRows = [];
for (const asset of manifest.assets) {
  if (seen.has(asset.relativePath)) fail(`asset duplicado: ${asset.relativePath}`);
  seen.add(asset.relativePath);

  const fullPath = path.join(root, asset.relativePath);
  const source = await readFile(fullPath);
  const actualBytes = source.byteLength;
  const actualSha = sha256(source);

  if (asset.bytes !== actualBytes) fail(`bytes divergentes: ${asset.relativePath}`);
  if (asset.sha256 !== actualSha) fail(`SHA-256 divergente: ${asset.relativePath}`);
  if (!asset.width || !asset.height || !asset.viewBox) fail(`metadados geométricos ausentes: ${asset.relativePath}`);
  if (!asset.title) fail(`title ausente: ${asset.relativePath}`);

  const relativeSrc = `../../${asset.relativePath}`;
  if (!gallery.includes(`src="${relativeSrc}"`)) fail(`preview ausente no HTML: ${asset.relativePath}`);
  if (!gallery.includes(`data-source-sha256="${actualSha}"`)) fail(`hash do card ausente: ${asset.relativePath}`);
  if (!gallery.includes(actualSha)) fail(`SHA-256 não exposto na galeria: ${asset.relativePath}`);

  digestRows.push(`${asset.relativePath}\t${actualBytes}\t${actualSha}`);
}

const expectedDigest = sha256(digestRows.join('\n'));
if (manifest.source_state_digest !== expectedDigest) fail('source_state_digest divergente');
if (!gallery.includes(expectedDigest)) fail('source_state_digest não aparece na galeria');

const requiredNotices = [
  'Uso interno.',
  'Esta galeria não autoriza publicação.',
  'Os checkboxes são apenas apoio de inspeção local e não persistem como evidência.',
];
for (const notice of requiredNotices) {
  if (!gallery.includes(notice)) fail(`aviso obrigatório ausente: ${notice}`);
}

const checklistLabels = [
  'sem clipping',
  'texto legível',
  'contraste adequado',
  'margens seguras',
  'estado/claims corretos',
];
for (const label of checklistLabels) {
  const occurrences = gallery.split(label).length - 1;
  if (occurrences !== expectedPaths.length) {
    fail(`checklist "${label}" aparece ${occurrences} vezes; esperado ${expectedPaths.length}`);
  }
}

console.log(`Visual review gallery integrity: PASS (${expectedPaths.length} assets)`);
console.log(`Visual source state digest: ${expectedDigest}`);
