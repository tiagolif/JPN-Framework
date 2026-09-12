import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceMapPath = path.join(root, 'docs/commercial/PRODUCT_DISTRIBUTION_SOURCE_MAP_v1.json');
const distributionPath = path.join(root, 'docs/commercial/PRODUCT_DISTRIBUTION_INDEX_v1.json');
const catalogPath = path.join(root, 'docs/product-system/DELIVERABLE_CATALOG_v1.json');
const statusPath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');

const sourceMap = JSON.parse(await readFile(sourceMapPath, 'utf8'));
const distribution = JSON.parse(await readFile(distributionPath, 'utf8'));
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const status = JSON.parse(await readFile(statusPath, 'utf8'));
const errors = [];

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const sameSet = (left, right) => {
  const a = [...new Set(left)].sort();
  const b = [...new Set(right)].sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
};

if (sourceMap.version !== '1.0.0') errors.push('PRODUCT_DISTRIBUTION_SOURCE_MAP_v1.json deve usar version 1.0.0.');
if (sourceMap.framework !== distribution.framework) errors.push('framework do source map diverge do índice de distribuição.');
if (sourceMap.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (sourceMap.release_effect !== 'none') errors.push('release_effect deve permanecer none.');

const mapProducts = Array.isArray(sourceMap.products) ? sourceMap.products : [];
const distributionProducts = Array.isArray(distribution.products) ? distribution.products : [];
const catalogProducts = Array.isArray(catalog.products) ? catalog.products : [];
const statusProducts = Array.isArray(status.products) ? status.products : [];

const distributionById = new Map(distributionProducts.map((item) => [item.product_id, item]));
const catalogById = new Map(catalogProducts.map((item) => [item.id, item]));
const statusById = new Map(statusProducts.map((item) => [item.id, item]));
const seenProducts = new Set();
const allowedModes = new Set([
  'render_after_gate',
  'derive_after_gate',
  'copy_after_gate',
  'archive_after_gate',
  'freeze_validated_binary_after_gate',
  'archive_frozen_components_after_gate',
  'instantiate_template_after_gate',
  'generate_checksums_after_gate',
]);

if (mapProducts.length !== distributionProducts.length) {
  errors.push(`Cobertura de produtos divergente: source map=${mapProducts.length}, distribuição=${distributionProducts.length}.`);
}

for (const product of mapProducts) {
  const productId = product.product_id;
  if (!nonEmpty(productId)) {
    errors.push('Há produto sem product_id no source map.');
    continue;
  }
  if (seenProducts.has(productId)) errors.push(`Produto duplicado no source map: ${productId}`);
  seenProducts.add(productId);

  const distributionProduct = distributionById.get(productId);
  const catalogProduct = catalogById.get(productId);
  const statusProduct = statusById.get(productId);
  if (!distributionProduct) {
    errors.push(`${productId}: ausente do índice de distribuição.`);
    continue;
  }
  if (!catalogProduct) errors.push(`${productId}: ausente do catálogo de entregáveis.`);
  if (!statusProduct) errors.push(`${productId}: ausente do contrato de release status.`);

  const slots = Array.isArray(product.slots) ? product.slots : [];
  const distributionSlots = Array.isArray(distributionProduct.slots) ? distributionProduct.slots : [];
  const distributionSlotById = new Map(distributionSlots.map((slot) => [slot.id, slot]));
  const candidateSet = new Set(catalogProduct?.candidate_deliverables ?? []);
  const dependencySet = new Set((statusProduct?.dependencies ?? []).map((dep) => dep.id));
  const seenSlots = new Set();

  if (slots.length !== distributionSlots.length) {
    errors.push(`${productId}: quantidade de slots diverge (${slots.length} != ${distributionSlots.length}).`);
  }

  for (const slot of slots) {
    if (!nonEmpty(slot.slot_id)) {
      errors.push(`${productId}: há slot sem slot_id.`);
      continue;
    }
    if (seenSlots.has(slot.slot_id)) errors.push(`${productId}: slot duplicado: ${slot.slot_id}`);
    seenSlots.add(slot.slot_id);

    const indexedSlot = distributionSlotById.get(slot.slot_id);
    if (!indexedSlot) {
      errors.push(`${productId}/${slot.slot_id}: slot não existe no índice de distribuição.`);
      continue;
    }
    if (slot.target_path !== indexedSlot.path) {
      errors.push(`${productId}/${slot.slot_id}: target_path diverge (${slot.target_path} != ${indexedSlot.path}).`);
    }
    if (!allowedModes.has(slot.assembly_mode)) {
      errors.push(`${productId}/${slot.slot_id}: assembly_mode inválido: ${slot.assembly_mode}`);
    }

    const sources = Array.isArray(slot.source_paths) ? slot.source_paths : [];
    const candidates = Array.isArray(slot.candidate_reference_paths) ? slot.candidate_reference_paths : [];
    const gates = Array.isArray(slot.generated_after_gate) ? slot.generated_after_gate : [];

    if (!sameSet(gates, indexedSlot.requires ?? [])) {
      errors.push(`${productId}/${slot.slot_id}: generated_after_gate deve coincidir exatamente com requires do índice.`);
    }
    for (const gate of gates) {
      if (!dependencySet.has(gate)) errors.push(`${productId}/${slot.slot_id}: gate desconhecido no release status: ${gate}`);
    }

    const permitsNoSource =
      (productId === 'jpn-gestao-facil' && slot.slot_id === 'principal') ||
      (productId === 'jpn-pro-kit' && slot.slot_id === 'principal');
    if (sources.length === 0 && !permitsNoSource) {
      errors.push(`${productId}/${slot.slot_id}: source_paths não pode ficar vazio.`);
    }
    if (permitsNoSource && sources.length !== 0) {
      errors.push(`${productId}/${slot.slot_id}: principal deve permanecer sem source_paths fixos até o gate final.`);
    }

    for (const source of sources) {
      if (!nonEmpty(source)) {
        errors.push(`${productId}/${slot.slot_id}: source_path vazio.`);
        continue;
      }
      if (source === slot.target_path || source.startsWith('dist/')) {
        errors.push(`${productId}/${slot.slot_id}: fonte não pode apontar para target/dist: ${source}`);
      }
      try {
        await access(path.join(root, source));
      } catch {
        errors.push(`${productId}/${slot.slot_id}: source_path inexistente: ${source}`);
      }
    }

    for (const candidate of candidates) {
      if (!nonEmpty(candidate)) {
        errors.push(`${productId}/${slot.slot_id}: candidate_reference_path vazio.`);
        continue;
      }
      if (!candidateSet.has(candidate)) {
        errors.push(`${productId}/${slot.slot_id}: referência de candidato não pertence ao catálogo do produto: ${candidate}`);
      }
      try {
        await access(path.join(root, candidate));
      } catch {
        errors.push(`${productId}/${slot.slot_id}: candidate_reference_path inexistente: ${candidate}`);
      }
    }
  }

  for (const indexedSlot of distributionSlots) {
    if (!seenSlots.has(indexedSlot.id)) errors.push(`${productId}: slot do índice sem proveniência: ${indexedSlot.id}`);
  }
}

for (const product of distributionProducts) {
  if (!seenProducts.has(product.product_id)) errors.push(`${product.product_id}: produto do índice sem source map.`);
}

const gestao = mapProducts.find((item) => item.product_id === 'jpn-gestao-facil');
const gestaoPrincipal = gestao?.slots?.find((item) => item.slot_id === 'principal');
if (!gestaoPrincipal?.candidate_reference_paths?.includes('deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx')) {
  errors.push('Gestão Fácil: o XLSX v0.1 deve permanecer explicitamente como referência de candidato do slot principal.');
}
if ((gestaoPrincipal?.source_paths ?? []).includes('deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx')) {
  errors.push('Gestão Fácil: o XLSX v0.1 não pode virar source_path do arquivo final.');
}

const proKit = mapProducts.find((item) => item.product_id === 'jpn-pro-kit');
const proKitPrincipal = proKit?.slots?.find((item) => item.slot_id === 'principal');
if ((proKitPrincipal?.source_paths ?? []).length !== 0) {
  errors.push('Pro Kit: bundle principal deve permanecer sem fontes fixas até o freeze dos componentes elegíveis.');
}
const checksumSlot = proKit?.slots?.find((item) => item.slot_id === 'checksums');
if (!sameSet(checksumSlot?.generated_after_gate ?? [], ['hashes-finais'])) {
  errors.push('Pro Kit: SHA256SUMS.txt só pode ser materializado após hashes-finais.');
}

if (errors.length > 0) {
  console.error('Product distribution source map check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const slotCount = mapProducts.reduce((total, product) => total + (product.slots?.length ?? 0), 0);
console.log(`Product distribution source map check OK: ${mapProducts.length} produtos e ${slotCount} slots com proveniência e gates alinhados.`);
