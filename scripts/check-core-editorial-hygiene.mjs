import fs from 'node:fs';

const files = [
  'docs/products/metodo-jpn/METODO_JPN_v1.md',
  'docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md',
  'docs/products/jpn-business/JPN_BUSINESS_v1.md',
];

const failures = [];
const report = [];

const blockedPlaceholders = [
  /\bTBD\b/i,
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /\[preencher\]/i,
  /\[inserir\]/i,
  /<placeholder>/i,
];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  let fileIssues = 0;

  lines.forEach((line, index) => {
    const n = index + 1;
    if (/\t/.test(line)) {
      failures.push(`${file}:${n} contém tabulação; use espaços.`);
      fileIssues++;
    }
    if (/ +$/.test(line) && !/  $/.test(line)) {
      failures.push(`${file}:${n} contém espaço final não intencional.`);
      fileIssues++;
    }
    if (/ {3,}/.test(line) && !/^\s*```/.test(line)) {
      failures.push(`${file}:${n} contém três ou mais espaços consecutivos.`);
      fileIssues++;
    }
  });

  for (const pattern of blockedPlaceholders) {
    if (pattern.test(text)) {
      failures.push(`${file} contém placeholder editorial bloqueado: ${pattern}`);
      fileIssues++;
    }
  }

  const headings = [...text.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((m) => m[2].trim());
  const duplicateHeadings = headings.filter((h, i) => headings.indexOf(h) !== i);
  if (duplicateHeadings.length) {
    failures.push(`${file} contém títulos duplicados: ${[...new Set(duplicateHeadings)].join(', ')}`);
    fileIssues++;
  }

  const proseBlocks = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 120 && !p.startsWith('#') && !p.startsWith('```') && !p.startsWith('>'));
  const normalized = proseBlocks.map((p) => p.replace(/\s+/g, ' ').toLowerCase());
  const duplicateBlocks = normalized.filter((p, i) => normalized.indexOf(p) !== i);
  if (duplicateBlocks.length) {
    failures.push(`${file} contém parágrafo longo duplicado literalmente.`);
    fileIssues++;
  }

  const canonical = ['Jornada', 'Precisão', 'Narrativa'];
  for (const term of canonical) {
    if (!text.includes(term)) {
      failures.push(`${file} não contém o termo canônico ${term}.`);
      fileIssues++;
    }
  }

  report.push(`${file}: ${fileIssues === 0 ? 'OK' : `${fileIssues} problema(s)`}`);
}

console.log('JPN core editorial hygiene');
for (const line of report) console.log(`- ${line}`);

if (failures.length) {
  console.error('\nFalhas editoriais detectadas:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nOK: higiene editorial mecânica dos três produtos centrais aprovada.');
