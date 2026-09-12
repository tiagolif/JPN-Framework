import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const business = JSON.parse(await readFile(path.join(root, 'docs/products/jpn-business/BUSINESS_INDEX.json'), 'utf8'));
const prompts = JSON.parse(await readFile(path.join(root, 'docs/products/prompt-pack/PROMPT_INDEX.json'), 'utf8'));
const crosswalk = JSON.parse(await readFile(path.join(root, 'docs/products/jpn-business/PROMPT_PACK_CROSSWALK_v1.json'), 'utf8'));

const errors = [];
const businessRows = Array.isArray(business.playbooks) ? business.playbooks : [];
const promptRows = Array.isArray(prompts.templates) ? prompts.templates : [];
const crossRows = Array.isArray(crosswalk.playbooks) ? crosswalk.playbooks : [];
const promptIds = new Set(promptRows.map((item) => item.id));
const businessById = new Map(businessRows.map((item) => [item.id, item]));
const seen = new Set();

if (crosswalk.version !== '1.0.0') errors.push('Crosswalk deve usar version 1.0.0.');
if (crossRows.length !== businessRows.length) errors.push(`Crosswalk deve cobrir exatamente ${businessRows.length} playbooks; recebeu ${crossRows.length}.`);

for (const row of crossRows) {
  if (!businessById.has(row.id)) errors.push(`${row.id}: playbook inexistente em BUSINESS_INDEX.json.`);
  if (seen.has(row.id)) errors.push(`${row.id}: playbook duplicado no crosswalk.`);
  seen.add(row.id);
  if (typeof row.name !== 'string' || row.name.trim() === '') errors.push(`${row.id}: name ausente.`);
  if (typeof row.use !== 'string' || row.use.trim().length < 20) errors.push(`${row.id}: orientação de uso insuficiente.`);
  if (!Array.isArray(row.prompt_ids) || row.prompt_ids.length === 0) errors.push(`${row.id}: prompt_ids deve conter ao menos um prompt.`);

  const source = businessById.get(row.id);
  if (source) {
    const expected = [...(source.prompt_pack_links ?? [])].sort();
    const actual = [...(row.prompt_ids ?? [])].sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      errors.push(`${row.id}: prompt_ids diverge de BUSINESS_INDEX.json (${actual.join(', ')} != ${expected.join(', ')}).`);
    }
    if (row.name !== source.name) errors.push(`${row.id}: name diverge de BUSINESS_INDEX.json.`);
  }

  for (const promptId of row.prompt_ids ?? []) {
    if (!promptIds.has(promptId)) errors.push(`${row.id}: prompt inexistente em PROMPT_INDEX.json: ${promptId}.`);
  }
}

for (const source of businessRows) {
  if (!seen.has(source.id)) errors.push(`${source.id}: ausente do crosswalk.`);
}

const text = JSON.stringify(crosswalk).toLowerCase();
const risky = [
  /resultado garantido/,
  /roi garantido/,
  /publica[cç][aã]o autom[aá]tica/,
  /envio autom[aá]tico/,
  /compra autom[aá]tica/,
  /substitui revis[aã]o humana/,
];
for (const pattern of risky) {
  if (pattern.test(text)) errors.push(`Crosswalk contém claim ou automação indevida: ${pattern}.`);
}

if (errors.length > 0) {
  console.error('Business × Prompt Pack crosswalk check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Business × Prompt Pack crosswalk OK: ${crossRows.length} playbooks e ${promptIds.size} prompts validados.`);
