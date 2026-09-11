import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const buildFirst = !process.argv.includes('--no-build');

const mapPath = join(root, 'docs/products/jpn-business/COMPOSITION_MAP_v1.json');
const sourceManifestPath = join(root, 'docs/products/jpn-business/COMPOSITION_SOURCE_MANIFEST_v1.json');
const promptIndexPath = join(root, 'docs/products/prompt-pack/PROMPT_INDEX.json');
const candidateHtmlPath = join(root, 'dist/editorial-print-staging/jpn-business/index.html');
const candidateManifestPath = join(root, 'dist/editorial-print-staging/jpn-business/candidate-manifest.json');
const reportPath = join(root, 'dist/editorial-print-staging/jpn-business/candidate-integrity-report.json');

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function flattenMap(map) {
  return [
    ...(map.front_matter ?? []).map((item) => ({ ...item, kind: 'front-matter' })),
    ...(map.playbooks ?? []).map((item) => ({ ...item, kind: 'playbook' })),
    ...(map.back_matter ?? []).map((item) => ({ ...item, kind: 'back-matter' })),
  ];
}

function countLiteral(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function addCheck(checks, id, passed, details) {
  checks.push({ id, passed, details });
}

if (buildFirst) {
  execFileSync(process.execPath, ['scripts/build-jpn-business-composed-candidate.mjs'], {
    cwd: root,
    stdio: 'inherit',
  });
}

const [mapRaw, sourceManifestRaw, promptIndexRaw, html, manifestRaw] = await Promise.all([
  readFile(mapPath, 'utf8'),
  readFile(sourceManifestPath, 'utf8'),
  readFile(promptIndexPath, 'utf8'),
  readFile(candidateHtmlPath, 'utf8'),
  readFile(candidateManifestPath, 'utf8'),
]);

const map = JSON.parse(mapRaw);
const sourceManifest = JSON.parse(sourceManifestRaw);
const promptIndex = JSON.parse(promptIndexRaw);
const manifest = JSON.parse(manifestRaw);
const sections = flattenMap(map);
const sectionIds = sections.map((item) => item.id);
const playbooks = map.playbooks ?? [];
const prompts = promptIndex.templates ?? [];
const expectedSynthesis = (sourceManifest.sections ?? [])
  .filter((section) => section.source_type === 'canonical-synthesis')
  .map((section) => section.id);

const checks = [];

addCheck(checks, 'composition-state', manifest.composition?.state === 'source-traceable-candidate-human-review-pending', {
  actual: manifest.composition?.state ?? null,
});
addCheck(checks, 'release-effect-none', manifest.composition?.release_effect === 'none', {
  actual: manifest.composition?.release_effect ?? null,
});
addCheck(checks, 'human-review-required', manifest.composition?.human_review_required === true, {
  actual: manifest.composition?.human_review_required ?? null,
});
addCheck(checks, 'section-count', manifest.composition?.section_count === 20 && sectionIds.length === 20, {
  manifest: manifest.composition?.section_count ?? null,
  map: sectionIds.length,
});
addCheck(checks, 'section-order', JSON.stringify(manifest.composition?.section_ids ?? []) === JSON.stringify(sectionIds), {
  expected: sectionIds,
  actual: manifest.composition?.section_ids ?? [],
});
addCheck(checks, 'playbook-count', playbooks.length === 12, { actual: playbooks.length });
addCheck(checks, 'prompt-count', prompts.length === 18, { actual: prompts.length });
addCheck(checks, 'synthesis-review-set', JSON.stringify(manifest.composition?.synthesis_sections_pending_human_review ?? []) === JSON.stringify(expectedSynthesis), {
  expected: expectedSynthesis,
  actual: manifest.composition?.synthesis_sections_pending_human_review ?? [],
});
addCheck(checks, 'map-hash', manifest.composition?.map_sha256 === sha256(mapRaw), {
  expected: sha256(mapRaw),
  actual: manifest.composition?.map_sha256 ?? null,
});
addCheck(checks, 'source-manifest-hash', manifest.composition?.source_manifest_sha256 === sha256(sourceManifestRaw), {
  expected: sha256(sourceManifestRaw),
  actual: manifest.composition?.source_manifest_sha256 ?? null,
});
addCheck(checks, 'prompt-index-hash', manifest.composition?.prompt_index_sha256 === sha256(promptIndexRaw), {
  expected: sha256(promptIndexRaw),
  actual: manifest.composition?.prompt_index_sha256 ?? null,
});
addCheck(checks, 'visual-qa-still-pending', manifest.visual_qa === 'pending', { actual: manifest.visual_qa ?? null });
addCheck(checks, 'pdf-export-still-pending', manifest.pdf_export === 'pending', { actual: manifest.pdf_export ?? null });
addCheck(checks, 'publication-not-authorized', manifest.publication_authorized === false, { actual: manifest.publication_authorized ?? null });

for (const component of [
  'jpn-business-composition-toc',
  'jpn-business-prompt-cross-reference',
  'jpn-business-editorial-review-flags',
]) {
  addCheck(checks, `html-component:${component}`, countLiteral(html, `data-component=\"${component}\"`) === 1, {
    count: countLiteral(html, `data-component=\"${component}\"`),
  });
}

for (const id of sectionIds) {
  addCheck(checks, `toc-section:${id}`, countLiteral(html, `data-section-id=\"${id}\"`) === 1, {
    count: countLiteral(html, `data-section-id=\"${id}\"`),
  });
}

for (const playbook of playbooks) {
  addCheck(checks, `playbook-visible:${playbook.id}`, html.includes(playbook.id), {
    id: playbook.id,
  });
  for (const promptId of playbook.prompt_pack_links ?? []) {
    addCheck(checks, `cross-reference:${playbook.id}:${promptId}`, html.includes(promptId), {
      playbook: playbook.id,
      prompt: promptId,
    });
  }
}

for (const prompt of prompts) {
  addCheck(checks, `prompt-index-entry:${prompt.id}`, typeof prompt.name === 'string' && prompt.name.trim().length > 0, {
    id: prompt.id,
    name: prompt.name ?? null,
  });
}

const failed = checks.filter((check) => !check.passed);
const report = {
  product: 'JPN Business',
  report_version: '1.0.0',
  state: failed.length === 0 ? 'candidate-integrity-pass-human-review-still-required' : 'candidate-integrity-fail',
  generated_at: new Date().toISOString(),
  release_effect: 'none',
  human_review_required: true,
  summary: {
    total_checks: checks.length,
    passed: checks.length - failed.length,
    failed: failed.length,
    sections: sectionIds.length,
    playbooks: playbooks.length,
    prompts: prompts.length,
  },
  checks,
};

await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

if (failed.length) {
  console.error(`JPN Business candidate integrity: FAIL (${failed.length}/${checks.length} verificações falharam).`);
  for (const check of failed) console.error(`- ${check.id}`);
  console.error(`Relatório: ${reportPath}`);
  process.exit(1);
}

console.log(`JPN Business candidate integrity: OK (${checks.length} verificações).`);
console.log(`Estado preservado: revisão humana obrigatória; sem efeito de release.`);
console.log(`Relatório: ${reportPath}`);
