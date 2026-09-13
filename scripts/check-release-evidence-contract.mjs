import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const statusPath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const contractPath = path.join(root, 'docs/product-system/RELEASE_EVIDENCE_CONTRACT_v1.json');
const status = JSON.parse(await readFile(statusPath, 'utf8'));
const contract = JSON.parse(await readFile(contractPath, 'utf8'));
const errors = [];

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;
if (contract.version !== '1.0.0') errors.push('Contrato de evidência deve usar version 1.0.0.');
if (contract.status_source !== 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json') errors.push('status_source inválido.');
if (contract.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (contract.release_effect !== 'none') errors.push('release_effect deve permanecer none.');

const statusProducts = Array.isArray(status.products) ? status.products : [];
const contractProducts = Array.isArray(contract.products) ? contract.products : [];
const statusById = new Map(statusProducts.map((p) => [p.id, p]));
const contractById = new Map(contractProducts.map((p) => [p.id, p]));

if (statusProducts.length !== contractProducts.length) errors.push(`Cobertura de produtos diverge: status=${statusProducts.length}, contrato=${contractProducts.length}.`);

for (const product of statusProducts) {
  const spec = contractById.get(product.id);
  if (!spec) {
    errors.push(`${product.id}: ausente do contrato de evidência.`);
    continue;
  }
  const deps = Array.isArray(product.dependencies) ? product.dependencies : [];
  const gates = Array.isArray(spec.gates) ? spec.gates : [];
  const gateById = new Map(gates.map((g) => [g.id, g]));
  if (deps.length !== gates.length) errors.push(`${product.id}: quantidade de gates diverge do status.`);
  for (const dep of deps) {
    const gate = gateById.get(dep.id);
    if (!gate) {
      errors.push(`${product.id}/${dep.id}: gate ausente do contrato.`);
      continue;
    }
    if (!Array.isArray(gate.accepted_evidence) || gate.accepted_evidence.length === 0 || gate.accepted_evidence.some((x) => !nonEmpty(x))) errors.push(`${product.id}/${dep.id}: accepted_evidence inválido.`);
    if (!Array.isArray(gate.minimum_fields) || gate.minimum_fields.length === 0 || gate.minimum_fields.some((x) => !nonEmpty(x))) errors.push(`${product.id}/${dep.id}: minimum_fields inválido.`);
    if (!Array.isArray(gate.must_not_accept) || gate.must_not_accept.length === 0 || gate.must_not_accept.some((x) => !nonEmpty(x))) errors.push(`${product.id}/${dep.id}: must_not_accept inválido.`);
    if (dep.status === 'passed' && !nonEmpty(dep.evidence)) errors.push(`${product.id}/${dep.id}: status passed exige evidence no contrato de status.`);
  }
  for (const gate of gates) if (!deps.some((d) => d.id === gate.id)) errors.push(`${product.id}/${gate.id}: gate existe no contrato mas não no status.`);
}

for (const product of contractProducts) if (!statusById.has(product.id)) errors.push(`${product.id}: produto desconhecido no contrato.`);

const builder = contractById.get('jpn-prompt-builder');
const mobile = builder?.gates?.find((g) => g.id === 'qa-fisico-contextual-celular');
if (!mobile?.accepted_evidence?.some((x) => /dispositivo móvel real/i.test(x))) errors.push('Prompt Builder deve exigir dispositivo móvel real.');
const gestao = contractById.get('jpn-gestao-facil');
const gf = gestao?.gates?.find((g) => g.id === 'gf-qa-10');
const gfText = JSON.stringify(gf ?? {});
for (const platform of ['Excel', 'LibreOffice Calc', 'Google Sheets']) if (!gfText.includes(platform)) errors.push(`GF-QA-10 deve citar ${platform}.`);
const proKit = contractById.get('jpn-pro-kit');
const hashes = proKit?.gates?.find((g) => g.id === 'hashes-finais');
if (!JSON.stringify(hashes ?? {}).includes('SHA256SUMS')) errors.push('Pro Kit hashes-finais deve exigir SHA256SUMS.');

try { await access(path.join(root, 'docs/product-system/RELEASE_EVIDENCE_CONTRACT_v1.md')); } catch { errors.push('Documentação MD do contrato de evidência ausente.'); }

if (errors.length) {
  console.error('Release evidence contract check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Release evidence contract check OK: ${contractProducts.length} produtos e ${contractProducts.reduce((n,p)=>n+p.gates.length,0)} gates cobertos.`);