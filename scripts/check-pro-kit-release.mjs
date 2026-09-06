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
  'docs/products/gestao-facil/MANUAL_v0.1.md',
  'docs/products/gestao-facil/QA_EXECUTION_v0.1.md',
  'deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx',
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

const gestaoXlsx = manifest.files.find((item) => item.path.endsWith('JPN_Gestao_Facil_v0.1_reconstruida.xlsx'));
if (!gestaoXlsx) {
  throw new Error('Manifesto não referencia o XLSX reconstruído da Gestão Fácil');
}
if (gestaoXlsx.status !== 'binary-versioned-local-qa-passed') {
  throw new Error(`Status inesperado do XLSX da Gestão Fácil: ${gestaoXlsx.status}`);
}
if (gestaoXlsx.source !== 'deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx') {
  throw new Error('Fonte do XLSX da Gestão Fácil diverge do binário versionado');
}

const gestaoManual = manifest.files.find((item) => item.path.includes('05_GESTAO_FACIL/') && item.path.endsWith('.pdf'));
if (!gestaoManual) {
  throw new Error('Manifesto não referencia o manual final planejado da Gestão Fácil');
}
if (gestaoManual.source !== 'docs/products/gestao-facil/MANUAL_v0.1.md' || gestaoManual.status !== 'pending-final-artifact') {
  throw new Error('Manual da Gestão Fácil deve apontar para a fonte v0.1 e permanecer pendente de artefato final');
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

console.log(`PASS: estrutura Pro Kit verificada (${requiredSources.length} fontes, ${manifest.files.length} entradas no manifesto; Gestão Fácil versionada com QA local)`);
