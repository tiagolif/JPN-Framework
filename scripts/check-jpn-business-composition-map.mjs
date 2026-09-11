import { readFile } from 'node:fs/promises';

const mapPath = new URL('../docs/products/jpn-business/COMPOSITION_MAP_v1.json', import.meta.url);
const businessIndexPath = new URL('../docs/products/jpn-business/BUSINESS_INDEX.json', import.meta.url);
const promptIndexPath = new URL('../docs/products/prompt-pack/PROMPT_INDEX.json', import.meta.url);
const specPath = new URL('../docs/products/jpn-business/COMPOSITION_SPEC_v1.md', import.meta.url);

const [mapRaw, businessRaw, promptRaw, spec] = await Promise.all([
  readFile(mapPath, 'utf8'),
  readFile(businessIndexPath, 'utf8'),
  readFile(promptIndexPath, 'utf8'),
  readFile(specPath, 'utf8'),
]);

const map = JSON.parse(mapRaw);
const business = JSON.parse(businessRaw);
const prompt = JSON.parse(promptRaw);
const failures = [];

const expectedBlocks = [
  'objetivo',
  'quando-usar',
  'entradas',
  'passos-jpn',
  'prompts-relacionados',
  'saida-esperada',
  'criterios-revisao',
  'riscos-limites',
];
const expectedCallouts = ['atencao', 'exemplo', 'checklist', 'conexao-jpn'];
const expectedFrontMatter = ['cover', 'scope', 'toc', 'how-to-use', 'method-foundations'];
const expectedBackMatter = ['prompt-cross-reference', 'application-checklist', 'limits'];

function sameArray(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]);
}

function duplicates(values) {
  const seen = new Set();
  const dup = new Set();
  for (const value of values) {
    if (seen.has(value)) dup.add(value);
    seen.add(value);
  }
  return [...dup];
}

if (map.product !== 'JPN Business') failures.push('COMPOSITION_MAP: product deve ser JPN Business');
if (map.framework_base !== business.framework_base) failures.push('COMPOSITION_MAP: framework_base diverge de BUSINESS_INDEX');
if (map.status !== 'composition-prep-only') failures.push('COMPOSITION_MAP: status deve permanecer composition-prep-only');
if (map.release_effect !== 'none') failures.push('COMPOSITION_MAP: release_effect deve permanecer none');
if (!String(map.promotion_rule ?? '').includes('cannot set diagramacao-final')) failures.push('COMPOSITION_MAP: promotion_rule deve bloquear promoção automática');

const frontIds = (map.front_matter ?? []).map((item) => item.id);
const backIds = (map.back_matter ?? []).map((item) => item.id);
if (!sameArray(frontIds, expectedFrontMatter)) failures.push(`front_matter divergente: ${frontIds.join(', ')}`);
if (!sameArray(backIds, expectedBackMatter)) failures.push(`back_matter divergente: ${backIds.join(', ')}`);
if ((map.front_matter ?? []).some((item) => item.required !== true)) failures.push('front_matter contém seção não obrigatória');
if ((map.back_matter ?? []).some((item) => item.required !== true)) failures.push('back_matter contém seção não obrigatória');
if (!sameArray(map.callout_types, expectedCallouts)) failures.push('callout_types diverge da especificação');

const sourcePlaybooks = Array.isArray(business.playbooks) ? business.playbooks : [];
const mappedPlaybooks = Array.isArray(map.playbooks) ? map.playbooks : [];
if (mappedPlaybooks.length !== 12) failures.push(`COMPOSITION_MAP: ${mappedPlaybooks.length} playbooks; esperado 12`);
if (sourcePlaybooks.length !== 12) failures.push(`BUSINESS_INDEX: ${sourcePlaybooks.length} playbooks; esperado 12`);

const mappedIds = mappedPlaybooks.map((item) => item.id);
const duplicateMappedIds = duplicates(mappedIds);
if (duplicateMappedIds.length) failures.push(`COMPOSITION_MAP: IDs duplicados: ${duplicateMappedIds.join(', ')}`);

const promptIds = new Set((prompt.templates ?? []).map((item) => item.id));
for (let index = 0; index < sourcePlaybooks.length; index += 1) {
  const source = sourcePlaybooks[index];
  const mapped = mappedPlaybooks[index];
  if (!mapped) continue;

  if (mapped.order !== index + 1) failures.push(`${mapped.id ?? '<sem-id>'}: order inválida`);
  if (mapped.id !== source.id) failures.push(`ordem/ID divergente em ${index + 1}: mapa=${mapped.id}, índice=${source.id}`);
  if (mapped.name !== source.name) failures.push(`${source.id}: nome divergente`);
  if (mapped.category !== source.category) failures.push(`${source.id}: categoria divergente`);
  if (!sameArray(mapped.prompt_pack_links, source.prompt_pack_links)) failures.push(`${source.id}: vínculos PP-* divergem de BUSINESS_INDEX`);
  if (!sameArray(mapped.required_blocks, expectedBlocks)) failures.push(`${source.id}: required_blocks incompletos ou fora de ordem`);

  for (const ppId of mapped.prompt_pack_links ?? []) {
    if (!promptIds.has(ppId)) failures.push(`${source.id}: vínculo inexistente no Prompt Pack: ${ppId}`);
  }
}

const specRequirements = [
  'Capa: JPN Business',
  'Página de abertura: escopo do produto, público e guardrails',
  'Sumário',
  'Como usar o material',
  'Fundamentos do Método JPN aplicados a negócios',
  'Playbooks JB-01 a JB-12',
  'Referência cruzada para prompts PP-*',
  'Checklist final de aplicação e revisão humana',
  'Avisos de uso e limites',
  '**Atenção**',
  '**Exemplo**',
  '**Checklist**',
  '**Conexão JPN**',
];
for (const requirement of specRequirements) {
  if (!spec.includes(requirement)) failures.push(`COMPOSITION_SPEC perdeu requisito esperado: ${requirement}`);
}

const forbiddenPromotionTerms = [
  /"status"\s*:\s*"(?:passed|released|final)"/i,
  /"release_effect"\s*:\s*"(?:promote|pass|release)"/i,
  /"diagramacao-final"\s*:\s*"passed"/i,
  /"pdf-final"\s*:\s*"passed"/i,
];
for (const pattern of forbiddenPromotionTerms) {
  if (pattern.test(mapRaw)) failures.push(`COMPOSITION_MAP contém promoção proibida: ${pattern}`);
}

if (failures.length) {
  console.error('Falha no gate do mapa de composição do JPN Business:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const linkCount = mappedPlaybooks.reduce((sum, item) => sum + (item.prompt_pack_links?.length ?? 0), 0);
console.log(`Mapa de composição JPN Business: consistente (${mappedPlaybooks.length} playbooks, ${linkCount} vínculos PP-*, ${map.front_matter.length} seções iniciais, ${map.back_matter.length} seções finais).`);
