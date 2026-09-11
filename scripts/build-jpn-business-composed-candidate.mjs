import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const checkOnly = process.argv.includes('--check');

const mapPath = join(root, 'docs/products/jpn-business/COMPOSITION_MAP_v1.json');
const sourceManifestPath = join(root, 'docs/products/jpn-business/COMPOSITION_SOURCE_MANIFEST_v1.json');
const promptIndexPath = join(root, 'docs/products/prompt-pack/PROMPT_INDEX.json');
const candidateHtmlPath = join(root, 'dist/editorial-print-staging/jpn-business/index.html');
const candidateManifestPath = join(root, 'dist/editorial-print-staging/jpn-business/candidate-manifest.json');

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function fail(message) {
  console.error(`JPN Business composed candidate: ${message}`);
  process.exitCode = 1;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function flattenMap(map) {
  return [
    ...(map.front_matter ?? []).map((item) => ({ ...item, kind: 'front-matter' })),
    ...(map.playbooks ?? []).map((item) => ({ ...item, title: `${item.id} — ${item.name}`, kind: 'playbook' })),
    ...(map.back_matter ?? []).map((item) => ({ ...item, kind: 'back-matter' })),
  ];
}

function validate(map, sourceManifest, promptIndex) {
  const errors = [];
  const expectedSections = flattenMap(map);
  const manifestSections = Array.isArray(sourceManifest.sections) ? sourceManifest.sections : [];
  const promptItems = Array.isArray(promptIndex.templates) ? promptIndex.templates : [];
  const promptIds = new Set(promptItems.map((item) => item.id));

  if (map.product !== 'JPN Business') errors.push('COMPOSITION_MAP_v1.json não pertence ao JPN Business');
  if (map.release_effect !== 'none') errors.push('composition map deve permanecer sem efeito de release');
  if (sourceManifest.product !== 'JPN Business') errors.push('manifesto de fontes não pertence ao JPN Business');
  if (sourceManifest.release_effect !== 'none') errors.push('manifesto de fontes deve permanecer sem efeito de release');
  if (sourceManifest.rules?.human_review_required !== true) errors.push('manifesto deve exigir revisão humana');
  if (sourceManifest.rules?.missing_content !== 'flag-for-editorial-review-do-not-invent') {
    errors.push('política de conteúdo ausente deve permanecer flag-for-editorial-review-do-not-invent');
  }
  if (promptIndex.product !== 'JPN Prompt Pack') errors.push('PROMPT_INDEX.json não pertence ao JPN Prompt Pack');

  const expectedIds = expectedSections.map((item) => item.id);
  const manifestIds = manifestSections.map((item) => item.id);
  if (JSON.stringify(expectedIds) !== JSON.stringify(manifestIds)) {
    errors.push(`ordem/cobertura de seções divergente: mapa=${expectedIds.join(', ')} | manifesto=${manifestIds.join(', ')}`);
  }

  if (expectedSections.length !== 20) errors.push(`mapa deve conter 20 seções; encontrado ${expectedSections.length}`);
  if ((map.playbooks ?? []).length !== 12) errors.push(`mapa deve conter 12 playbooks; encontrado ${(map.playbooks ?? []).length}`);
  if (promptItems.length !== 18) errors.push(`Prompt Pack deve conter 18 templates; encontrado ${promptItems.length}`);

  const sourceTypesAllowed = new Set([
    'composed-metadata',
    'canonical-excerpt',
    'generated-from-map',
    'canonical-playbook',
    'generated-cross-reference',
    'canonical-synthesis',
  ]);

  for (const section of manifestSections) {
    if (!sourceTypesAllowed.has(section.source_type)) errors.push(`${section.id}: source_type não reconhecido: ${section.source_type}`);
    if (!Array.isArray(section.sources) || section.sources.length === 0) errors.push(`${section.id}: sources ausente/vazio`);
    if (!section.source_anchor?.trim()) errors.push(`${section.id}: source_anchor ausente`);
  }

  for (const playbook of map.playbooks ?? []) {
    if (!/^JB-\d{2}$/.test(playbook.id ?? '')) errors.push(`ID de playbook inválido: ${playbook.id ?? '<ausente>'}`);
    if (!Array.isArray(playbook.prompt_pack_links) || playbook.prompt_pack_links.length === 0) {
      errors.push(`${playbook.id}: sem vínculos PP-*`);
      continue;
    }
    for (const linkedId of playbook.prompt_pack_links) {
      if (!promptIds.has(linkedId)) errors.push(`${playbook.id}: referência inexistente no Prompt Pack: ${linkedId}`);
    }
  }

  const synthesis = manifestSections.filter((section) => section.source_type === 'canonical-synthesis');
  if (synthesis.length !== 2) errors.push(`esperadas 2 sínteses sujeitas a revisão humana; encontradas ${synthesis.length}`);

  return { errors, expectedSections, promptItems, synthesis };
}

function renderCompositionToc(map) {
  const rows = flattenMap(map).map((item, index) => {
    const label = item.kind === 'playbook' ? `${item.id} — ${item.name}` : item.title;
    return `<li data-section-id="${escapeHtml(item.id)}"><span class="composition-order">${String(index + 1).padStart(2, '0')}</span> ${escapeHtml(label)}</li>`;
  }).join('\n');

  return `<section class="composition-toc" data-component="jpn-business-composition-toc">
<h1>Sumário de composição</h1>
<p>Estrutura candidata derivada de <code>COMPOSITION_MAP_v1.json</code>. A ordem abaixo é rastreável e não representa aprovação editorial ou de release.</p>
<ol>${rows}</ol>
</section>`;
}

function renderCrossReference(map, promptIndex) {
  const promptById = new Map((promptIndex.templates ?? []).map((item) => [item.id, item]));
  const rows = (map.playbooks ?? []).map((playbook) => {
    const prompts = playbook.prompt_pack_links.map((id) => {
      const prompt = promptById.get(id);
      return `<code>${escapeHtml(id)}</code>${prompt ? ` — ${escapeHtml(prompt.name)}` : ''}`;
    }).join('<br>');
    return `<tr><td><strong>${escapeHtml(playbook.id)}</strong><br>${escapeHtml(playbook.name)}</td><td>${prompts}</td></tr>`;
  }).join('\n');

  return `<section class="composition-cross-reference" data-component="jpn-business-prompt-cross-reference">
<h1>Referência cruzada JPN Business ↔ Prompt Pack</h1>
<p>Relação gerada exclusivamente dos índices versionados. Ela facilita revisão e navegação; não altera o conteúdo canônico dos playbooks.</p>
<table><thead><tr><th>Playbook</th><th>Prompts relacionados</th></tr></thead><tbody>${rows}</tbody></table>
</section>`;
}

function renderReviewFlags(sourceManifest) {
  const synthesis = sourceManifest.sections.filter((section) => section.source_type === 'canonical-synthesis');
  const rows = synthesis.map((section) => `<li><strong>${escapeHtml(section.id)}</strong> — fontes: ${section.sources.map((source) => `<code>${escapeHtml(source)}</code>`).join(', ')}. Âncora: ${escapeHtml(section.source_anchor)}.</li>`).join('\n');
  return `<section class="composition-review-flags" data-component="jpn-business-editorial-review-flags">
<h1>Lacunas que continuam sob revisão humana</h1>
<p>Estas seções podem ser sintetizadas somente a partir das fontes declaradas. O compositor não inventa texto para preencher lacunas.</p>
<ul>${rows}</ul>
</section>`;
}

const [mapRaw, sourceManifestRaw, promptIndexRaw] = await Promise.all([
  readFile(mapPath, 'utf8'),
  readFile(sourceManifestPath, 'utf8'),
  readFile(promptIndexPath, 'utf8'),
]);
const map = JSON.parse(mapRaw);
const sourceManifest = JSON.parse(sourceManifestRaw);
const promptIndex = JSON.parse(promptIndexRaw);
const { errors, expectedSections, synthesis } = validate(map, sourceManifest, promptIndex);

if (errors.length) {
  for (const error of errors) fail(error);
  process.exit();
}

if (checkOnly) {
  console.log(`JPN Business composed candidate check OK: ${expectedSections.length} seções rastreáveis, ${(map.playbooks ?? []).length} playbooks e ${synthesis.length} sínteses preservadas para revisão humana.`);
  process.exit();
}

execFileSync(process.execPath, ['scripts/build-jpn-business-print-candidate.mjs'], { cwd: root, stdio: 'inherit' });

const [candidateHtml, candidateManifestRaw] = await Promise.all([
  readFile(candidateHtmlPath, 'utf8'),
  readFile(candidateManifestPath, 'utf8'),
]);
const candidateManifest = JSON.parse(candidateManifestRaw);

const css = `
.composition-toc, .composition-cross-reference, .composition-review-flags { page-break-before:always; break-before:page; }
.composition-toc ol { list-style:none; margin-left:0; padding-left:0; }
.composition-toc li { display:flex; gap:3mm; padding:1.8mm 0; border-bottom:1px solid var(--line); }
.composition-order { min-width:8mm; color:#0b6f69; font-weight:700; }
.composition-review-flags { border-top:4px solid #d69e2e; padding-top:5mm; }
.composition-review-flags h1 { border-bottom-color:#d69e2e; }
`;

let nextHtml = candidateHtml.replace('</style>', `${css}</style>`);
const metaEnd = '</div>\n';
const metaIndex = nextHtml.indexOf(metaEnd, nextHtml.indexOf('<div class="meta">'));
if (metaIndex < 0) throw new Error('bloco meta do candidato não encontrado');
const insertionPoint = metaIndex + metaEnd.length;
nextHtml = `${nextHtml.slice(0, insertionPoint)}${renderCompositionToc(map)}\n${nextHtml.slice(insertionPoint)}`;

const footerMarker = '<div class="footer-note">';
const footerIndex = nextHtml.indexOf(footerMarker);
if (footerIndex < 0) throw new Error('footer-note do candidato não encontrado');
const backMatter = `${renderCrossReference(map, promptIndex)}\n${renderReviewFlags(sourceManifest)}\n`;
nextHtml = `${nextHtml.slice(0, footerIndex)}${backMatter}${nextHtml.slice(footerIndex)}`;

candidateManifest.composition = {
  state: 'source-traceable-candidate-human-review-pending',
  map: 'docs/products/jpn-business/COMPOSITION_MAP_v1.json',
  map_sha256: sha256(mapRaw),
  source_manifest: 'docs/products/jpn-business/COMPOSITION_SOURCE_MANIFEST_v1.json',
  source_manifest_sha256: sha256(sourceManifestRaw),
  prompt_index: 'docs/products/prompt-pack/PROMPT_INDEX.json',
  prompt_index_sha256: sha256(promptIndexRaw),
  section_count: expectedSections.length,
  section_ids: expectedSections.map((section) => section.id),
  human_review_required: true,
  synthesis_sections_pending_human_review: synthesis.map((section) => section.id),
  release_effect: 'none',
};
candidateManifest.visual_qa = 'pending';
candidateManifest.pdf_export = 'pending';
candidateManifest.publication_authorized = false;

await Promise.all([
  writeFile(candidateHtmlPath, nextHtml, 'utf8'),
  writeFile(candidateManifestPath, JSON.stringify(candidateManifest, null, 2) + '\n', 'utf8'),
]);

console.log(`JPN Business composed candidate enriquecido em ${candidateHtmlPath}`);
console.log(`Rastreabilidade registrada em ${candidateManifestPath}`);
