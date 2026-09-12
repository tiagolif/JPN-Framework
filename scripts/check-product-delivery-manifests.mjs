import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const portfolio = JSON.parse(await readFile(path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json'), 'utf8'));
const release = JSON.parse(await readFile(path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(root, 'docs/commercial/PRODUCT_DELIVERY_MANIFESTS_v1.json'), 'utf8'));

const errors = [];
const products = Array.isArray(manifest.products) ? manifest.products : [];
const portfolioProducts = Array.isArray(portfolio.products) ? portfolio.products : [];
const releaseProducts = Array.isArray(release.products) ? release.products : [];
const portfolioById = new Map(portfolioProducts.map((item) => [item.id, item]));
const releaseById = new Map(releaseProducts.map((item) => [item.id, item]));
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;

if (manifest.version !== '1.0.0') errors.push('PRODUCT_DELIVERY_MANIFESTS_v1.json deve usar version 1.0.0.');
if (manifest.framework !== portfolio.framework) errors.push('framework dos manifestos diverge do portfólio canônico.');
if (manifest.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (manifest.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (!Array.isArray(manifest.delivery_rules) || manifest.delivery_rules.length < 4) errors.push('delivery_rules deve conter ao menos 4 regras.');
if (products.length !== portfolioProducts.length) errors.push(`Cobertura incorreta: manifestos=${products.length}, portfólio=${portfolioProducts.length}.`);

const seen = new Set();
for (const item of products) {
  if (!nonEmpty(item.product_id)) errors.push('Há manifesto sem product_id.');
  if (seen.has(item.product_id)) errors.push(`product_id duplicado: ${item.product_id}`);
  seen.add(item.product_id);

  const canonical = portfolioById.get(item.product_id);
  if (!canonical) {
    errors.push(`${item.product_id}: produto inexistente no portfólio.`);
    continue;
  }
  if (item.primary_artifact_type !== canonical.primary_artifact) {
    errors.push(`${item.product_id}: primary_artifact_type diverge do portfólio (${item.primary_artifact_type} != ${canonical.primary_artifact}).`);
  }
  if (!nonEmpty(item.delivery_name)) errors.push(`${item.product_id}: delivery_name ausente.`);
  if (!Array.isArray(item.customer_receives) || item.customer_receives.length < 4 || item.customer_receives.some((x) => !nonEmpty(x))) {
    errors.push(`${item.product_id}: customer_receives deve conter ao menos 4 itens não vazios.`);
  }
  if (!nonEmpty(item.completion_signal)) errors.push(`${item.product_id}: completion_signal ausente.`);
  if (!nonEmpty(item.must_not_claim)) errors.push(`${item.product_id}: must_not_claim ausente.`);

  const expectedDeps = canonical.release_dependencies ?? [];
  const actualDeps = item.required_release_dependencies ?? [];
  if (JSON.stringify(actualDeps) !== JSON.stringify(expectedDeps)) {
    errors.push(`${item.product_id}: required_release_dependencies diverge do portfólio canônico.`);
  }

  const releaseItem = releaseById.get(item.product_id);
  const releaseDeps = (releaseItem?.dependencies ?? []).map((dep) => dep.id);
  if (JSON.stringify(actualDeps) !== JSON.stringify(releaseDeps)) {
    errors.push(`${item.product_id}: dependências do manifesto divergem de PRODUCT_RELEASE_STATUS_v1.json.`);
  }

  const positiveSurface = [item.delivery_name, ...(item.customer_receives ?? []), item.completion_signal].join(' ');
  const forbiddenPositiveClaims = [
    /resultado garantido/i,
    /roi garantido/i,
    /vendas garantidas/i,
    /100% compat[ií]vel/i,
    /substitui (a )?contabilidade/i,
    /substitui (um )?ERP/i,
  ];
  for (const pattern of forbiddenPositiveClaims) {
    if (pattern.test(positiveSurface)) errors.push(`${item.product_id}: superfície positiva contém claim de risco: ${pattern}`);
  }
}

for (const product of portfolioProducts) {
  if (!seen.has(product.id)) errors.push(`${product.id}: sem manifesto de entrega.`);
}

const gestao = products.find((item) => item.product_id === 'jpn-gestao-facil');
if (gestao && !/contabilidade/i.test(gestao.must_not_claim)) errors.push('Gestão Fácil deve manter limite contábil explícito.');
if (gestao && !/REPOR/i.test(gestao.must_not_claim)) errors.push('Gestão Fácil deve manter REPOR como não autorização automática de compra.');

const proKit = products.find((item) => item.product_id === 'jpn-pro-kit');
if (proKit && !proKit.required_release_dependencies.includes('artefatos-congelados')) errors.push('Pro Kit deve depender de artefatos-congelados.');
if (proKit && !proKit.required_release_dependencies.includes('hashes-finais')) errors.push('Pro Kit deve depender de hashes-finais.');

if (errors.length) {
  console.error('Product delivery manifests check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Product delivery manifests check OK: ${products.length} produtos com entrega contratada e dependências sincronizadas.`);
