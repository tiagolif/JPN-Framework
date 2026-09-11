import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifestPath = path.join(root, 'docs/products/jpn-business/COMPOSITION_SOURCE_MANIFEST_v1.json');
const mapPath = path.join(root, 'docs/products/jpn-business/COMPOSITION_MAP_v1.json');
const businessDocPath = path.join(root, 'docs/products/jpn-business/JPN_BUSINESS_v1.md');

const [manifestRaw, mapRaw, businessDoc] = await Promise.all([
  readFile(manifestPath, 'utf8'),
  readFile(mapPath, 'utf8'),
  readFile(businessDocPath, 'utf8'),
]);

const manifest = JSON.parse(manifestRaw);
const compositionMap = JSON.parse(mapRaw);
const failures = [];

if (manifest.product !== 'JPN Business') failures.push('produto incorreto no manifesto');
if (manifest.status !== 'composition-source-prep-only') failures.push(`status indevido: ${manifest.status ?? '<ausente>'}`);
if (manifest.release_effect !== 'none') failures.push('release_effect deve permanecer none');
if (manifest.map_source !== 'docs/products/jpn-business/COMPOSITION_MAP_v1.json') failures.push('map_source divergente');
if (manifest.rules?.human_review_required !== true) failures.push('human_review_required deve ser true');
if (manifest.rules?.missing_content !== 'flag-for-editorial-review-do-not-invent') failures.push('política de conteúdo ausente não preserva revisão editorial');

const expectedSections = [
  ...(compositionMap.front_matter ?? []).map((item) => ({ id: item.id, kind: 'front-matter' })),
  ...(compositionMap.playbooks ?? []).map((item) => ({ id: item.id, kind: 'playbook', name: item.name })),
  ...(compositionMap.back_matter ?? []).map((item) => ({ id: item.id, kind: 'back-matter' })),
];
const actualSections = Array.isArray(manifest.sections) ? manifest.sections : [];

if (actualSections.length !== expectedSections.length) {
  failures.push(`quantidade de seções divergente: manifesto=${actualSections.length}, mapa=${expectedSections.length}`);
}

const seen = new Set();
for (let index = 0; index < actualSections.length; index += 1) {
  const section = actualSections[index];
  const expected = expectedSections[index];
  if (!section?.id) {
    failures.push(`seção ${index + 1} sem id`);
    continue;
  }
  if (seen.has(section.id)) failures.push(`id duplicado no manifesto: ${section.id}`);
  seen.add(section.id);
  if (!expected) continue;
  if (section.id !== expected.id) failures.push(`ordem/id divergente na posição ${index + 1}: ${section.id} != ${expected.id}`);
  if (section.kind !== expected.kind) failures.push(`kind divergente em ${section.id}: ${section.kind} != ${expected.kind}`);
  if (!Array.isArray(section.sources) || section.sources.length === 0) failures.push(`sources ausente/vazio em ${section.id}`);
  if (!section.source_type?.trim()) failures.push(`source_type ausente em ${section.id}`);
  if (!section.source_anchor?.trim()) failures.push(`source_anchor ausente em ${section.id}`);

  for (const source of section.sources ?? []) {
    if (typeof source !== 'string' || !source.trim()) {
      failures.push(`fonte inválida em ${section.id}`);
      continue;
    }
    const sourcePath = path.join(root, source);
    if (!sourcePath.startsWith(root)) {
      failures.push(`fonte fora do repositório em ${section.id}: ${source}`);
      continue;
    }
    try {
      await access(sourcePath);
    } catch {
      failures.push(`fonte inexistente em ${section.id}: ${source}`);
    }
  }

  if (expected.kind === 'playbook') {
    if (section.source_type !== 'canonical-playbook') failures.push(`playbook ${section.id} deve usar canonical-playbook`);
    if (section.sources?.length !== 1 || section.sources[0] !== 'docs/products/jpn-business/JPN_BUSINESS_v1.md') {
      failures.push(`playbook ${section.id} deve apontar somente para JPN_BUSINESS_v1.md`);
    }
    const expectedHeading = `# Playbook ${expected.id} — ${expected.name}`;
    if (section.source_anchor !== expectedHeading) failures.push(`anchor divergente em ${section.id}`);
    if (!businessDoc.includes(expectedHeading)) failures.push(`heading canônico não encontrado em JPN_BUSINESS_v1.md: ${expectedHeading}`);
  }
}

const expectedIds = new Set(expectedSections.map((item) => item.id));
for (const section of actualSections) {
  if (section?.id && !expectedIds.has(section.id)) failures.push(`seção extra fora do mapa: ${section.id}`);
}

const forbiddenPromotion = /(?:diagramacao-final|pdf-final|freeze|release)[^\n]{0,40}\b(?:passed|approved|complete|completed)\b/i;
if (forbiddenPromotion.test(manifestRaw)) failures.push('manifesto contém promoção indevida de gate final');

for (const forbidden of ['guaranteed-sales', 'guaranteed-roi', 'automatic-publication']) {
  if (!compositionMap.guardrails?.includes(`no-${forbidden}`)) failures.push(`guardrail ausente no mapa: no-${forbidden}`);
}

if (failures.length) {
  console.error('Falha no gate de manifesto de fontes do JPN Business:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`JPN Business source manifest: consistente (${actualSections.length} seções rastreáveis; ${compositionMap.playbooks.length} playbooks canônicos).`);
