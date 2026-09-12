import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => { throw new Error(`[product-usage-routes] ${message}`); };

const portfolio = readJson('docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const release = readJson('docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const routes = readJson('docs/product-system/PRODUCT_USAGE_ROUTES_v1.json');
const guide = readText('docs/product-system/PORTFOLIO_START_HERE_v1.md');

const productIds = new Set(portfolio.products.map((product) => product.id));
const releaseById = new Map(release.products.map((product) => [product.id, product]));

if (routes.framework !== 'JPN Framework') fail('framework inválido');
if (routes.publication_authorized !== false) fail('publication_authorized deve permanecer false');
if (routes.release_effect !== 'none') fail('release_effect deve permanecer none');
if (!Array.isArray(routes.routes) || routes.routes.length !== 5) fail('esperadas exatamente 5 rotas');

for (const product of portfolio.products) {
  if (!releaseById.has(product.id)) fail(`produto sem estado canônico de release: ${product.id}`);
  if (!guide.includes(product.canonical_name)) fail(`guia não menciona produto canônico: ${product.canonical_name}`);
}

const routeIds = new Set();
for (const route of routes.routes) {
  if (!route.id || routeIds.has(route.id)) fail(`id de rota ausente ou duplicado: ${route.id}`);
  routeIds.add(route.id);
  if (!productIds.has(route.start_with)) fail(`start_with desconhecido em ${route.id}: ${route.start_with}`);
  if (!Array.isArray(route.then)) fail(`then deve ser array em ${route.id}`);
  for (const productId of route.then) {
    if (!productIds.has(productId)) fail(`produto desconhecido em ${route.id}: ${productId}`);
  }
  if (!route.use_when || !route.stop_when) fail(`rota sem critério de uso/parada: ${route.id}`);
}

const proKitRoute = routes.routes.find((route) => route.start_with === 'jpn-pro-kit');
if (!proKitRoute?.availability_guard) fail('rota do Pro Kit precisa de availability_guard');

const proKitRelease = releaseById.get('jpn-pro-kit');
const proKitOpen = proKitRelease.dependencies.some((dep) => ['pending', 'in-progress', 'blocked'].includes(dep.status));
if (proKitOpen && !/apenas arquitetural/i.test(proKitRoute.availability_guard)) {
  fail('Pro Kit possui bloqueios abertos e deve permanecer apenas arquitetural');
}

const forbiddenPatterns = [
  /compre agora/i,
  /checkout/i,
  /desconto\s+de\s+\d+/i,
  /garantia de vendas/i,
  /roi garantido/i,
  /release[- ]ready/i,
];

for (const [label, text] of [
  ['PORTFOLIO_START_HERE_v1.md', guide],
  ['PRODUCT_USAGE_ROUTES_v1.json', JSON.stringify(routes)],
]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) fail(`${label} contém padrão comercial/release bloqueado: ${pattern}`);
  }
}

const routeProductIds = new Set(routes.routes.flatMap((route) => [route.start_with, ...route.then]));
for (const productId of productIds) {
  if (!routeProductIds.has(productId)) fail(`produto não coberto por nenhuma rota: ${productId}`);
}

console.log(`[product-usage-routes] OK: ${routes.routes.length} rotas cobrem ${productIds.size} produtos sem promover release ou publicação.`);
