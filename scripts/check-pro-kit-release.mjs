import { existsSync, readFileSync } from 'node:fs';

const requiredSources = [
  'docs/products/pro-kit/LEIA_PRIMEIRO.md',
  'docs/products/pro-kit/DELIVERY_MAP.md',
  'docs/products/pro-kit/RELEASE_CHECKLIST.md',
  'docs/products/pro-kit/MANIFEST.template.json',
  'docs/products/pro-kit/RELEASE_NOTES_v1.md',
  'docs/products/metodo-jpn/METODO_JPN_v1.md',
  'docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md',
  'docs/products/prompt-pack/PROMPT_INDEX.json',
  'docs/products/jpn-business/JPN_BUSINESS_v1.md',
  'docs/products/jpn-business/BUSINESS_INDEX.json',
  'product-site/app.js'
];

const missing = requiredSources.filter((path) => !existsSync(path));
if (missing.length) {
  throw new Error(`Pro Kit referencia fontes ausentes: ${missing.join(', ')}`);
}

const manifest = JSON.parse(readFileSync('docs/products/pro-kit/MANIFEST.template.json', 'utf8'));
if (manifest.framework_base !== '0.3.0-draft') {
  throw new Error(`Base do manifesto divergente: ${manifest.framework_base}`);
}
if (manifest.status !== 'release-candidate-internal') {
  throw new Error(`Status inesperado do manifesto: ${manifest.status}`);
}

const paths = manifest.files.map((item) => item.path);
if (new Set(paths).size !== paths.length) {
  throw new Error('MANIFEST.template.json contém caminhos duplicados');
}

const gestao = manifest.files.filter((item) => item.path.includes('05_GESTAO_FACIL/'));
if (gestao.length < 2 || gestao.some((item) => item.status !== 'pending-import-and-versioning' || item.source !== null)) {
  throw new Error('Gestão Fácil deve permanecer explicitamente pendente até seus artefatos serem rastreados');
}

if (manifest.files.some((item) => item.sha256 !== null)) {
  throw new Error('Template não deve conter hashes antes do congelamento dos artefatos finais');
}

const textFiles = [
  'docs/products/pro-kit/LEIA_PRIMEIRO.md',
  'docs/products/pro-kit/DELIVERY_MAP.md',
  'docs/products/pro-kit/RELEASE_NOTES_v1.md'
];
const commercialText = textFiles.map((path) => readFileSync(path, 'utf8')).join('\n').toLowerCase();
const forbiddenClaims = [
  /elimina(?:r|) alucinações/,
  /garante vendas/,
  /garante produtividade/,
  /garante resultado/,
  /melhora(?:r|) .*\b\d+%/,
  /reduz(?:ir|) .*\b\d+%/
];
for (const pattern of forbiddenClaims) {
  if (pattern.test(commercialText)) {
    throw new Error(`Claim bloqueado encontrado no Pro Kit: ${pattern}`);
  }
}

console.log(`PASS: estrutura Pro Kit verificada (${requiredSources.length} fontes, ${manifest.files.length} entradas no manifesto)`);
