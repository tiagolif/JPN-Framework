import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const sourcePath = join(root, 'docs/products/jpn-business/JPN_BUSINESS_v1.md');
const indexPath = join(root, 'docs/products/jpn-business/BUSINESS_INDEX.json');
const quickReferencePath = join(root, 'docs/products/jpn-business/JPN_BUSINESS_QUICK_REFERENCE_v1.md');
const htmlPath = join(root, 'dist/editorial-print-staging/jpn-business/index.html');
const manifestPath = join(root, 'dist/editorial-print-staging/jpn-business/candidate-manifest.json');

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function fail(message) {
  console.error(`JPN Business rendered candidate: ${message}`);
  process.exitCode = 1;
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

const [markdown, indexRaw, quickReference, html, manifestRaw] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(indexPath, 'utf8'),
  readFile(quickReferencePath, 'utf8'),
  readFile(htmlPath, 'utf8'),
  readFile(manifestPath, 'utf8'),
]);

const index = JSON.parse(indexRaw);
const manifest = JSON.parse(manifestRaw);
const expectedPlaybooks = index.playbooks ?? [];
const expectedIds = Array.from({ length: 12 }, (_, i) => `JB-${String(i + 1).padStart(2, '0')}`);
const errors = [];

if (manifest.product !== 'JPN Business') errors.push('manifesto não identifica JPN Business');
if (manifest.version !== 'v1-candidate') errors.push('versão do manifesto diverge de v1-candidate');
if (manifest.status !== 'print-candidate-visual-qa-pending') errors.push('status do candidato foi promovido sem QA visual');
if (manifest.visual_qa !== 'pending') errors.push('visual_qa deve permanecer pending');
if (manifest.pdf_export !== 'pending') errors.push('pdf_export deve permanecer pending');
if (manifest.publication_authorized !== false) errors.push('publication_authorized deve permanecer false');
if (manifest.source_sha256 !== sha256(markdown)) errors.push('source_sha256 não corresponde ao Markdown atual');
if (manifest.index_sha256 !== sha256(indexRaw)) errors.push('index_sha256 não corresponde ao BUSINESS_INDEX.json atual');
if (manifest.quick_reference !== 'docs/products/jpn-business/JPN_BUSINESS_QUICK_REFERENCE_v1.md') errors.push('caminho da Referência Rápida ausente ou divergente no manifesto');
if (manifest.quick_reference_sha256 !== sha256(quickReference)) errors.push('quick_reference_sha256 não corresponde à Referência Rápida atual');
if (manifest.quick_reference_state !== 'candidate-companion-editorial-and-visual-qa-pending') errors.push('estado da Referência Rápida foi promovido indevidamente');
if (manifest.quick_reference_included_in_candidate !== true) errors.push('manifesto não confirma inclusão da Referência Rápida no candidato');

const renderedIds = [...html.matchAll(/data-playbook="(JB-\d{2})"/g)].map((match) => match[1]);
if (JSON.stringify(renderedIds) !== JSON.stringify(expectedIds)) {
  errors.push(`ordem renderizada de playbooks inválida: ${renderedIds.join(', ') || 'nenhum'}`);
}
if (count(html, /class="playbook-title"/g) !== 12) errors.push('HTML deve conter exatamente 12 títulos de playbook');
if (count(html, /class="playbook-links"/g) !== 12) errors.push('HTML deve conter exatamente 12 blocos de vínculo com Prompt Pack');
if (count(html, /class="field"/g) !== 144) errors.push('HTML deve conter exatamente 144 campos operacionais (12 × 12)');
if (!html.includes('<body class="jpn-business-candidate">')) errors.push('classe canônica do candidato ausente no body');
if (!html.includes('staging interno para revisão')) errors.push('aviso de staging interno ausente');
if (!html.includes('PDF final aprovado')) errors.push('aviso de que não é PDF final aprovado ausente');

if (count(html, /data-component="jpn-business-quick-reference"/g) !== 1) errors.push('HTML deve conter exatamente uma Referência Rápida integrada');
if (!html.includes('JPN Business — Referência Rápida v1')) errors.push('título da Referência Rápida ausente do HTML');
if (!html.includes('Regra de parada')) errors.push('Regra de parada da Referência Rápida ausente do HTML');
if (!html.includes('Checklist antes de concluir um playbook')) errors.push('checklist da Referência Rápida ausente do HTML');
if (!html.includes('candidate companion / editorial and visual QA pending')) errors.push('estado candidato da Referência Rápida ausente do HTML');

if (!Array.isArray(manifest.playbooks) || manifest.playbooks.length !== 12) {
  errors.push('manifesto deve listar exatamente 12 playbooks');
} else {
  for (let i = 0; i < expectedPlaybooks.length; i += 1) {
    const expected = expectedPlaybooks[i];
    const actual = manifest.playbooks[i];
    if (actual?.id !== expected.id) errors.push(`manifesto: posição ${i + 1} deveria ser ${expected.id}`);
    if (actual?.title !== expected.name) errors.push(`${expected.id}: título do manifesto diverge do índice`);
    const expectedLinks = expected.prompt_pack_links ?? [];
    const actualLinks = actual?.prompt_pack_links ?? [];
    if (JSON.stringify(actualLinks) !== JSON.stringify(expectedLinks)) errors.push(`${expected.id}: vínculos PP-* do manifesto divergem do índice`);
    if (!html.includes(`<strong>${expected.id} — ${expected.name}</strong>`)) errors.push(`${expected.id}: entrada canônica ausente da Referência Rápida renderizada`);
    for (const link of expectedLinks) {
      if (!html.includes(`<code>${link}</code>`)) errors.push(`${expected.id}: vínculo ${link} ausente no HTML renderizado`);
    }
  }
}

const quickReferenceStart = html.indexOf('data-component="jpn-business-quick-reference"');
const lastPlaybook = html.lastIndexOf('data-playbook="JB-12"');
if (quickReferenceStart <= lastPlaybook) errors.push('Referência Rápida deve aparecer como apêndice após os 12 playbooks');

const forbidden = [
  /comprar agora/i,
  /finalizar compra/i,
  /checkout/i,
  /publication_authorized"\s*:\s*true/i,
];
for (const pattern of forbidden) {
  if (pattern.test(html)) errors.push(`CTA/estado proibido detectado no HTML: ${pattern}`);
}

if (errors.length) {
  for (const error of errors) fail(error);
  process.exit();
}

console.log('JPN Business rendered candidate OK: 12 playbooks, 144 campos, vínculos PP-*, Referência Rápida e manifesto preservados; PDF/QA visual continuam pendentes.');
