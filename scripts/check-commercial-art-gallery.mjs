import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'docs/commercial/COMMERCIAL_ASSET_MANIFEST_v1.json'), 'utf8'));
const html = await readFile(path.join(root, 'commercial-site/artes.html'), 'utf8');
const errors = [];
const assets = Array.isArray(manifest.assets) ? manifest.assets : [];

if (manifest.publication_authorized !== false) errors.push('Manifesto de ativos deve manter publication_authorized=false.');
if (!/name=["']robots["'][^>]*content=["']noindex,nofollow["']/i.test(html) && !/content=["']noindex,nofollow["'][^>]*name=["']robots["']/i.test(html)) errors.push('Galeria deve manter meta robots noindex,nofollow.');
if (!/Galeria interna de artes/i.test(html)) errors.push('Galeria deve se identificar como galeria interna de artes.');
if (!/não autoriza publicação|composição interna não publicada/i.test(html)) errors.push('Galeria deve declarar explicitamente que não autoriza publicação.');
if (!/@media\s+print/i.test(html) || !/@page\s*\{[^}]*landscape/is.test(html)) errors.push('Galeria deve possuir impressão A4 landscape explícita.');
if (/<form\b|<input\b|<button\b|<script\b/i.test(html)) errors.push('Galeria não deve conter formulário, input, botão ou script.');
if (/https?:\/\//i.test(html)) errors.push('Galeria não pode conter URLs externas.');
if (!/EM PREPARAÇÃO/i.test(html)) errors.push('JPN Pro Kit deve permanecer sinalizado como EM PREPARAÇÃO.');

const declaredIds = [...html.matchAll(/data-asset=["']([^"']+)["']/g)].map((match) => match[1]);
const declaredSet = new Set(declaredIds);
const manifestIds = new Set(assets.map((asset) => asset.id));

for (const id of declaredSet) if (!manifestIds.has(id)) errors.push(`Galeria referencia data-asset não registrado: ${id}`);

for (const asset of assets) {
  const idOccurrences = declaredIds.filter((id) => id === asset.id).length;
  if (idOccurrences !== 1) errors.push(`${asset.id}: deve aparecer exatamente uma vez na galeria (encontrado ${idOccurrences}).`);

  const expectedSrc = `../${asset.path}`;
  const escaped = expectedSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const srcOccurrences = [...html.matchAll(new RegExp(`src=["']${escaped}["']`, 'g'))].length;
  if (srcOccurrences !== 1) errors.push(`${asset.id}: src esperado ${expectedSrc} deve aparecer exatamente uma vez (encontrado ${srcOccurrences}).`);
}

if (declaredIds.length !== assets.length) errors.push(`Cobertura divergente: data-assets=${declaredIds.length}, manifesto=${assets.length}.`);

const kinds = new Set(assets.map((asset) => asset.kind));
for (const requiredKind of ['brand','cover','social','template']) if (!kinds.has(requiredKind)) errors.push(`Manifesto deve continuar cobrindo kind=${requiredKind}.`);

if (errors.length) {
  console.error('Commercial art gallery check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial art gallery check OK: ${assets.length} ativos canônicos representados exatamente uma vez em preview interno.`);
