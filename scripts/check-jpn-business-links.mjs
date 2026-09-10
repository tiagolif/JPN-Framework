import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const businessIndexPath = new URL('../docs/products/jpn-business/BUSINESS_INDEX.json', import.meta.url);
const businessDocPath = new URL('../docs/products/jpn-business/JPN_BUSINESS_v1.md', import.meta.url);
const promptIndexPath = new URL('../docs/products/prompt-pack/PROMPT_INDEX.json', import.meta.url);
const promptDocPath = new URL('../docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md', import.meta.url);

const [businessIndexRaw, businessDoc, promptIndexRaw, promptDoc] = await Promise.all([
  readFile(businessIndexPath, 'utf8'),
  readFile(businessDocPath, 'utf8'),
  readFile(promptIndexPath, 'utf8'),
  readFile(promptDocPath, 'utf8'),
]);

const businessIndex = JSON.parse(businessIndexRaw);
const promptIndex = JSON.parse(promptIndexRaw);
const failures = [];

const businessItems = Array.isArray(businessIndex.playbooks) ? businessIndex.playbooks : [];
const promptItems = Array.isArray(promptIndex.templates) ? promptIndex.templates : [];

if (businessIndex.product !== 'JPN Business') failures.push('produto incorreto em BUSINESS_INDEX.json');
if (promptIndex.product !== 'JPN Prompt Pack') failures.push('produto incorreto em PROMPT_INDEX.json');
if (!businessIndex.version) failures.push('versão ausente em BUSINESS_INDEX.json');
if (!promptIndex.product_version) failures.push('versão ausente em PROMPT_INDEX.json');
if (!businessIndex.framework_base || !promptIndex.framework_base) failures.push('framework_base ausente em um dos índices');
if (businessIndex.framework_base !== promptIndex.framework_base) {
  failures.push(`framework_base divergente: Business=${businessIndex.framework_base}, Prompt Pack=${promptIndex.framework_base}`);
}

function duplicates(values) {
  const seen = new Set();
  const duplicateSet = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicateSet.add(value);
    seen.add(value);
  }
  return [...duplicateSet];
}

const businessIds = businessItems.map((item) => item.id);
const promptIds = promptItems.map((item) => item.id);
const duplicateBusinessIds = duplicates(businessIds);
const duplicatePromptIds = duplicates(promptIds);
if (duplicateBusinessIds.length) failures.push(`IDs JB duplicados: ${duplicateBusinessIds.join(', ')}`);
if (duplicatePromptIds.length) failures.push(`IDs PP duplicados: ${duplicatePromptIds.join(', ')}`);

const promptIdSet = new Set(promptIds);
let linkCount = 0;

for (const item of businessItems) {
  if (!/^JB-\d{2}$/.test(item.id ?? '')) failures.push(`ID de playbook inválido: ${item.id ?? '<ausente>'}`);
  if (!item.name?.trim()) failures.push(`nome ausente em ${item.id ?? '<sem-id>'}`);
  if (!item.category?.trim()) failures.push(`categoria ausente em ${item.id ?? '<sem-id>'}`);
  if (!Array.isArray(item.prompt_pack_links) || item.prompt_pack_links.length === 0) {
    failures.push(`prompt_pack_links ausente/vazio em ${item.id ?? '<sem-id>'}`);
    continue;
  }
  if (!businessDoc.includes(item.id)) failures.push(`${item.id} não encontrado no documento humano do JPN Business`);
  for (const linkedId of item.prompt_pack_links) {
    linkCount += 1;
    if (!promptIdSet.has(linkedId)) failures.push(`${item.id} referencia Prompt Pack inexistente: ${linkedId}`);
    if (!promptDoc.includes(linkedId)) failures.push(`${linkedId}, referenciado por ${item.id}, não aparece no documento humano do Prompt Pack`);
  }
}

for (const prompt of promptItems) {
  if (!/^PP-\d{2}$/.test(prompt.id ?? '')) failures.push(`ID de prompt inválido: ${prompt.id ?? '<ausente>'}`);
  if (!prompt.name?.trim()) failures.push(`nome ausente em ${prompt.id ?? '<sem-id>'}`);
  if (!prompt.category?.trim()) failures.push(`categoria ausente em ${prompt.id ?? '<sem-id>'}`);
  if (!promptDoc.includes(prompt.id)) failures.push(`${prompt.id} não encontrado no documento humano do Prompt Pack`);
}

if (businessItems.length !== 12) failures.push(`quantidade inesperada de playbooks Business: ${businessItems.length} (esperado: 12)`);
if (promptItems.length !== 18) failures.push(`quantidade inesperada de prompts no Pack: ${promptItems.length} (esperado: 18)`);

if (failures.length) {
  console.error('Falha no gate de consistência JPN Business ↔ Prompt Pack:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const linkedPromptIds = new Set(businessItems.flatMap((item) => item.prompt_pack_links));
console.log(`JPN Business ↔ Prompt Pack: consistente (${businessItems.length} playbooks, ${promptItems.length} prompts, ${linkCount} vínculos, ${linkedPromptIds.size} prompts referenciados).`);

const quickReferenceCheck = fileURLToPath(new URL('./check-jpn-business-quick-reference.mjs', import.meta.url));
execFileSync(process.execPath, [quickReferenceCheck], { stdio: 'inherit' });

const implementationWorkbookCheck = fileURLToPath(new URL('./check-jpn-business-implementation-workbook.mjs', import.meta.url));
execFileSync(process.execPath, [implementationWorkbookCheck], { stdio: 'inherit' });

const outcomeReviewCheck = fileURLToPath(new URL('./check-jpn-business-30-day-review.mjs', import.meta.url));
execFileSync(process.execPath, [outcomeReviewCheck], { stdio: 'inherit' });
