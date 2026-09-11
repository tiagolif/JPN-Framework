import { readFile } from 'node:fs/promises';

const businessDocPath = new URL('../docs/products/jpn-business/JPN_BUSINESS_v1.md', import.meta.url);
const businessIndexPath = new URL('../docs/products/jpn-business/BUSINESS_INDEX.json', import.meta.url);
const promptIndexPath = new URL('../docs/products/prompt-pack/PROMPT_INDEX.json', import.meta.url);
const compositionSpecPath = new URL('../docs/products/jpn-business/COMPOSITION_SPEC_v1.md', import.meta.url);

const [businessDoc, businessIndexRaw, promptIndexRaw, compositionSpec] = await Promise.all([
  readFile(businessDocPath, 'utf8'),
  readFile(businessIndexPath, 'utf8'),
  readFile(promptIndexPath, 'utf8'),
  readFile(compositionSpecPath, 'utf8'),
]);

const businessIndex = JSON.parse(businessIndexRaw);
const promptIndex = JSON.parse(promptIndexRaw);
const failures = [];

const playbooks = Array.isArray(businessIndex.playbooks) ? businessIndex.playbooks : [];
const prompts = Array.isArray(promptIndex.templates) ? promptIndex.templates : [];
const promptIds = new Set(prompts.map((item) => item.id));

const requiredSpecSections = [
  '## Formato-base',
  '## Hierarquia editorial',
  '## Componentes visuais',
  '## Regras de conteúdo',
  '## Identidade visual',
  '## Critérios para considerar a composição congelada',
];

for (const section of requiredSpecSections) {
  if (!compositionSpec.includes(section)) failures.push(`seção obrigatória ausente na especificação: ${section}`);
}

if (playbooks.length !== 12) failures.push(`JPN Business deve conter 12 playbooks; encontrado: ${playbooks.length}`);
if (prompts.length !== 18) failures.push(`Prompt Pack deve conter 18 templates; encontrado: ${prompts.length}`);

for (let number = 1; number <= 12; number += 1) {
  const id = `JB-${String(number).padStart(2, '0')}`;
  const occurrences = businessDoc.match(new RegExp(`^# Playbook ${id}\\b`, 'gm'))?.length ?? 0;
  if (occurrences !== 1) failures.push(`${id} deve aparecer uma vez como cabeçalho de playbook; encontrado: ${occurrences}`);
}

for (const playbook of playbooks) {
  if (!/^JB-\d{2}$/.test(playbook.id ?? '')) failures.push(`ID JB inválido: ${playbook.id ?? '<ausente>'}`);
  if (!playbook.name?.trim()) failures.push(`nome ausente em ${playbook.id ?? '<sem-id>'}`);
  if (!Array.isArray(playbook.prompt_pack_links) || playbook.prompt_pack_links.length === 0) {
    failures.push(`referência PP-* ausente em ${playbook.id ?? '<sem-id>'}`);
    continue;
  }
  for (const ppId of playbook.prompt_pack_links) {
    if (!/^PP-\d{2}$/.test(ppId)) failures.push(`referência PP inválida em ${playbook.id}: ${ppId}`);
    if (!promptIds.has(ppId)) failures.push(`${playbook.id} referencia template inexistente: ${ppId}`);
  }
}

const requiredPlaybookFields = [
  '**Processo de negócio:**',
  '**Resultado pretendido:**',
  '**Responsável típico:**',
  '**Entradas:**',
  '**Restrições:**',
  '**Passos:**',
  '**Pontos de decisão:**',
  '**Saída:**',
  '**Como validar:**',
  '**O que registrar para continuidade:**',
  '**Riscos:**',
  '**JPN usado:**',
];

const playbookBlocks = businessDoc.split(/^# Playbook JB-\d{2}\b/gm).slice(1);
if (playbookBlocks.length !== 12) {
  failures.push(`não foi possível segmentar exatamente 12 blocos de playbook; encontrado: ${playbookBlocks.length}`);
} else {
  playbookBlocks.forEach((block, index) => {
    const id = `JB-${String(index + 1).padStart(2, '0')}`;
    for (const field of requiredPlaybookFields) {
      if (!block.includes(field)) failures.push(`${id} sem campo obrigatório: ${field}`);
    }
  });
}

const prohibitedPatterns = [
  [/ROI garantid[oa]/iu, 'claim de ROI garantido'],
  [/garantia de vendas/iu, 'claim de garantia de vendas'],
  [/elimina(?:r|ção)? (?:as )?alucinaç/iu, 'claim de eliminação de alucinações'],
  [/100% (?:precis|corret|privad|segur)/iu, 'claim absoluto de 100%'],
  [/R\$\s?\d/iu, 'valor monetário em real'],
];

for (const [pattern, label] of prohibitedPatterns) {
  if (pattern.test(businessDoc)) failures.push(`conteúdo bloqueado detectado: ${label}`);
}

if (!compositionSpec.includes('Até lá, a composição permanece `in-progress`.')) {
  failures.push('a especificação deve preservar diagramacao-final como in-progress até QA humano completo');
}

if (failures.length) {
  console.error('Falha no preflight estrutural de composição do JPN Business:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const linkedPromptIds = new Set(playbooks.flatMap((item) => item.prompt_pack_links));
console.log(
  `JPN Business composição: preflight estrutural aprovado para preparação de candidato ` +
  `(${playbooks.length} playbooks, ${linkedPromptIds.size} templates PP-* referenciados).`,
);
console.log('Este gate não aprova diagramação, PDF, revisão editorial humana ou release.');
