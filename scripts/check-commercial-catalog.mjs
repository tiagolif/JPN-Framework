import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalogPath = path.join(root, 'commercial-site', 'catalogo.html');
const releaseStatePath = path.join(root, 'docs', 'commercial', 'COMMERCIAL_RELEASE_STATE_v1.json');
const usageRoutesPath = path.join(root, 'docs', 'product-system', 'PRODUCT_USAGE_ROUTES_v1.json');

const fail = (message) => {
  console.error(`commercial catalog: ${message}`);
  process.exitCode = 1;
};

if (!fs.existsSync(catalogPath)) fail('commercial-site/catalogo.html ausente');
if (!fs.existsSync(releaseStatePath)) fail('COMMERCIAL_RELEASE_STATE_v1.json ausente');
if (!fs.existsSync(usageRoutesPath)) fail('PRODUCT_USAGE_ROUTES_v1.json ausente');
if (process.exitCode) process.exit();

const html = fs.readFileSync(catalogPath, 'utf8');
const releaseState = JSON.parse(fs.readFileSync(releaseStatePath, 'utf8'));
const usageRoutes = JSON.parse(fs.readFileSync(usageRoutesPath, 'utf8'));

const expected = [
  ['metodo-jpn', 'Método JPN', 'products/metodo-jpn.html'],
  ['jpn-prompt-builder', 'JPN Prompt Builder', 'products/jpn-prompt-builder.html'],
  ['jpn-prompt-pack', 'JPN Prompt Pack', 'products/jpn-prompt-pack.html'],
  ['jpn-business', 'JPN Business', 'products/jpn-business.html'],
  ['jpn-gestao-facil', 'JPN Gestão Fácil', 'products/jpn-gestao-facil.html'],
  ['jpn-pro-kit', 'JPN Pro Kit', 'products/jpn-pro-kit.html'],
];

if (!html.includes('content="noindex,nofollow"')) fail('noindex,nofollow ausente');
if (!html.toLowerCase().includes('não publicada')) fail('estado interno/não publicado ausente');
if (!html.includes('Sem preço, checkout, reserva, coleta de dados ou autorização de venda.')) {
  fail('guardrail transacional do catálogo ausente');
}
if (!html.includes('escolher o menor produto que resolva a necessidade atual')) {
  fail('regra de seleção pelo menor recurso suficiente ausente');
}

const markers = [...html.matchAll(/data-product="([^"]+)"/g)].map((m) => m[1]);
if (markers.length !== expected.length) fail(`esperados ${expected.length} cards; encontrados ${markers.length}`);
if (new Set(markers).size !== markers.length) fail('há data-product duplicado no catálogo');

const stateById = new Map(releaseState.products.map((product) => [product.id, product]));

for (const [id, name, target] of expected) {
  const releaseProduct = stateById.get(id);
  if (!releaseProduct) {
    fail(`produto ausente do contrato comercial: ${id}`);
    continue;
  }

  const cardPattern = new RegExp(`<article[^>]*data-product="${id}"[^>]*data-release-state="([^"]+)"[\\s\\S]*?<h3>${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/h3>[\\s\\S]*?<a[^>]+href="${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i');
  const match = html.match(cardPattern);
  if (!match) {
    fail(`${name}: card, nome canônico ou link individual inválido`);
    continue;
  }

  const catalogState = match[1];
  if (catalogState !== releaseProduct.commercial_state) {
    fail(`${name}: estado ${catalogState} diverge do contrato ${releaseProduct.commercial_state}`);
  }

  if (!releaseProduct.public_presentation_allowed && catalogState === 'release-ready') {
    fail(`${name}: release-ready proibido enquanto public_presentation_allowed=false`);
  }
}

const contractIds = releaseState.products.map((product) => product.id).sort();
const catalogIds = [...markers].sort();
if (JSON.stringify(contractIds) !== JSON.stringify(catalogIds)) {
  fail('conjunto de produtos do catálogo diverge do contrato comercial');
}

const routeMarkers = [...html.matchAll(/data-route="([^"]+)"/g)].map((m) => m[1]);
const expectedRouteIds = usageRoutes.routes.map((route) => route.id);
if (routeMarkers.length !== expectedRouteIds.length) {
  fail(`esperadas ${expectedRouteIds.length} rotas canônicas; encontradas ${routeMarkers.length}`);
}
if (new Set(routeMarkers).size !== routeMarkers.length) fail('há data-route duplicado no catálogo');
if (JSON.stringify([...routeMarkers].sort()) !== JSON.stringify([...expectedRouteIds].sort())) {
  fail('conjunto de rotas do catálogo diverge de PRODUCT_USAGE_ROUTES_v1.json');
}

for (const route of usageRoutes.routes) {
  if (!html.includes(`data-route="${route.id}"`)) fail(`rota canônica ausente do catálogo: ${route.id}`);
  if (!html.includes(route.use_when)) fail(`${route.id}: critério de uso diverge do contrato canônico`);
  if (route.id !== 'rota-conjunto' && !html.includes(route.stop_when)) {
    fail(`${route.id}: critério de parada diverge do contrato canônico`);
  }
}

const proKitRoute = usageRoutes.routes.find((route) => route.id === 'rota-conjunto');
if (proKitRoute?.availability_guard && !html.includes('apenas arquitetural e não comercial')) {
  fail('guardrail arquitetural do Pro Kit ausente das rotas do catálogo');
}

const forbiddenPatterns = [
  [/<form\b/i, 'formulário'],
  [/<input\b/i, 'input/coleta de dados'],
  [/<script\b[^>]*src=/i, 'script externo'],
  [/https?:\/\//i, 'URL externa'],
  [/R\$\s*\d/i, 'preço em reais'],
  [/comprar agora/i, 'CTA de compra'],
  [/finalizar compra/i, 'CTA de checkout'],
  [/dispon[ií]vel agora/i, 'claim prematuro de disponibilidade'],
  [/j[aá] (?:est[aá]|estão) (?:liberado|liberados|dispon[ií]vel|dispon[ií]veis)/i, 'claim prematuro de liberação'],
  [/garant[iaeo]\w*\s+(?:de\s+)?(?:resultado|retorno|vendas|lucro)/i, 'claim de garantia'],
];

for (const [pattern, label] of forbiddenPatterns) {
  if (pattern.test(html)) fail(`conteúdo bloqueado detectado: ${label}`);
}

if (!process.exitCode) {
  console.log(`commercial catalog: OK — ${expected.length} produtos e ${expectedRouteIds.length} rotas sincronizados sem promoção prematura.`);
}
