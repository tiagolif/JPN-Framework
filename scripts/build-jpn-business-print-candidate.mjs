import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const sourcePath = join(root, 'docs/products/jpn-business/JPN_BUSINESS_v1.md');
const indexPath = join(root, 'docs/products/jpn-business/BUSINESS_INDEX.json');
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

function validate(markdown, index) {
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
  }

  const forbidden = [
    /garante\s+(vendas|resultado|roi|precis[aã]o)/i,
    /elimina\s+(alucina[cç][aã]o|erros?)/i,
    /substitui\s+(revis[aã]o humana|especialista)/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(markdown)) errors.push(`claim proibido detectado: ${pattern}`);
  }

  return { errors, playbooks };
}

function enhanceHtml(html, index) {
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
`;

  let next = html.replace('</style>', `${css}</style>`).replace('<body>', '<body class="jpn-business-candidate">');
  next = next.replace(/<h1>(Playbook (JB-\d{2}) — ([^<]+))<\/h1>/g, (_, full, id) => {
    const linked = index.playbooks.find((item) => item.id === id)?.prompt_pack_links ?? [];
    const refs = linked.map((value) => `<code>${value}</code>`).join(', ');
    return `<h1 class="playbook-title" data-playbook="${id}">${full}</h1>\n<div class="playbook-links"><strong>Conexão com JPN Prompt Pack:</strong> ${refs || 'sem referência registrada'}</div>`;
  });
  next = next.replace(/<p><strong>(Processo de negócio|Resultado pretendido|Responsável típico|Entradas|Restrições|Passos|Pontos de decisão|Saída|Como validar|O que registrar para continuidade|Riscos|JPN usado):<\/strong>/g, '<p class="field"><strong>$1:</strong>');
  return next;
}

const [markdown, indexRaw] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(indexPath, 'utf8'),
]);
const index = JSON.parse(indexRaw);
const { errors, playbooks } = validate(markdown, index);

if (errors.length) {
  for (const error of errors) fail(error);
  process.exit();
}

if (checkOnly) {
  console.log(`JPN Business candidate check OK: ${playbooks.length} playbooks, ${requiredFields.length} campos por playbook, vínculos PP-* presentes no índice.`);
  process.exit();
}

execFileSync(process.execPath, ['scripts/build-editorial-print-staging.mjs'], { cwd: root, stdio: 'inherit' });
const baseHtml = await readFile(outHtml, 'utf8');
const candidateHtml = enhanceHtml(baseHtml, index);
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
