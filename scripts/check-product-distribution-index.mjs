import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'docs/commercial/PRODUCT_DISTRIBUTION_INDEX_v1.json');
const manifestsPath = path.join(root, 'docs/commercial/PRODUCT_DELIVERY_MANIFESTS_v1.json');
const releasePath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');

const index = JSON.parse(await readFile(indexPath, 'utf8'));
const manifests = JSON.parse(await readFile(manifestsPath, 'utf8'));
const release = JSON.parse(await readFile(releasePath, 'utf8'));
const errors = [];

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const indexProducts = Array.isArray(index.products) ? index.products : [];
const manifestProducts = Array.isArray(manifests.products) ? manifests.products : [];
const releaseProducts = Array.isArray(release.products) ? release.products : [];
const manifestById = new Map(manifestProducts.map((item) => [item.product_id, item]));
const releaseById = new Map(releaseProducts.map((item) => [item.id, item]));

if (index.version !== '1.0.0') errors.push('PRODUCT_DISTRIBUTION_INDEX_v1.json deve usar version 1.0.0.');
if (index.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (index.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (indexProducts.length !== manifestProducts.length) {
  errors.push(`Cobertura divergente: distribuição=${indexProducts.length}, manifestos=${manifestProducts.length}.`);
}

const seenProducts = new Set();
const packageRoots = new Set();
for (const product of indexProducts) {
  const id = product.product_id;
  if (!nonEmpty(id)) errors.push('Há produto sem product_id.');
  if (seenProducts.has(id)) errors.push(`Produto duplicado: ${id}`);
  seenProducts.add(id);

  const manifest = manifestById.get(id);
  const releaseState = releaseById.get(id);
  if (!manifest) errors.push(`${id}: ausente dos manifestos de entrega.`);
  if (!releaseState) errors.push(`${id}: ausente do status canônico de release.`);

  if (!nonEmpty(product.package_root) || !product.package_root.startsWith('dist/') || !product.package_root.endsWith('/')) {
    errors.push(`${id}: package_root deve apontar para dist/.../.`);
  }
  if (packageRoots.has(product.package_root)) errors.push(`${id}: package_root duplicado: ${product.package_root}`);
  packageRoots.add(product.package_root);

  if (!nonEmpty(product.release_filename)) errors.push(`${id}: release_filename ausente.`);
  if (!nonEmpty(product.index_filename)) errors.push(`${id}: index_filename ausente.`);
  if (!Array.isArray(product.slots) || product.slots.length === 0) errors.push(`${id}: slots deve ter ao menos um item.`);
  if (!Array.isArray(product.excluded_from_customer_package) || product.excluded_from_customer_package.length === 0) {
    errors.push(`${id}: excluded_from_customer_package deve ter ao menos um item.`);
  }

  const slotIds = new Set();
  const slotPaths = new Set();
  const manifestItems = new Set(manifest?.customer_receives ?? []);
  const releaseDeps = new Set((releaseState?.dependencies ?? []).map((dep) => dep.id));
  const referencedItems = new Set();

  for (const slot of product.slots ?? []) {
    if (!nonEmpty(slot.id)) errors.push(`${id}: slot sem id.`);
    if (slotIds.has(slot.id)) errors.push(`${id}: slot duplicado: ${slot.id}`);
    slotIds.add(slot.id);
    if (!nonEmpty(slot.path)) errors.push(`${id}/${slot.id}: path ausente.`);
    if (slotPaths.has(slot.path)) errors.push(`${id}: path de slot duplicado: ${slot.path}`);
    slotPaths.add(slot.path);
    if (slot.path?.startsWith('/') || slot.path?.includes('..')) errors.push(`${id}/${slot.id}: path inseguro: ${slot.path}`);

    if (!manifestItems.has(slot.source_manifest_item)) {
      errors.push(`${id}/${slot.id}: source_manifest_item não existe no manifesto: ${slot.source_manifest_item}`);
    } else {
      referencedItems.add(slot.source_manifest_item);
    }

    if (!Array.isArray(slot.requires) || slot.requires.length === 0) {
      errors.push(`${id}/${slot.id}: requires deve ter ao menos uma dependência.`);
    }
    for (const dependency of slot.requires ?? []) {
      if (!releaseDeps.has(dependency)) errors.push(`${id}/${slot.id}: dependência desconhecida: ${dependency}`);
    }
  }

  for (const item of manifestItems) {
    if (!referencedItems.has(item)) errors.push(`${id}: item do manifesto sem slot de distribuição: ${item}`);
  }

  if (!(product.slots ?? []).some((slot) => slot.path === product.release_filename)) {
    errors.push(`${id}: release_filename não aparece nos slots.`);
  }
  if (!(product.slots ?? []).some((slot) => slot.path === product.index_filename)) {
    errors.push(`${id}: index_filename não aparece nos slots.`);
  }
}

for (const manifest of manifestProducts) {
  if (!seenProducts.has(manifest.product_id)) errors.push(`${manifest.product_id}: manifesto sem índice de distribuição.`);
}

const serialized = JSON.stringify(index).toLowerCase();
const forbiddenSecrets = [/api[_ -]?key/, /senha real/, /token real/, /dados financeiros reais devem ser incluídos/];
for (const pattern of forbiddenSecrets) {
  if (pattern.test(serialized)) errors.push(`Índice contém instrução incompatível com segurança: ${pattern}`);
}

const proKit = indexProducts.find((item) => item.product_id === 'jpn-pro-kit');
if (!proKit?.slots?.some((slot) => slot.path === 'SHA256SUMS.txt' && slot.requires?.includes('hashes-finais'))) {
  errors.push('jpn-pro-kit: SHA256SUMS.txt deve depender de hashes-finais.');
}
if (!proKit?.slots?.some((slot) => slot.path === 'JPN_Pro_Kit.zip' && slot.requires?.includes('artefatos-congelados') && slot.requires?.includes('ci-final'))) {
  errors.push('jpn-pro-kit: bundle final deve depender de artefatos-congelados e ci-final.');
}

const gestao = indexProducts.find((item) => item.product_id === 'jpn-gestao-facil');
if (!gestao?.excluded_from_customer_package?.some((item) => /dados financeiros reais/i.test(item))) {
  errors.push('jpn-gestao-facil: dados financeiros reais devem permanecer explicitamente excluídos.');
}

if (errors.length > 0) {
  console.error('Product distribution index check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Product distribution index check OK: ${indexProducts.length} pacotes futuros cobertos e sincronizados com manifestos + release status.`);
