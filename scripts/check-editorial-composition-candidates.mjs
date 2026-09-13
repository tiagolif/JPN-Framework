import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contractPath = path.join(root, 'docs/product-system/EDITORIAL_COMPOSITION_CANDIDATES_v1.json');
const preflightPath = path.join(root, 'docs/product-system/EDITORIAL_PREFLIGHT_v1.json');
const releasePath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');

const contract = JSON.parse(await readFile(contractPath, 'utf8'));
const preflight = JSON.parse(await readFile(preflightPath, 'utf8'));
const release = JSON.parse(await readFile(releasePath, 'utf8'));
const errors = [];

const preflightById = new Map((preflight.products ?? []).map((item) => [item.product_id, item]));
const releaseById = new Map((release.products ?? []).map((item) => [item.id, item]));
const expectedIds = ['metodo-jpn', 'jpn-prompt-pack', 'jpn-business'];
const seen = new Set();

if (contract.version !== '1.0.0') errors.push('EDITORIAL_COMPOSITION_CANDIDATES_v1.json deve usar version 1.0.0.');
if (contract.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (contract.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (contract.output_root !== 'dist/editorial-candidates') errors.push('output_root deve permanecer em dist/editorial-candidates.');

for (const product of contract.products ?? []) {
  if (!expectedIds.includes(product.product_id)) errors.push(`produto inesperado: ${product.product_id}`);
  if (seen.has(product.product_id)) errors.push(`produto duplicado: ${product.product_id}`);
  seen.add(product.product_id);

  const pf = preflightById.get(product.product_id);
  if (!pf) {
    errors.push(`${product.product_id}: ausente do preflight editorial.`);
    continue;
  }
  if (JSON.stringify(product.sources ?? []) !== JSON.stringify(pf.primary_sources ?? [])) {
    errors.push(`${product.product_id}: sources divergem de primary_sources do preflight.`);
  }
  if (product.blocked_final_artifact !== pf.target_artifact) {
    errors.push(`${product.product_id}: blocked_final_artifact diverge do target_artifact do preflight.`);
  }
  if (typeof product.output_file !== 'string' || !product.output_file.endsWith('_CANDIDATO.md')) {
    errors.push(`${product.product_id}: output_file deve terminar em _CANDIDATO.md.`);
  }
  for (const source of product.sources ?? []) {
    if (source.startsWith('dist/')) errors.push(`${product.product_id}: fonte não pode vir de dist/: ${source}`);
    try { await access(path.join(root, source)); }
    catch { errors.push(`${product.product_id}: fonte inexistente: ${source}`); }
  }

  const releaseProduct = releaseById.get(product.product_id);
  if (!releaseProduct) errors.push(`${product.product_id}: sem contrato de release.`);
  else {
    const pdfGate = (releaseProduct.dependencies ?? []).find((item) => item.id === 'pdf-final');
    if (!pdfGate) errors.push(`${product.product_id}: gate pdf-final ausente.`);
    if (pdfGate?.status === 'passed' && !pdfGate.evidence) errors.push(`${product.product_id}: pdf-final passed sem evidência.`);
  }
}

for (const id of expectedIds) if (!seen.has(id)) errors.push(`produto editorial ausente: ${id}`);
if ((contract.products ?? []).length !== expectedIds.length) errors.push(`esperados ${expectedIds.length} produtos; encontrados ${(contract.products ?? []).length}.`);

const notices = (contract.candidate_header?.required_notices ?? []).join(' ').toLowerCase();
for (const required of ['revisão editorial humana', 'pdf final', 'não publicar']) {
  if (!notices.includes(required)) errors.push(`aviso obrigatório ausente no cabeçalho candidato: ${required}`);
}

const guardrails = (contract.guardrails ?? []).join(' ').toLowerCase();
for (const required of ['pdf final', 'revisão humana', 'dados reais', 'publicar']) {
  if (!guardrails.includes(required)) errors.push(`guardrail ausente: ${required}`);
}

for (const required of ['product_id', 'output_file', 'generated_at', 'source_files', 'source_sha256', 'candidate_sha256', 'release_ready']) {
  if (!(contract.manifest_requirements ?? []).includes(required)) errors.push(`manifest_requirements ausente: ${required}`);
}

if (errors.length > 0) {
  console.error('Editorial composition candidates check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Editorial composition candidates check OK: ${expectedIds.length} produtos, fontes, artefatos bloqueados e guardrails validados.`);
