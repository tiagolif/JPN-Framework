import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const blueprintPath = path.join(root, 'docs/products/pro-kit/ASSEMBLY_BLUEPRINT_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const releasePath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');

const [blueprint, portfolio, release] = await Promise.all([
  readFile(blueprintPath, 'utf8').then(JSON.parse),
  readFile(portfolioPath, 'utf8').then(JSON.parse),
  readFile(releasePath, 'utf8').then(JSON.parse),
]);

const errors = [];
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const sameSet = (a = [], b = []) => a.length === b.length && a.every((item) => b.includes(item));

if (blueprint.version !== '1.0.0') errors.push('ASSEMBLY_BLUEPRINT_v1.json deve usar version 1.0.0.');
if (blueprint.product_id !== 'jpn-pro-kit') errors.push('product_id deve ser jpn-pro-kit.');
if (blueprint.canonical_name !== 'JPN Pro Kit') errors.push('canonical_name deve ser JPN Pro Kit.');
if (blueprint.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (blueprint.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (!nonEmpty(blueprint.bundle_root)) errors.push('bundle_root ausente.');

const portfolioProducts = new Map((portfolio.products ?? []).map((item) => [item.id, item]));
const releaseProducts = new Map((release.products ?? []).map((item) => [item.id, item]));
const proKit = portfolioProducts.get('jpn-pro-kit');
const proKitRelease = releaseProducts.get('jpn-pro-kit');

if (!proKit) errors.push('JPN Pro Kit ausente do portfólio.');
if (!proKitRelease) errors.push('JPN Pro Kit ausente do contrato de release.');
if (proKit && !sameSet(blueprint.pro_kit_release_gates, proKit.release_dependencies)) {
  errors.push('pro_kit_release_gates diverge de PRODUCT_PORTFOLIO_v1.json.');
}
if (proKitRelease) {
  const ids = (proKitRelease.dependencies ?? []).map((item) => item.id);
  if (!sameSet(blueprint.pro_kit_release_gates, ids)) errors.push('pro_kit_release_gates diverge de PRODUCT_RELEASE_STATUS_v1.json.');
  if ((proKitRelease.dependencies ?? []).some((item) => item.status === 'passed')) {
    errors.push('Blueprint não deve presumir gates finais do Pro Kit como passed antes do freeze final.');
  }
}

const expectedSlots = [
  '00_LEIA_PRIMEIRO',
  '01_METODO_JPN',
  '02_PROMPT_PACK',
  '03_JPN_BUSINESS',
  '04_PROMPT_BUILDER',
  '05_GESTAO_FACIL',
];
const slots = Array.isArray(blueprint.component_slots) ? blueprint.component_slots : [];
if (slots.length !== expectedSlots.length) errors.push(`component_slots deve conter ${expectedSlots.length} itens.`);
if (!sameSet(slots.map((item) => item.slot), expectedSlots)) errors.push('component_slots não cobre exatamente a estrutura canônica do bundle.');

const seenSlots = new Set();
const seenFutureArtifacts = new Set();
for (const slot of slots) {
  if (!nonEmpty(slot.slot)) errors.push('Há slot sem nome.');
  if (seenSlots.has(slot.slot)) errors.push(`Slot duplicado: ${slot.slot}`);
  seenSlots.add(slot.slot);
  if (!['product', 'pro-kit-navigation'].includes(slot.kind)) errors.push(`${slot.slot}: kind inválido.`);
  if (!portfolioProducts.has(slot.product_id)) errors.push(`${slot.slot}: product_id desconhecido: ${slot.product_id}`);
  if (!Array.isArray(slot.candidate_sources) || slot.candidate_sources.length === 0) errors.push(`${slot.slot}: candidate_sources vazio.`);
  if (!Array.isArray(slot.future_artifacts) || slot.future_artifacts.length === 0) errors.push(`${slot.slot}: future_artifacts vazio.`);
  if (!Array.isArray(slot.required_component_gates)) errors.push(`${slot.slot}: required_component_gates deve ser array.`);
  if (!nonEmpty(slot.materialization_status) || !slot.materialization_status.startsWith('blocked-')) errors.push(`${slot.slot}: materialization_status deve permanecer bloqueado.`);

  if (slot.kind === 'product') {
    const product = portfolioProducts.get(slot.product_id);
    const releaseProduct = releaseProducts.get(slot.product_id);
    if (!product || !releaseProduct) continue;
    const portfolioDeps = product.release_dependencies ?? [];
    const releaseDeps = (releaseProduct.dependencies ?? []).map((item) => item.id);
    if (!sameSet(slot.required_component_gates, portfolioDeps)) errors.push(`${slot.slot}: gates divergem do portfólio para ${slot.product_id}.`);
    if (!sameSet(slot.required_component_gates, releaseDeps)) errors.push(`${slot.slot}: gates divergem do status de release para ${slot.product_id}.`);
  } else if (slot.product_id !== 'jpn-pro-kit') {
    errors.push(`${slot.slot}: slot de navegação deve pertencer ao jpn-pro-kit.`);
  }

  for (const source of slot.candidate_sources ?? []) {
    if (!nonEmpty(source)) {
      errors.push(`${slot.slot}: candidate_source vazio.`);
      continue;
    }
    if (source.startsWith('dist/')) errors.push(`${slot.slot}: candidate_source não pode vir de dist/: ${source}`);
    try { await access(path.join(root, source)); }
    catch { errors.push(`${slot.slot}: fonte candidata inexistente: ${source}`); }
  }

  for (const artifact of slot.future_artifacts ?? []) {
    if (!nonEmpty(artifact)) {
      errors.push(`${slot.slot}: future_artifact vazio.`);
      continue;
    }
    if (seenFutureArtifacts.has(artifact)) errors.push(`future_artifact duplicado: ${artifact}`);
    seenFutureArtifacts.add(artifact);
    if (!artifact.startsWith(`${slot.slot}/`)) errors.push(`${slot.slot}: future_artifact fora do próprio slot: ${artifact}`);
  }
}

const gestao = slots.find((item) => item.product_id === 'jpn-gestao-facil');
if (gestao) {
  if (!gestao.candidate_sources.includes('docs/products/gestao-facil/WORKBOOK_SPEC_v0.3.json')) {
    errors.push('Gestão Fácil deve apontar para WORKBOOK_SPEC_v0.3.json como candidata atual.');
  }
  if (gestao.future_artifacts.some((item) => /v0\.1/i.test(item))) {
    errors.push('Gestão Fácil não deve projetar o XLSX histórico v0.1 como artefato final do Pro Kit.');
  }
}

const builder = slots.find((item) => item.product_id === 'jpn-prompt-builder');
if (builder && !builder.future_artifacts.some((item) => item.endsWith('.zip'))) {
  errors.push('Prompt Builder deve projetar um pacote offline ZIP final.');
}

const forbiddenTerms = [/checkout/i, /comprar\s+agora/i, /publica(c|ç)[aã]o\s+autorizada/i, /release_ready\s*[:=]\s*true/i];
const serialized = JSON.stringify(blueprint);
for (const pattern of forbiddenTerms) if (pattern.test(serialized)) errors.push(`Blueprint contém termo incompatível com o estado interno: ${pattern}`);

if (!Array.isArray(blueprint.finalization_order) || blueprint.finalization_order.length < 5) errors.push('finalization_order deve documentar o fechamento do bundle.');
if (!Array.isArray(blueprint.guardrails) || blueprint.guardrails.length < 5) errors.push('guardrails insuficientes.');

if (errors.length > 0) {
  console.error('Pro Kit assembly blueprint check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Pro Kit assembly blueprint check OK: ${slots.length} slots internos, fontes candidatas presentes e gates sincronizados.`);
