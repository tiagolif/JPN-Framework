import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'docs/commercial/COMMERCIAL_SURFACE_MANIFEST_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const releasePath = path.join(root, 'docs/commercial/COMMERCIAL_RELEASE_STATE_v1.json');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const release = JSON.parse(await readFile(releasePath, 'utf8'));
const errors = [];

const surfaces = Array.isArray(manifest.surfaces) ? manifest.surfaces : [];
const productIds = new Set((portfolio.products ?? []).map((item) => item.id));
const releaseByProduct = new Map((release.products ?? []).map((item) => [item.id, item]));
const ids = new Set();
const paths = new Set();
const listedHtml = new Set();

if (manifest.version !== '1.0.0') errors.push('COMMERCIAL_SURFACE_MANIFEST_v1.json deve usar version 1.0.0.');
if (manifest.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (manifest.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (manifest.site_root !== 'commercial-site') errors.push('site_root deve permanecer commercial-site.');

const global = manifest.global_requirements ?? {};
const requiredFalse = [
  'external_urls_allowed',
  'transactional_cta_allowed',
  'pricing_allowed',
  'lead_capture_allowed',
  'tracking_allowed',
  'publication_allowed',
];
for (const key of requiredFalse) {
  if (global[key] !== false) errors.push(`global_requirements.${key} deve permanecer false.`);
}
if (global.robots !== 'noindex,nofollow') errors.push('global_requirements.robots deve ser noindex,nofollow.');
if (global.navigation !== 'relative-local-only') errors.push('global_requirements.navigation deve ser relative-local-only.');

async function walkHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) result.push(path.relative(root, full).split(path.sep).join('/'));
  }
  return result;
}

for (const surface of surfaces) {
  if (!surface.id || typeof surface.id !== 'string') errors.push('Há superfície sem id válido.');
  if (!surface.path || typeof surface.path !== 'string') errors.push(`${surface.id ?? '<sem-id>'}: path ausente.`);
  if (ids.has(surface.id)) errors.push(`ID de superfície duplicado: ${surface.id}`);
  ids.add(surface.id);
  if (paths.has(surface.path)) errors.push(`Path de superfície duplicado: ${surface.path}`);
  paths.add(surface.path);

  if (!surface.path?.startsWith('commercial-site/') || !surface.path?.endsWith('.html')) {
    errors.push(`${surface.id}: path deve apontar para HTML em commercial-site/.`);
  } else {
    listedHtml.add(surface.path);
    try {
      const html = await readFile(path.join(root, surface.path), 'utf8');
      if (!/name=["']robots["'][^>]*content=["']noindex,nofollow["']/i.test(html) &&
          !/content=["']noindex,nofollow["'][^>]*name=["']robots["']/i.test(html)) {
        errors.push(`${surface.id}: HTML deve manter meta robots noindex,nofollow.`);
      }
      const expectedStylesheet = surface.path.startsWith('commercial-site/products/') ? '../styles.css' : 'styles.css';
      if (!html.includes(expectedStylesheet)) errors.push(`${surface.id}: não referencia ${expectedStylesheet}.`);
    } catch {
      errors.push(`${surface.id}: HTML inexistente: ${surface.path}`);
    }
  }

  if (!Array.isArray(surface.source_contracts) || surface.source_contracts.length === 0) {
    errors.push(`${surface.id}: source_contracts deve ter ao menos um item.`);
  } else {
    for (const source of surface.source_contracts) {
      try { await access(path.join(root, source)); }
      catch { errors.push(`${surface.id}: contrato de origem inexistente: ${source}`); }
    }
  }

  if (!Array.isArray(surface.allowed_actions) || surface.allowed_actions.length === 0) {
    errors.push(`${surface.id}: allowed_actions deve ter ao menos um item.`);
  }

  if (surface.type === 'product-page') {
    if (!productIds.has(surface.product_id)) errors.push(`${surface.id}: product_id não pertence ao portfólio: ${surface.product_id}`);
    const commercial = releaseByProduct.get(surface.product_id);
    if (!commercial) errors.push(`${surface.id}: product_id ausente de COMMERCIAL_RELEASE_STATE_v1.json.`);
    else if (commercial.page !== surface.path) errors.push(`${surface.id}: path diverge do release comercial (${commercial.page}).`);
    if (!surface.cover_asset) errors.push(`${surface.id}: cover_asset ausente.`);
    else {
      try { await access(path.join(root, surface.cover_asset)); }
      catch { errors.push(`${surface.id}: cover_asset inexistente: ${surface.cover_asset}`); }
    }
  } else if ('product_id' in surface || 'cover_asset' in surface) {
    errors.push(`${surface.id}: apenas product-page deve declarar product_id/cover_asset.`);
  }
}

const actualHtml = new Set(await walkHtml(path.join(root, 'commercial-site')));
for (const file of actualHtml) if (!listedHtml.has(file)) errors.push(`HTML comercial não registrado no manifesto: ${file}`);
for (const file of listedHtml) if (!actualHtml.has(file)) errors.push(`Manifesto registra HTML inexistente: ${file}`);
if (actualHtml.size !== surfaces.length) errors.push(`Cobertura divergente: HTMLs=${actualHtml.size}, superfícies=${surfaces.length}.`);

const productSurfaces = surfaces.filter((item) => item.type === 'product-page');
if (productSurfaces.length !== productIds.size) errors.push(`Cobertura de páginas de produto divergente: páginas=${productSurfaces.length}, produtos=${productIds.size}.`);
for (const productId of productIds) {
  if (productSurfaces.filter((item) => item.product_id === productId).length !== 1) {
    errors.push(`${productId}: deve ter exatamente uma página de produto no manifesto.`);
  }
}

const diagnostic = surfaces.find((item) => item.id === 'product-diagnostic');
if (!diagnostic || diagnostic.type !== 'local-diagnostic') errors.push('product-diagnostic deve existir como local-diagnostic.');
else if (diagnostic.form_policy !== 'local-only-no-submit-no-persistence') errors.push('product-diagnostic deve manter form_policy local-only-no-submit-no-persistence.');

const forbiddenActions = /buy|checkout|purchase|price|lead|track|publish|subscribe|order/i;
for (const surface of surfaces) {
  for (const action of surface.allowed_actions ?? []) {
    if (forbiddenActions.test(action)) errors.push(`${surface.id}: ação não permitida pelo guardrail: ${action}`);
  }
}

const proKit = productSurfaces.find((item) => item.product_id === 'jpn-pro-kit');
const proKitHtml = proKit ? await readFile(path.join(root, proKit.path), 'utf8') : '';
if (proKit && !/EM PREPARA(?:Ç|&Ccedil;|&#199;|&#xC7;)ÃO/i.test(proKitHtml) && !/EM PREPARA/i.test(proKitHtml)) {
  errors.push('Página do JPN Pro Kit deve continuar sinalizando EM PREPARAÇÃO.');
}

if (errors.length) {
  console.error('Commercial surface manifest check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial surface manifest check OK: ${surfaces.length} superfícies internas, ${productSurfaces.length} páginas de produto e respectivas fontes validadas.`);
