import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const identity = JSON.parse(await readFile(path.join(root, 'docs/commercial/JPN_VISUAL_IDENTITY_v1.json'), 'utf8'));
const portfolio = JSON.parse(await readFile(path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json'), 'utf8'));
const css = await readFile(path.join(root, identity.canonical_surface?.path ?? 'commercial-site/styles.css'), 'utf8');
const errors = [];

const expectedTokens = ['bg','bg2','surface','surface2','line','text','muted','accent','accent2'];
const requiredSurfaces = ['web','pdf','social_art','presentation','spreadsheet'];
const expectedProductIds = portfolio.products.map((p) => p.id).sort();
const identityProductIds = (identity.product_usage ?? []).map((p) => p.product_id).sort();

if (identity.version !== '1.0.0') errors.push('JPN_VISUAL_IDENTITY_v1.json deve usar version 1.0.0.');
if (identity.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (identity.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (identity.brand?.canonical_name !== 'JPN' || identity.brand?.wordmark !== 'JPN') errors.push('Marca/wordmark canônicos devem ser JPN.');

for (const token of expectedTokens) {
  const value = identity.color_tokens?.[token];
  if (!/^#[0-9A-F]{6}$/.test(value ?? '')) errors.push(`Token ${token} ausente ou fora do formato hexadecimal canônico.`);
  const cssPattern = new RegExp(`--${token}:\\s*${String(value).toLowerCase().replace('#','\\#')}`, 'i');
  if (!cssPattern.test(css)) errors.push(`Token ${token} (${value}) diverge de ${identity.canonical_surface?.path}.`);
}

const syncTokens = [...(identity.canonical_surface?.sync_required_tokens ?? [])].sort();
if (JSON.stringify(syncTokens) !== JSON.stringify([...expectedTokens].sort())) errors.push('sync_required_tokens deve conter exatamente os nove tokens canônicos.');
if (JSON.stringify(identityProductIds) !== JSON.stringify(expectedProductIds)) errors.push(`Cobertura de produtos diverge do portfólio: identidade=${identityProductIds.join(', ')}; portfólio=${expectedProductIds.join(', ')}.`);
if (new Set(identityProductIds).size !== identityProductIds.length) errors.push('product_usage contém product_id duplicado.');

for (const surface of requiredSurfaces) {
  if (typeof identity.surface_adaptation?.[surface] !== 'string' || !identity.surface_adaptation[surface].trim()) errors.push(`surface_adaptation.${surface} ausente.`);
}

if (identity.accessibility?.focus_visible_required !== true) errors.push('Foco visível deve ser obrigatório.');
if (identity.accessibility?.reduced_motion_required !== true) errors.push('Reduced motion deve ser obrigatório.');
if ((identity.accessibility?.body_text_minimum_px ?? 0) < 16) errors.push('Texto corporal mínimo deve ser >= 16 px.');
if (identity.accessibility?.meaning_must_not_depend_on_color_only !== true) errors.push('Significado não pode depender apenas de cor.');
if (!css.includes(':focus-visible')) errors.push('CSS canônico deve preservar :focus-visible.');
if (!css.includes('prefers-reduced-motion')) errors.push('CSS canônico deve preservar prefers-reduced-motion.');

const prohibited = JSON.stringify({ brand: identity.brand, image_direction: identity.image_direction, art_direction: identity.art_direction, product_usage: identity.product_usage, surface_adaptation: identity.surface_adaptation }).toLowerCase();
const riskyPositiveClaims = [/roi garantid/, /100% de precisão/, /resultado garantido/, /substitui revisão humana/, /checkout ativo/, /compre agora/];
for (const pattern of riskyPositiveClaims) {
  if (pattern.test(prohibited)) errors.push(`Superfície positiva da identidade contém claim/oferta de risco: ${pattern}`);
}

if (identity.guardrails?.must_not_publish_without_authorization !== true) errors.push('Guardrail de publicação sem autorização deve permanecer ativo.');
if (identity.guardrails?.must_not_add_price_or_checkout !== true) errors.push('Guardrail de preço/checkout deve permanecer ativo.');
if (identity.guardrails?.must_not_use_real_financial_data !== true) errors.push('Guardrail de dados financeiros reais deve permanecer ativo.');
if (identity.guardrails?.must_not_imply_release_readiness !== true) errors.push('Guardrail de prontidão de release deve permanecer ativo.');

if (errors.length) {
  console.error('JPN visual identity check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`JPN visual identity check OK: ${expectedTokens.length} tokens, ${expectedProductIds.length} produtos e ${requiredSurfaces.length} superfícies validados.`);
