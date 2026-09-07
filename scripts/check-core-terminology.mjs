import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contractPath = path.join(root, 'docs/product-system/CORE_TERMINOLOGY_v1.json');

const monitoredFiles = [
  'docs/products/metodo-jpn/METODO_JPN_v1.md',
  'docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md',
  'docs/products/jpn-business/JPN_BUSINESS_v1.md',
  'docs/products/pro-kit/LEIA_PRIMEIRO.md',
  'docs/commercial/COMMERCIAL_MESSAGING_v1.md',
  'docs/commercial/PRODUCT_PAGE_SYSTEM_v1.md',
  'docs/commercial/SALES_PAGE_COPY_v1.md',
  'product-site/index.html'
];

function fail(message) {
  console.error(`✖ ${message}`);
  process.exitCode = 1;
}

function read(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    fail(`arquivo monitorado ausente: ${relPath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function hasAffirmativeClaim(content, claim) {
  const normalized = content.toLocaleLowerCase('pt-BR');
  let from = 0;
  while (from < normalized.length) {
    const index = normalized.indexOf(claim, from);
    if (index === -1) return false;

    const prefix = normalized.slice(Math.max(0, index - 48), index);
    const lastBoundary = Math.max(prefix.lastIndexOf('\n'), prefix.lastIndexOf('.'), prefix.lastIndexOf(';'), prefix.lastIndexOf(':'));
    const localPrefix = prefix.slice(lastBoundary + 1);
    const negated = /\b(não|nao|nem|evita afirmar que|sem afirmar que|não afirmar que|nao afirmar que)\b/.test(localPrefix);

    if (!negated) return true;
    from = index + claim.length;
  }
  return false;
}

if (!fs.existsSync(contractPath)) {
  console.error('✖ contrato de terminologia ausente');
  process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

if (contract?.framework?.canonical_name !== 'JPN Framework') {
  fail('nome canônico do framework deve ser JPN Framework');
}
if (contract?.framework?.canonical_expansion !== 'Jornada, Precisão e Narrativa') {
  fail('expansão canônica de JPN divergiu');
}

const expectedPillars = ['Jornada', 'Precisão', 'Narrativa'];
if (JSON.stringify(contract?.framework?.pillars) !== JSON.stringify(expectedPillars)) {
  fail('pilares devem permanecer na ordem Jornada → Precisão → Narrativa');
}

const products = Array.isArray(contract.products) ? contract.products : [];
const ids = products.map((item) => item.id);
const names = products.map((item) => item.canonical_name);
if (new Set(ids).size !== ids.length) fail('IDs de produto duplicados no contrato');
if (new Set(names).size !== names.length) fail('nomes canônicos duplicados no contrato');
if (products.length !== 6) fail(`esperados 6 produtos canônicos; encontrados ${products.length}`);

for (const item of products) {
  if (!item.id || !item.canonical_name || !item.kind) {
    fail('produto com campos obrigatórios ausentes no contrato');
  }
}

const discouraged = Array.isArray(contract.discouraged_claims)
  ? contract.discouraged_claims.map((claim) => claim.toLocaleLowerCase('pt-BR'))
  : [];
if (discouraged.length < 8) fail('lista de claims bloqueados está curta demais');

for (const relPath of monitoredFiles) {
  const content = read(relPath);
  for (const claim of discouraged) {
    if (hasAffirmativeClaim(content, claim)) {
      fail(`claim afirmativo bloqueado "${claim}" encontrado em ${relPath}`);
    }
  }
}

const requiredPresence = new Map([
  ['docs/products/metodo-jpn/METODO_JPN_v1.md', ['Método JPN', 'Jornada', 'Precisão', 'Narrativa']],
  ['docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md', ['JPN Prompt Pack', 'Jornada', 'Precisão', 'Narrativa']],
  ['docs/products/jpn-business/JPN_BUSINESS_v1.md', ['JPN Business', 'Jornada', 'Precisão', 'Narrativa']],
  ['docs/products/pro-kit/LEIA_PRIMEIRO.md', ['JPN Pro Kit']],
  ['product-site/index.html', ['JPN Prompt Builder']]
]);

for (const [relPath, terms] of requiredPresence) {
  const content = read(relPath);
  for (const term of terms) {
    if (!content.includes(term)) fail(`termo canônico "${term}" ausente em ${relPath}`);
  }
}

if (!process.exitCode) {
  console.log(`✔ terminologia central validada em ${monitoredFiles.length} arquivos`);
}
