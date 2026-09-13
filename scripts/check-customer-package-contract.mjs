import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contract = JSON.parse(await readFile(path.join(root, 'docs/product-system/CUSTOMER_PACKAGE_CONTRACT_v1.json'), 'utf8'));
const portfolio = JSON.parse(await readFile(path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json'), 'utf8'));
const release = JSON.parse(await readFile(path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json'), 'utf8'));
const delivery = JSON.parse(await readFile(path.join(root, 'docs/commercial/PRODUCT_DELIVERY_MANIFESTS_v1.json'), 'utf8'));

const errors = [];
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const products = Array.isArray(contract.products) ? contract.products : [];
const portfolioProducts = Array.isArray(portfolio.products) ? portfolio.products : [];
const releaseById = new Map((release.products ?? []).map((item) => [item.id, item]));
const deliveryById = new Map((delivery.products ?? []).map((item) => [item.product_id, item]));
const portfolioById = new Map(portfolioProducts.map((item) => [item.id, item]));

if (contract.version !== '1.0.0') errors.push('CUSTOMER_PACKAGE_CONTRACT_v1.json deve usar version 1.0.0.');
if (contract.framework !== portfolio.framework) errors.push('framework do contrato diverge do portfólio canônico.');
if (contract.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (contract.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (!Array.isArray(contract.sources) || contract.sources.length < 4) errors.push('sources deve conter ao menos 4 fontes canônicas.');
if (!Array.isArray(contract.standard_structure) || contract.standard_structure.length !== 6) errors.push('standard_structure deve conter as 6 pastas padrão.');
if (!Array.isArray(contract.required_integrity_files) || contract.required_integrity_files.length !== 4) errors.push('required_integrity_files deve conter 4 arquivos obrigatórios.');
if (!Array.isArray(contract.global_rules) || contract.global_rules.length < 5) errors.push('global_rules insuficiente.');
if (products.length !== portfolioProducts.length) errors.push(`Cobertura incorreta: contrato=${products.length}, portfólio=${portfolioProducts.length}.`);

for (const source of contract.sources ?? []) {
  try { await access(path.join(root, source)); }
  catch { errors.push(`Fonte canônica ausente: ${source}`); }
}

const requiredFolders = ['00_COMECE_AQUI', '01_PRODUTO', '02_GUIAS', '03_EXEMPLOS', '04_REFERENCIAS', '99_INTEGRIDADE'];
if (JSON.stringify(contract.standard_structure) !== JSON.stringify(requiredFolders)) errors.push('standard_structure diverge da estrutura padrão de handoff.');
const requiredIntegrity = [
  '00_COMECE_AQUI/README_ENTREGA.md',
  '00_COMECE_AQUI/CHANGELOG_RESUMIDO.md',
  '99_INTEGRIDADE/MANIFEST.txt',
  '99_INTEGRIDADE/SHA256SUMS.txt',
];
if (JSON.stringify(contract.required_integrity_files) !== JSON.stringify(requiredIntegrity)) errors.push('Arquivos de integridade obrigatórios divergentes.');

const seen = new Set();
for (const item of products) {
  if (!nonEmpty(item.product_id)) errors.push('Há pacote sem product_id.');
  if (seen.has(item.product_id)) errors.push(`product_id duplicado: ${item.product_id}`);
  seen.add(item.product_id);
  const canonical = portfolioById.get(item.product_id);
  if (!canonical) {
    errors.push(`${item.product_id}: produto inexistente no portfólio.`);
    continue;
  }
  if (!nonEmpty(item.package_root) || !item.package_root.includes('<VERSAO>')) errors.push(`${item.product_id}: package_root deve ser versionável.`);
  if (item.open_first !== '00_COMECE_AQUI/README_ENTREGA.md') errors.push(`${item.product_id}: open_first deve apontar para README_ENTREGA.md.`);
  if (!nonEmpty(item.product_slot) || !item.product_slot.startsWith('01_PRODUTO/')) errors.push(`${item.product_id}: product_slot inválido.`);
  if (!Array.isArray(item.guide_slots) || item.guide_slots.length === 0 || item.guide_slots.some((slot) => !slot.startsWith('02_GUIAS/'))) errors.push(`${item.product_id}: guide_slots inválidos.`);
  if (!Array.isArray(item.reference_slots) || item.reference_slots.length === 0 || item.reference_slots.some((slot) => !slot.startsWith('04_REFERENCIAS/'))) errors.push(`${item.product_id}: reference_slots inválidos.`);
  if (item.materialization_allowed !== false) errors.push(`${item.product_id}: materialization_allowed deve permanecer false enquanto os gates estiverem pendentes.`);

  const expectedDeps = canonical.release_dependencies ?? [];
  const actualDeps = item.required_release_dependencies ?? [];
  if (JSON.stringify(actualDeps) !== JSON.stringify(expectedDeps)) errors.push(`${item.product_id}: dependências divergem do portfólio.`);
  const releaseDeps = (releaseById.get(item.product_id)?.dependencies ?? []).map((dep) => dep.id);
  if (JSON.stringify(actualDeps) !== JSON.stringify(releaseDeps)) errors.push(`${item.product_id}: dependências divergem do status de release.`);
  const deliveryDeps = deliveryById.get(item.product_id)?.required_release_dependencies ?? [];
  if (JSON.stringify(actualDeps) !== JSON.stringify(deliveryDeps)) errors.push(`${item.product_id}: dependências divergem do manifesto de entrega.`);
}

for (const product of portfolioProducts) if (!seen.has(product.id)) errors.push(`${product.id}: sem contrato de pacote.`);

const builder = products.find((item) => item.product_id === 'jpn-prompt-builder');
if (builder && builder.product_slot !== '01_PRODUTO/JPN_Prompt_Builder_Offline.zip') errors.push('Prompt Builder deve projetar o ZIP offline final no slot principal.');
const gestao = products.find((item) => item.product_id === 'jpn-gestao-facil');
if (gestao && gestao.product_slot !== '01_PRODUTO/JPN_Gestao_Facil_FINAL.xlsx') errors.push('Gestão Fácil deve projetar apenas o XLSX final validado.');
const proKit = products.find((item) => item.product_id === 'jpn-pro-kit');
if (proKit && !proKit.required_release_dependencies.includes('hashes-finais')) errors.push('Pro Kit deve manter hashes-finais como gate obrigatório.');

const forbidden = [/checkout/i, /preço/i, /dados financeiros reais/i, /credenciais/i];
const positiveSurface = products.flatMap((item) => [item.package_root, item.product_slot, ...(item.guide_slots ?? []), ...(item.reference_slots ?? [])]).join(' ');
for (const pattern of forbidden) if (pattern.test(positiveSurface)) errors.push(`Slots de pacote contêm conteúdo proibido: ${pattern}`);

if (errors.length) {
  console.error('Customer package contract check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Customer package contract check OK: ${products.length} pacotes projetados, todos bloqueados até os gates canônicos.`);