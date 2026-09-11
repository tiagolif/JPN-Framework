import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const checklistPath = join(root, 'docs/products/jpn-business/COMPOSITION_QA_CHECKLIST_v1.csv');
const candidateManifestPath = join(root, 'dist/editorial-print-staging/jpn-business/candidate-manifest.json');
const integrityReportPath = join(root, 'dist/editorial-print-staging/jpn-business/candidate-integrity-report.json');
const packetPath = join(root, 'dist/editorial-print-staging/jpn-business/HUMAN_REVIEW_PACKET.md');
const statePath = join(root, 'dist/editorial-print-staging/jpn-business/human-review-state.json');

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  values.push(value);
  return values;
}

function parseCsv(raw) {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

const [checklistRaw, manifestRaw, integrityRaw] = await Promise.all([
  readFile(checklistPath, 'utf8'),
  readFile(candidateManifestPath, 'utf8'),
  readFile(integrityReportPath, 'utf8'),
]);

const checklist = parseCsv(checklistRaw);
const manifest = JSON.parse(manifestRaw);
const integrity = JSON.parse(integrityRaw);
const failures = [];

if (checklist.length !== 26) failures.push(`checklist deve conter 26 itens; encontrado: ${checklist.length}`);
if (new Set(checklist.map((item) => item.id)).size !== checklist.length) failures.push('checklist contém IDs duplicados');
if (checklist.some((item) => item.status !== 'PENDING')) failures.push('todos os itens devem permanecer PENDING antes da revisão humana');
if (checklist.some((item) => !item.evidence_required?.trim())) failures.push('todo item deve declarar evidence_required');
if (integrity.state !== 'candidate-integrity-pass-human-review-still-required') {
  failures.push(`integridade do candidato não está apta ao handoff humano: ${integrity.state ?? '<ausente>'}`);
}
if (integrity.release_effect !== 'none' || integrity.human_review_required !== true) {
  failures.push('relatório de integridade não preserva release_effect=none e human_review_required=true');
}
if (manifest.visual_qa !== 'pending') failures.push('visual_qa deve permanecer pending');
if (manifest.pdf_export !== 'pending') failures.push('pdf_export deve permanecer pending');
if (manifest.publication_authorized !== false) failures.push('publication_authorized deve permanecer false');
if (manifest.composition?.human_review_required !== true) failures.push('candidate-manifest deve exigir revisão humana');

const expectedIds = Array.from({ length: 26 }, (_, index) => `JB-COMP-${String(index + 1).padStart(2, '0')}`);
if (JSON.stringify(checklist.map((item) => item.id)) !== JSON.stringify(expectedIds)) {
  failures.push('ordem/IDs do checklist divergentes de JB-COMP-01..JB-COMP-26');
}

if (failures.length) {
  console.error('Falha ao preparar pacote de revisão humana do JPN Business:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const byArea = checklist.reduce((acc, item) => {
  (acc[item.area] ??= []).push(item);
  return acc;
}, {});

const lines = [
  '# JPN Business — Pacote de Revisão Humana',
  '',
  '> Estado: candidato estruturalmente íntegro; revisão humana obrigatória. Este documento não aprova PDF, diagramação, freeze, release ou publicação.',
  '',
  '## Identificação do candidato',
  '',
  `- Estado de composição: \`${manifest.composition?.state ?? 'unknown'}\``,
  `- Integridade automática: \`${integrity.state}\``,
  `- Verificações automáticas: ${integrity.summary?.passed ?? 0}/${integrity.summary?.total_checks ?? 0} aprovadas`,
  `- Seções rastreadas: ${integrity.summary?.sections ?? 0}`,
  `- Playbooks: ${integrity.summary?.playbooks ?? 0}`,
  `- Templates do Prompt Pack: ${integrity.summary?.prompts ?? 0}`,
  '- QA visual: `pending`',
  '- Exportação PDF: `pending`',
  '- Publicação autorizada: `false`',
  '',
  '## Regra de preenchimento',
  '',
  'Cada item abaixo começa como `PENDING`. Uma pessoa revisora deve registrar evidência observável antes de qualquer mudança de estado. Falha em um item impede promoção de `diagramacao-final` e `pdf-final`.',
  '',
];

for (const [area, items] of Object.entries(byArea)) {
  lines.push(`## Área: ${area}`, '');
  for (const item of items) {
    lines.push(
      `### ${item.id} — ${item.item}`,
      '',
      `- Estado inicial: \`${item.status}\``,
      `- Evidência exigida: \`${item.evidence_required}\``,
      '- Resultado da revisão: `PENDING | PASSED | FAILED`',
      '- Evidência/arquivo/página:',
      '- Revisor:',
      '- Data:',
      '- Observações:',
      '',
    );
  }
}

lines.push(
  '## Critério de saída',
  '',
  'O pacote somente pode alimentar uma promoção posterior quando os 26 itens tiverem evidência explícita e nenhum item obrigatório estiver `FAILED` ou sem evidência. A promoção em si deve continuar separada e rastreável.',
  '',
  '## Guardrails',
  '',
  '- não cria preço, checkout, anúncio ou publicação;',
  '- não usa dados financeiros reais;',
  '- não aceita termos legais;',
  '- não cria contas externas;',
  '- não converte automaticamente revisão humana em `PASSED`;',
  '- não altera `visual_qa`, `pdf_export`, freeze ou release.',
  '',
);

const reviewState = {
  product: 'JPN Business',
  schema_version: '1.0.0',
  state: 'human-review-packet-ready-all-items-pending',
  generated_at: new Date().toISOString(),
  release_effect: 'none',
  human_review_required: true,
  source_candidate_integrity_state: integrity.state,
  summary: {
    total_items: checklist.length,
    pending: checklist.length,
    passed: 0,
    failed: 0,
  },
  items: checklist.map((item) => ({
    id: item.id,
    area: item.area,
    item: item.item,
    status: 'PENDING',
    evidence_required: item.evidence_required,
    evidence: null,
    reviewer: null,
    reviewed_at: null,
    notes: null,
  })),
};

await Promise.all([
  writeFile(packetPath, `${lines.join('\n')}\n`, 'utf8'),
  writeFile(statePath, `${JSON.stringify(reviewState, null, 2)}\n`, 'utf8'),
]);

console.log(`JPN Business human review packet: READY (${checklist.length} itens, todos PENDING).`);
console.log('Estado preservado: revisão humana obrigatória; sem efeito de release.');
console.log(`Pacote: ${packetPath}`);
console.log(`Estado: ${statePath}`);
