import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'docs/products/pro-kit/MANIFEST.template.json');
const gatesPath = path.join(root, 'docs/products/pro-kit/RELEASE_GATES.json');

const fail = (message) => {
  console.error(`PRO_KIT_MANIFEST_CHECK_FAILED: ${message}`);
  process.exitCode = 1;
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (!fs.existsSync(manifestPath)) fail('MANIFEST.template.json ausente');
if (!fs.existsSync(gatesPath)) fail('RELEASE_GATES.json ausente');
if (process.exitCode) process.exit();

const manifest = readJson(manifestPath);
const gates = readJson(gatesPath);

if (manifest.product !== 'JPN Pro Kit') fail('product deve ser JPN Pro Kit');
if (manifest.commercial_version !== 'v1') fail('commercial_version deve permanecer v1');
if (manifest.status !== 'release-candidate-internal') fail('template deve permanecer release-candidate-internal');
if (manifest.generated_at !== null) fail('generated_at deve ser null enquanto for template');
if (manifest.source_commit !== null) fail('source_commit deve ser null enquanto for template');
if (!Array.isArray(manifest.files) || manifest.files.length === 0) fail('files deve conter entradas');

const allowedStatuses = new Set([
  'pending-final-artifact',
  'source-present',
  'offline-delivery-defined',
  'binary-versioned-local-qa-passed'
]);

const seenDeliveryPaths = new Set();
for (const item of manifest.files ?? []) {
  if (!item || typeof item !== 'object') {
    fail('cada entrada de files deve ser objeto');
    continue;
  }

  for (const field of ['path', 'source', 'status']) {
    if (typeof item[field] !== 'string' || !item[field].trim()) fail(`entrada inválida sem ${field}`);
  }

  if (seenDeliveryPaths.has(item.path)) fail(`path duplicado: ${item.path}`);
  seenDeliveryPaths.add(item.path);

  if (path.isAbsolute(item.path) || item.path.includes('..')) fail(`path de entrega inseguro: ${item.path}`);
  if (path.isAbsolute(item.source) || item.source.includes('..')) fail(`source inseguro: ${item.source}`);
  if (!allowedStatuses.has(item.status)) fail(`status não permitido em ${item.path}: ${item.status}`);

  const sourcePath = path.join(root, item.source);
  if (!fs.existsSync(sourcePath)) fail(`fonte ausente para ${item.path}: ${item.source}`);

  if (item.sha256 !== null) fail(`sha256 deve ser null no template: ${item.path}`);
}

const requiredDeliveryPaths = [
  '00_LEIA_PRIMEIRO/LEIA_PRIMEIRO.pdf',
  '01_METODO_JPN/METODO_JPN_v1.pdf',
  '02_PROMPT_PACK/JPN_PROMPT_PACK_v1.pdf',
  '02_PROMPT_PACK/PROMPT_INDEX.json',
  '03_JPN_BUSINESS/JPN_BUSINESS_v1.pdf',
  '03_JPN_BUSINESS/BUSINESS_INDEX.json',
  '04_PROMPT_BUILDER/instrucoes_de_acesso.txt',
  '05_GESTAO_FACIL/JPN_Gestao_Facil_v0.1_reconstruida.xlsx',
  '05_GESTAO_FACIL/MANUAL_GESTAO_FACIL_v1.pdf'
];

for (const requiredPath of requiredDeliveryPaths) {
  if (!seenDeliveryPaths.has(requiredPath)) fail(`entrada canônica ausente: ${requiredPath}`);
}

if (seenDeliveryPaths.size !== requiredDeliveryPaths.length) {
  fail(`template deve conter exatamente ${requiredDeliveryPaths.length} entradas canônicas`);
}

const byPath = new Map((manifest.files ?? []).map((item) => [item.path, item]));
const pendingPdfPaths = [
  '00_LEIA_PRIMEIRO/LEIA_PRIMEIRO.pdf',
  '01_METODO_JPN/METODO_JPN_v1.pdf',
  '02_PROMPT_PACK/JPN_PROMPT_PACK_v1.pdf',
  '03_JPN_BUSINESS/JPN_BUSINESS_v1.pdf',
  '05_GESTAO_FACIL/MANUAL_GESTAO_FACIL_v1.pdf'
];
for (const deliveryPath of pendingPdfPaths) {
  if (byPath.get(deliveryPath)?.status !== 'pending-final-artifact') {
    fail(`${deliveryPath} deve continuar pending-final-artifact antes do freeze`);
  }
}

if (byPath.get('02_PROMPT_PACK/PROMPT_INDEX.json')?.status !== 'source-present') fail('PROMPT_INDEX.json deve ser source-present');
if (byPath.get('03_JPN_BUSINESS/BUSINESS_INDEX.json')?.status !== 'source-present') fail('BUSINESS_INDEX.json deve ser source-present');
if (byPath.get('04_PROMPT_BUILDER/instrucoes_de_acesso.txt')?.status !== 'offline-delivery-defined') fail('Prompt Builder deve permanecer offline-delivery-defined');
if (byPath.get('05_GESTAO_FACIL/JPN_Gestao_Facil_v0.1_reconstruida.xlsx')?.status !== 'binary-versioned-local-qa-passed') {
  fail('Gestão Fácil deve permanecer binary-versioned-local-qa-passed até GF-QA-10');
}

const gateMap = new Map((gates.gates ?? []).map((gate) => [gate.id, gate]));
const expectedPendingGates = new Map([
  ['gestao-facil-cross-compat', 'pending-external-runtime'],
  ['visual-render-review', 'pending-render-review'],
  ['final-pdfs', 'pending-final-artifacts'],
  ['final-hashes', 'pending-freeze'],
  ['current-head-ci', 'pending-final-head']
]);
for (const [id, status] of expectedPendingGates) {
  if (gateMap.get(id)?.status !== status) fail(`gate ${id} deve permanecer ${status}`);
}

for (const id of ['editorial-sources', 'gestao-facil-binary', 'prompt-builder-release-decision']) {
  if (gateMap.get(id)?.status !== 'passed') fail(`gate ${id} deve permanecer passed com evidência existente`);
  if (!gateMap.get(id)?.evidence) fail(`gate ${id} precisa de evidence`);
}

const text = JSON.stringify(manifest).toLowerCase();
for (const forbidden of ['comprar agora', 'checkout', 'garantia de resultado', 'retorno garantido']) {
  if (text.includes(forbidden)) fail(`template contém linguagem comercial bloqueada: ${forbidden}`);
}

if (!process.exitCode) {
  console.log(`Pro Kit manifest contract OK: ${manifest.files.length} entradas canônicas; hashes e artefatos finais permanecem bloqueados até freeze real.`);
}
