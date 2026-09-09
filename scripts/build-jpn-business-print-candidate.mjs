import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const sourcePath = join(root, 'docs/products/jpn-business/JPN_BUSINESS_v1.md');
const indexPath = join(root, 'docs/products/jpn-business/BUSINESS_INDEX.json');
const quickReferencePath = join(root, 'docs/products/jpn-business/JPN_BUSINESS_QUICK_REFERENCE_v1.md');
const outDir = join(root, 'dist/editorial-print-staging/jpn-business');
const outHtml = join(outDir, 'index.html');
const outManifest = join(outDir, 'candidate-manifest.json');
const checkOnly = process.argv.includes('--check');

const requiredFields = [
  'Processo de negócio',
  'Resultado pretendido',
  'Responsável típico',
  'Entradas',
  'Restrições',
  'Passos',
  'Pontos de decisão',
  'Saída',
  'Como validar',
  'O que registrar para continuidade',
  'Riscos',
  'JPN usado',
];

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function fail(message) {
  console.error(`JPN Business print candidate: ${message}`);
  process.exitCode = 1;
}

function extractPlaybooks(markdown) {
  const heading = /^# Playbook (JB-\d{2}) — (.+)$/gm;
  const matches = [...markdown.matchAll(heading)];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? markdown.length;
    return {
      id: match[1],
      title: match[2].trim(),
      body: markdown.slice(start, end),
    };
  });
}

function validate(markdown, index, quickReference) {
  const errors = [];
  const playbooks = extractPlaybooks(markdown);
  const expected = index.playbooks ?? [];
  const ids = playbooks.map((item) => item.id);
  const expectedIds = expected.map((item) => item.id);

  if (playbooks.length !== 12) errors.push(`esperados 12 playbooks no documento; encontrados ${playbooks.length}`);
  if (new Set(ids).size !== ids.length) errors.push('há IDs JB-* duplicados no documento');
  if (new Set(expectedIds).size !== expectedIds.length) errors.push('há IDs JB-* duplicados no BUSINESS_INDEX.json');

  const canonical = Array.from({ length: 12 }, (_, i) => `JB-${String(i + 1).padStart(2, '0')}`);
  if (JSON.stringify(ids) !== JSON.stringify(canonical)) errors.push(`sequência do documento difere de ${canonical.join(', ')}`);
  if (JSON.stringify(expectedIds) !== JSON.stringify(canonical)) errors.push('BUSINESS_INDEX.json não segue a sequência canônica JB-01..JB-12');

  for (const playbook of playbooks) {
    const indexed = expected.find((item) => item.id === playbook.id);
    if (!indexed) {
      errors.push(`${playbook.id} não existe no BUSINESS_INDEX.json`);
      continue;
    }
    if (indexed.name !== playbook.title) errors.push(`${playbook.id}: título diverge do índice ("${playbook.title}" vs "${indexed.name}")`);
    if (!Array.isArray(indexed.prompt_pack_links) || indexed.prompt_pack_links.length === 0) errors.push(`${playbook.id}: sem vínculo PP-* no índice`);
    for (const field of requiredFields) {
      const marker = `**${field}:**`;
      if (!playbook.body.includes(marker)) errors.push(`${playbook.id}: campo obrigatório ausente: ${field}`);
    }
    if (!quickReference.includes(`**${playbook.id} — ${playbook.title}**`)) {
      errors.push(`${playbook.id}: ausente ou divergente na tabela da Referência Rápida`);
    }
    for (const link of indexed.prompt_pack_links ?? []) {
      if (!quickReference.includes(`\`${link}\``)) errors.push(`${playbook.id}: vínculo ${link} ausente da Referência Rápida`);
    }
  }

  if (!quickReference.startsWith('# JPN Business — Referência Rápida v1')) errors.push('título canônico da Referência Rápida ausente');
  if (!quickReference.includes('## Regra de parada')) errors.push('Referência Rápida sem Regra de parada');
  if (!quickReference.includes('## Checklist antes de concluir um playbook')) errors.push('Referência Rápida sem checklist final');
  if (!quickReference.includes('candidate companion / editorial and visual QA pending')) errors.push('estado candidato da Referência Rápida ausente');
  if (!quickReference.includes('Nenhum desses playbooks autoriza publicação automática, gasto de mídia ou uso de claims sem evidência.')) {
    errors.push('guardrail de Marketing ausente da Referência Rápida');
  }

  const forbidden = [
    /garante\s+(vendas|resultado|roi|precis[aã]o)/i,
    /elimina\s+(alucina[cç][aã]o|erros?)/i,
    /substitui\s+(revis[aã]o humana|especialista)/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(markdown) || pattern.test(quickReference)) errors.push(`claim proibido detectado: ${pattern}`);
  }

  return { errors, playbooks };
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inline(value) {
  let next = escapeHtml(value);
  next = next.replace(/`([^`]+)`/g, '<code>$1</code>');
  next = next.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  next = next.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return next;
}

function renderQuickReference(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out = ['<section class="quick-reference" data-component="jpn-business-quick-reference">'];
  let paragraph = [];
  let listType = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!listType) return;
    out.push(`</${listType}>`);
    listType = null;
  };

  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeList();
      i += 1;
      continue;
    }

    if (i + 1 < lines.length && line.includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      flushParagraph();
      closeList();
      const header = line.trim().replace(/^\||\|$/g, '').split('|').map((v) => v.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map((v) => v.trim()));
        i += 1;
      }
      out.push(`<table class="quick-reference-table"><thead><tr>${header.map((cell) => `<th>${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const sourceLevel = heading[1].length;
      const level = sourceLevel === 1 ? 1 : Math.min(sourceLevel + 1, 4);
      const cls = sourceLevel === 1 ? ' class="quick-reference-title"' : '';
      out.push(`<h${level}${cls}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph();
      closeList();
      out.push(`<blockquote>${inline(trimmed.slice(2))}</blockquote>`);
      i += 1;
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const wanted = unordered ? 'ul' : 'ol';
      if (listType !== wanted) {
        closeList();
        listType = wanted;
        out.push(`<${wanted}>`);
      }
      out.push(`<li>${inline((unordered || ordered)[1])}</li>`);
      i += 1;
      continue;
    }

    paragraph.push(trimmed);
    i += 1;
  }

  flushParagraph();
  closeList();
  out.push('</section>');
  return out.join('\n');
}

function enhanceHtml(html, index, quickReference) {
  const css = `
/* JPN Business — composição candidata */
body.jpn-business-candidate { counter-reset: playbook; }
.jpn-business-candidate h1.playbook-title { page-break-before: always; break-before: page; margin-top: 0; padding: 5mm 0 4mm; border-bottom: 2px solid var(--accent); }
.jpn-business-candidate h1.playbook-title:first-of-type { page-break-before: auto; break-before: auto; }
.jpn-business-candidate h1.playbook-title::before { display:block; margin-bottom:2mm; font-size:8.5pt; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#0b6f69; content:'Playbook operacional'; }
.jpn-business-candidate p.field { margin: 4mm 0 2mm; }
.jpn-business-candidate p.field > strong:first-child { color:var(--navy); }
.jpn-business-candidate .playbook-links { margin: 5mm 0 7mm; padding: 3.5mm 4mm; border: 1px solid var(--line); border-left: 4px solid var(--accent); background:#f7fbfb; page-break-inside:avoid; }
.jpn-business-candidate .playbook-links strong { color:var(--navy); }
.jpn-business-candidate hr { page-break-after:avoid; }
.jpn-business-candidate .quick-reference { page-break-before:always; break-before:page; }
.jpn-business-candidate .quick-reference-title { margin-top:0; }
.jpn-business-candidate .quick-reference-table { font-size:8.1pt; }
.jpn-business-candidate .quick-reference-table td:nth-child(2) { min-width:48mm; }
.jpn-business-candidate .quick-reference li { page-break-inside:avoid; }
`;

  let next = html.replace('</style>', `${css}</style>`).replace('<body>', '<body class="jpn-business-candidate">');
  next = next.replace(/<h1>(Playbook (JB-\d{2}) — ([^<]+))<\/h1>/g, (_, full, id) => {
    const linked = index.playbooks.find((item) => item.id === id)?.prompt_pack_links ?? [];
    const refs = linked.map((value) => `<code>${value}</code>`).join(', ');
    return `<h1 class="playbook-title" data-playbook="${id}">${full}</h1>\n<div class="playbook-links"><strong>Conexão com JPN Prompt Pack:</strong> ${refs || 'sem referência registrada'}</div>`;
  });
  next = next.replace(/<p><strong>(Processo de negócio|Resultado pretendido|Responsável típico|Entradas|Restrições|Passos|Pontos de decisão|Saída|Como validar|O que registrar para continuidade|Riscos|JPN usado):<\/strong>/g, '<p class="field"><strong>$1:</strong>');
  const appendix = renderQuickReference(quickReference);
  next = next.replace('<div class="footer-note">', `${appendix}\n<div class="footer-note">`);
  return next;
}

const [markdown, indexRaw, quickReference] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(indexPath, 'utf8'),
  readFile(quickReferencePath, 'utf8'),
]);
const index = JSON.parse(indexRaw);
const { errors, playbooks } = validate(markdown, index, quickReference);

if (errors.length) {
  for (const error of errors) fail(error);
  process.exit();
}

if (checkOnly) {
  console.log(`JPN Business candidate check OK: ${playbooks.length} playbooks, ${requiredFields.length} campos por playbook, vínculos PP-* e Referência Rápida sincronizados.`);
  process.exit();
}

execFileSync(process.execPath, ['scripts/build-editorial-print-staging.mjs'], { cwd: root, stdio: 'inherit' });
const baseHtml = await readFile(outHtml, 'utf8');
const candidateHtml = enhanceHtml(baseHtml, index, quickReference);
await mkdir(outDir, { recursive: true });
await writeFile(outHtml, candidateHtml, 'utf8');

const manifest = {
  product: 'JPN Business',
  version: 'v1-candidate',
  status: 'print-candidate-visual-qa-pending',
  source: 'docs/products/jpn-business/JPN_BUSINESS_v1.md',
  source_sha256: sha256(markdown),
  index: 'docs/products/jpn-business/BUSINESS_INDEX.json',
  index_sha256: sha256(indexRaw),
  quick_reference: 'docs/products/jpn-business/JPN_BUSINESS_QUICK_REFERENCE_v1.md',
  quick_reference_sha256: sha256(quickReference),
  quick_reference_state: 'candidate-companion-editorial-and-visual-qa-pending',
  quick_reference_included_in_candidate: true,
  output: 'dist/editorial-print-staging/jpn-business/index.html',
  playbooks: playbooks.map((item) => ({
    id: item.id,
    title: item.title,
    prompt_pack_links: index.playbooks.find((entry) => entry.id === item.id)?.prompt_pack_links ?? [],
  })),
  required_fields_per_playbook: requiredFields,
  visual_qa: 'pending',
  pdf_export: 'pending',
  publication_authorized: false,
};
await writeFile(outManifest, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`JPN Business print candidate gerado em ${outHtml}`);
console.log(`Manifesto do candidato: ${outManifest}`);
