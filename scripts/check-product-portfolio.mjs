import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const terminologyPath = path.join(root, 'docs/product-system/CORE_TERMINOLOGY_v1.json');

const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const terminology = JSON.parse(await readFile(terminologyPath, 'utf8'));
const errors = [];

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const portfolioProducts = Array.isArray(portfolio.products) ? portfolio.products : [];
const terminologyProducts = Array.isArray(terminology.products) ? terminology.products : [];

if (portfolio.version !== '1.0.0') errors.push('PRODUCT_PORTFOLIO_v1.json deve usar version 1.0.0.');
if (portfolio.framework !== terminology.framework?.canonical_name) errors.push('framework do portfólio diverge do nome canônico em CORE_TERMINOLOGY_v1.json.');
if (portfolioProducts.length !== terminologyProducts.length) errors.push(`Quantidade de produtos diverge: portfólio=${portfolioProducts.length}, terminologia=${terminologyProducts.length}.`);

const seenIds = new Set();
const seenNames = new Set();
const terminologyById = new Map(terminologyProducts.map((item) => [item.id, item]));
for (const product of portfolioProducts) {
  if (!nonEmpty(product.id)) errors.push('Há produto sem id.');
  if (!nonEmpty(product.canonical_name)) errors.push(`${product.id ?? '<sem-id>'}: canonical_name ausente.`);
  if (!nonEmpty(product.documentation_root)) errors.push(`${product.id ?? '<sem-id>'}: documentation_root ausente.`);
  if (!nonEmpty(product.primary_artifact)) errors.push(`${product.id ?? '<sem-id>'}: primary_artifact ausente.`);
  if (!nonEmpty(product.audience)) errors.push(`${product.id ?? '<sem-id>'}: audience ausente.`);
  if (!nonEmpty(product.role)) errors.push(`${product.id ?? '<sem-id>'}: role ausente.`);
  if (!Array.isArray(product.release_dependencies) || product.release_dependencies.length === 0) errors.push(`${product.id ?? '<sem-id>'}: release_dependencies deve ter ao menos um item.`);
  if (seenIds.has(product.id)) errors.push(`ID duplicado no portfólio: ${product.id}`);
  seenIds.add(product.id);
  if (seenNames.has(product.canonical_name)) errors.push(`Nome canônico duplicado no portfólio: ${product.canonical_name}`);
  seenNames.add(product.canonical_name);
  const canonical = terminologyById.get(product.id);
  if (!canonical) errors.push(`${product.id}: ausente de CORE_TERMINOLOGY_v1.json.`);
  else if (canonical.canonical_name !== product.canonical_name) errors.push(`${product.id}: nome canônico diverge (${product.canonical_name} != ${canonical.canonical_name}).`);
  if (nonEmpty(product.documentation_root)) {
    try { await access(path.join(root, product.documentation_root)); }
    catch { errors.push(`${product.id}: documentation_root inexistente: ${product.documentation_root}`); }
  }
}
for (const product of terminologyProducts) if (!seenIds.has(product.id)) errors.push(`${product.id}: está na terminologia, mas não no portfólio.`);

const riskyClaims = [/garant(e|ia)\s+(de\s+)?resultado/i,/elimina\s+alucina/i,/100%\s+precis/i,/roi\s+garantid/i,/substitui\s+revis[aã]o\s+humana/i];
for (const product of portfolioProducts) {
  const descriptiveText = `${product.audience ?? ''} ${product.role ?? ''}`;
  for (const claim of riskyClaims) if (claim.test(descriptiveText)) errors.push(`${product.id}: audience/role contém claim de risco: ${claim}`);
}
if (errors.length > 0) {
  console.error('Product portfolio check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const childChecks = [
  ['scripts/check-product-usage-routes.mjs', 'rotas de uso'],
  ['scripts/check-small-business-use-cases.mjs', 'casos de uso para pequenas empresas'],
  ['scripts/check-small-business-diagnostic.mjs', 'diagnóstico para pequenas empresas'],
  ['scripts/check-commercial-diagnostic-ui.mjs', 'interface comercial do diagnóstico'],
  ['scripts/check-product-comparison-matrix.mjs', 'matriz comparativa dos produtos'],
  ['scripts/check-product-one-pagers.mjs', 'one-pagers dos produtos'],
  ['scripts/check-product-faq-objections.mjs', 'FAQ e objeções dos produtos'],
  ['scripts/check-business-prompt-crosswalk.mjs', 'crosswalk JPN Business × Prompt Pack'],
  ['scripts/check-customer-onboarding.mjs', 'onboarding dos produtos'],
  ['scripts/check-guided-demo-playbook.mjs', 'demo guiada dos produtos'],
  ['scripts/check-product-delivery-manifests.mjs', 'manifestos de entrega dos produtos'],
  ['scripts/check-product-distribution-index.mjs', 'índice de distribuição dos produtos'],
  ['scripts/check-product-distribution-source-map.mjs', 'proveniência dos pacotes de distribuição'],
  ['scripts/check-jpn-visual-identity.mjs', 'identidade visual canônica'],
  ['scripts/check-commercial-surface-manifest.mjs', 'manifesto das superfícies comerciais'],
  ['scripts/check-commercial-asset-manifest.mjs', 'manifesto dos ativos comerciais'],
  ['scripts/check-commercial-copy-contract.mjs', 'contrato canônico de copy comercial'],
  ['scripts/check-editorial-preflight.mjs', 'preflight editorial dos produtos'],
  ['scripts/check-editorial-composition-candidates.mjs', 'composição editorial candidata'],
  ['scripts/check-product-readiness-board.mjs', 'painel canônico de prontidão'],
  ['scripts/check-release-evidence-contract.mjs', 'contrato de evidência de release'],
  ['scripts/check-gestao-facil-v0.3-candidate.mjs', 'contrato da candidata Gestão Fácil v0.3'],
];

for (const [script, label] of childChecks) {
  const result = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    console.error(`Product portfolio check falhou no gate de ${label}.`);
    process.exit(result.status ?? 1);
  }
}
console.log(`Product portfolio check OK: ${portfolioProducts.length} produtos canônicos, rotas, casos de uso, diagnóstico, interface do diagnóstico, matriz comparativa, one-pagers, FAQ/objeções, crosswalk Business × Prompt Pack, onboarding, demo guiada, manifestos de entrega, índice de distribuição, proveniência dos pacotes, identidade visual, manifesto das superfícies comerciais, manifesto dos ativos comerciais, contrato canônico de copy comercial, preflight editorial, composição editorial candidata, painel canônico de prontidão, contrato de evidência de release e contrato da candidata Gestão Fácil v0.3 validados.`);
