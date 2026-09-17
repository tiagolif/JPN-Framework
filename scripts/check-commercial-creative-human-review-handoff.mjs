import fs from 'node:fs';

const path = 'docs/commercial/creative_sources/HUMAN_REVIEW_HANDOFF.md';
const text = fs.readFileSync(path, 'utf8');

const required = [
  'CANDIDATO INTERNO',
  'NÃO PUBLICAR',
  'release_ready=false',
  'publication_authorized=false',
  'PENDING_HUMAN',
  'SHA-256',
  'Hierarquia',
  'Legibilidade',
  'Consistência',
  'Produto',
  'Jornada',
  'Claims',
  'Marca',
  'Segurança',
  'Sistema operacional',
  'Navegador/renderizador e versão',
  'Escala/zoom',
  'Viewports adicionais usados',
  'review-manifest.json',
  'REVIEW_PROTOCOL.md',
];

for (const token of required) {
  if (!text.includes(token)) throw new Error(`Handoff de revisão humana sem requisito: ${token}`);
}

for (let i = 1; i <= 8; i++) {
  const id = `JPN-CR-${String(i).padStart(2, '0')}`;
  const matches = text.match(new RegExp(id, 'g')) ?? [];
  if (matches.length < 2) throw new Error(`${id} não está rastreado na tabela e nas observações`);
}

const tableRows = text.split('\n').filter((line) => /^\| JPN-CR-\d{2} \|/.test(line));
if (tableRows.length !== 8) throw new Error(`Esperadas 8 linhas de revisão; encontradas ${tableRows.length}`);

for (const row of tableRows) {
  if (!row.includes('PREENCHER_DO_MANIFESTO')) throw new Error('Linha sem vínculo explícito ao hash do manifesto');
  const pending = row.match(/PENDING_HUMAN/g) ?? [];
  if (pending.length !== 9) throw new Error(`Linha deve manter 9 estados PENDING_HUMAN até inspeção real: ${row}`);
}

if (!text.includes('Hash diferente invalida a decisão anterior')) {
  throw new Error('Handoff não invalida aprovação quando o hash da fonte muda');
}

if (!text.includes('não autoriza publicação')) {
  throw new Error('Handoff precisa declarar que revisão visual não autoriza publicação');
}

console.log('Commercial creative human review handoff: OK');
