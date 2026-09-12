import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'docs/commercial/COMMERCIAL_ASSET_MANIFEST_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const errors = [];
const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
const products = Array.isArray(portfolio.products) ? portfolio.products : [];
const productIds = new Set(products.map((p) => p.id));
const allowedKinds = new Set(['brand', 'cover', 'social', 'template']);
const allowedScopes = new Set(['shared', 'product', 'framework', 'ecosystem']);
const allowedUsages = new Set(['internal-preview', 'design-source', 'product-page-reference', 'content-candidate']);

if (manifest.version !== '1.0.0') errors.push('COMMERCIAL_ASSET_MANIFEST_v1.json deve usar version 1.0.0.');
if (manifest.framework !== portfolio.framework) errors.push('framework do manifesto diverge de PRODUCT_PORTFOLIO_v1.json.');
if (manifest.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (manifest.release_effect !== 'none') errors.push('release_effect deve permanecer none.');

for (const [key, expected] of Object.entries({
  external_publication_allowed: false,
  paid_media_allowed: false,
  transactional_cta_allowed: false,
  lead_capture_allowed: false,
  financial_data_allowed: false,
  release_readiness_implied: false,
})) {
  if (manifest.policy?.[key] !== expected) errors.push(`policy.${key} deve permanecer ${expected}.`);
}

const seenIds = new Set();
const seenPaths = new Set();
const registeredPaths = new Set();

for (const asset of assets) {
  if (typeof asset.id !== 'string' || !asset.id.trim()) errors.push('Há ativo sem id.');
  if (typeof asset.path !== 'string' || !asset.path.trim()) errors.push(`${asset.id ?? '<sem-id>'}: path ausente.`);
  if (seenIds.has(asset.id)) errors.push(`ID de ativo duplicado: ${asset.id}`);
  seenIds.add(asset.id);
  if (seenPaths.has(asset.path)) errors.push(`Path de ativo duplicado: ${asset.path}`);
  seenPaths.add(asset.path);
  registeredPaths.add(asset.path);

  if (!allowedKinds.has(asset.kind)) errors.push(`${asset.id}: kind inválido: ${asset.kind}`);
  if (!allowedScopes.has(asset.scope)) errors.push(`${asset.id}: scope inválido: ${asset.scope}`);
  if (!String(asset.path ?? '').endsWith('.svg')) errors.push(`${asset.id}: somente SVG pode entrar neste manifesto.`);

  if (asset.scope === 'product') {
    if (!productIds.has(asset.product_id)) errors.push(`${asset.id}: product_id desconhecido: ${asset.product_id}`);
  } else if (asset.product_id !== null) {
    errors.push(`${asset.id}: ativos fora de scope=product devem usar product_id=null.`);
  }

  if (!Array.isArray(asset.source_paths) || asset.source_paths.length === 0) {
    errors.push(`${asset.id}: source_paths deve conter ao menos uma fonte.`);
  } else {
    for (const source of asset.source_paths) {
      try { await access(path.join(root, source)); }
      catch { errors.push(`${asset.id}: fonte inexistente: ${source}`); }
    }
  }

  if (!Array.isArray(asset.allowed_usage) || asset.allowed_usage.length === 0) {
    errors.push(`${asset.id}: allowed_usage deve conter ao menos um uso.`);
  } else {
    for (const usage of asset.allowed_usage) {
      if (!allowedUsages.has(usage)) errors.push(`${asset.id}: allowed_usage desconhecido: ${usage}`);
    }
  }

  const positiveSurface = `${asset.id ?? ''} ${asset.path ?? ''} ${(asset.allowed_usage ?? []).join(' ')}`.toLowerCase();
  const risky = [/compre agora/, /checkout/, /pre[cç]o/, /roi garantid/, /resultado garantido/, /100% de precis[aã]o/, /public-release/, /paid-media/];
  for (const pattern of risky) if (pattern.test(positiveSurface)) errors.push(`${asset.id}: superfície positiva contém termo de risco: ${pattern}`);

  try { await access(path.join(root, asset.path)); }
  catch { errors.push(`${asset.id}: arquivo de ativo inexistente: ${asset.path}`); }
}

for (const contract of manifest.source_contracts ?? []) {
  try { await access(path.join(root, contract)); }
  catch { errors.push(`source_contract inexistente: ${contract}`); }
}

async function collectSvg(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const rel = path.posix.join(relativeDir.replaceAll('\\', '/'), entry.name);
    if (entry.isDirectory()) result.push(...await collectSvg(rel));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) result.push(rel);
  }
  return result;
}

const discovered = [];
for (const managedRoot of manifest.managed_roots ?? []) {
  try { discovered.push(...await collectSvg(managedRoot)); }
  catch { errors.push(`managed_root inexistente ou ilegível: ${managedRoot}`); }
}
const discoveredSet = new Set(discovered);
for (const actual of discoveredSet) if (!registeredPaths.has(actual)) errors.push(`SVG gerenciado sem registro no manifesto: ${actual}`);
for (const registered of registeredPaths) if (!discoveredSet.has(registered)) errors.push(`Ativo registrado fora/ausente dos managed_roots: ${registered}`);

const expectedProductIds = [...productIds].sort();
const coverAssets = assets.filter((a) => a.kind === 'cover');
const coverProductIds = coverAssets.map((a) => a.product_id).sort();
if (JSON.stringify(coverProductIds) !== JSON.stringify(expectedProductIds)) {
  errors.push(`Capas devem cobrir exatamente os seis produtos: capas=${coverProductIds.join(', ')}; produtos=${expectedProductIds.join(', ')}.`);
}
for (const productId of expectedProductIds) {
  const socials = assets.filter((a) => a.kind === 'social' && a.product_id === productId);
  if (socials.length < 1) errors.push(`${productId}: deve ter ao menos um ativo social próprio.`);
}

const proKitAssets = assets.filter((a) => a.product_id === 'jpn-pro-kit');
for (const asset of proKitAssets) {
  if (!asset.allowed_usage?.every((usage) => ['internal-preview', 'product-page-reference', 'content-candidate'].includes(usage))) {
    errors.push(`${asset.id}: Pro Kit deve permanecer em usos internos/candidatos enquanto houver dependências abertas.`);
  }
}

const requiredGuardrails = [
  'must_register_every_svg_under_managed_roots',
  'must_cover_every_product_with_exactly_one_cover',
  'must_cover_every_product_with_at_least_one_social_asset',
  'must_not_publish_without_authorization',
  'must_not_add_price_or_checkout',
  'must_not_add_lead_capture_or_tracking',
  'must_not_use_real_financial_data',
  'must_not_imply_release_readiness',
  'pro_kit_assets_remain_internal_while_release_dependencies_are_open',
];
for (const key of requiredGuardrails) if (manifest.guardrails?.[key] !== true) errors.push(`guardrails.${key} deve permanecer true.`);

if (errors.length) {
  console.error('Commercial asset manifest check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial asset manifest check OK: ${assets.length} ativos SVG registrados, ${coverAssets.length} capas e ${expectedProductIds.length} produtos cobertos.`);
