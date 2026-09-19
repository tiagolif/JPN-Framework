import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'docs/commercial/COMMERCIAL_ASSET_MANIFEST_v1.json'), 'utf8'));
const galleryFiles = ['commercial-site/artes.html', 'commercial-site/stories.html'];
const galleries = await Promise.all(galleryFiles.map(async (file) => ({ file, html: await readFile(path.join(root, file), 'utf8') })));
const html = galleries.map(({ html }) => html).join('\n');
const errors = [];
const assets = Array.isArray(manifest.assets) ? manifest.assets : [];

if (manifest.publication_authorized !== false) errors.push('Manifesto de ativos deve manter publication_authorized=false.');

for (const { file, html: galleryHtml } of galleries) {
  if (!/name=["']robots["'][^>]*content=["']noindex,nofollow["']/i.test(galleryHtml) && !/content=["']noindex,nofollow["'][^>]*name=["']robots["']/i.test(galleryHtml)) errors.push(`${file}: deve manter meta robots noindex,nofollow.`);
  if (!/galeria interna|revisão visual|stories/i.test(galleryHtml)) errors.push(`${file}: deve se identificar como superfície interna de revisão visual.`);
  if (!/não autoriza publicação|composição interna não publicada|não publicada/i.test(galleryHtml)) errors.push(`${file}: deve declarar explicitamente que não autoriza publicação.`);
  if (!/@media\s+print/i.test(galleryHtml) || !/@page\s*\{[^}]*landscape/is.test(galleryHtml)) errors.push(`${file}: deve possuir impressão A4 landscape explícita.`);
  if (/<form\b|<input\b|<button\b|<script\b/i.test(galleryHtml)) errors.push(`${file}: não deve conter formulário, input, botão ou script.`);
  if (/https?:\/\//i.test(galleryHtml)) errors.push(`${file}: não pode conter URLs externas.`);
  if (!/EM PREPARAÇÃO/i.test(galleryHtml)) errors.push(`${file}: JPN Pro Kit deve permanecer sinalizado como EM PREPARAÇÃO.`);
}

const declaredIds = [...html.matchAll(/data-asset=["']([^"']+)["']/g)].map((match) => match[1]);
const declaredSet = new Set(declaredIds);
const manifestIds = new Set(assets.map((asset) => asset.id));

for (const id of declaredSet) if (!manifestIds.has(id)) errors.push(`Galerias referenciam data-asset não registrado: ${id}`);

for (const asset of assets) {
  const idOccurrences = declaredIds.filter((id) => id === asset.id).length;
  if (idOccurrences !== 1) errors.push(`${asset.id}: deve aparecer exatamente uma vez no conjunto de galerias (encontrado ${idOccurrences}).`);

  const expectedSrc = `../${asset.path}`;
  const escaped = expectedSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const srcOccurrences = [...html.matchAll(new RegExp(`src=["']${escaped}["']`, 'g'))].length;
  if (srcOccurrences !== 1) errors.push(`${asset.id}: src esperado ${expectedSrc} deve aparecer exatamente uma vez no conjunto de galerias (encontrado ${srcOccurrences}).`);
}

if (declaredIds.length !== assets.length) errors.push(`Cobertura divergente: data-assets=${declaredIds.length}, manifesto=${assets.length}.`);

const kinds = new Set(assets.map((asset) => asset.kind));
for (const requiredKind of ['brand','cover','social','template','story']) if (!kinds.has(requiredKind)) errors.push(`Manifesto deve continuar cobrindo kind=${requiredKind}.`);

if (errors.length) {
  console.error('Commercial art gallery check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial art gallery check OK: ${assets.length} ativos canônicos representados exatamente uma vez em ${galleryFiles.length} superfícies internas de preview.`);
