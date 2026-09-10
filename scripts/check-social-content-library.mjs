import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const libraryPath = path.join(root, 'docs', 'commercial', 'SOCIAL_CONTENT_LIBRARY_v1.md');
const boardPath = path.join(root, 'docs', 'commercial', 'SOCIAL_CONTENT_PRODUCTION_BOARD_v1.csv');
const errors = [];

for (const file of [libraryPath, boardPath]) {
  if (!fs.existsSync(file)) errors.push(`${path.relative(root, file)} ausente.`);
}

if (!errors.length) {
  const library = fs.readFileSync(libraryPath, 'utf8');
  const board = fs.readFileSync(boardPath, 'utf8');

  const ids = Array.from({ length: 18 }, (_, index) => `SC-${String(index + 1).padStart(2, '0')}`);
  for (const id of ids) {
    if (!library.includes(`### ${id} —`)) errors.push(`Biblioteca perdeu peça ${id}.`);
    if (!new RegExp(`^${id},`, 'm').test(board)) errors.push(`Quadro de produção perdeu linha ${id}.`);
  }

  const requiredMarkers = [
    'Status: biblioteca interna candidata para produção',
    'Não publicada',
    'Fato canônico → peça SC → template visual → QA → revisão humana → autorização específica de publicação',
    '18 templates',
    '12 playbooks',
    'QA físico contextual do Prompt Builder em celular permanece pendente',
    'GF-QA-10',
    '`REPOR` é alerta operacional, não autorização de compra',
    'JPN Pro Kit',
    '`EM PREPARAÇÃO`',
    'confirmed',
    'inferred',
    'unknown',
    'conflicting',
    'TPL-SOC-01',
    'TPL-SOC-02',
    'TPL-SOC-03',
    'revisão visual humana ainda é exigida antes de qualquer publicação',
    'parar em arquivo interno',
  ];

  for (const marker of requiredMarkers) {
    if (!library.includes(marker)) errors.push(`Biblioteca perdeu marcador obrigatório: ${marker}`);
  }

  const products = [
    'Método JPN',
    'JPN Prompt Builder',
    'JPN Prompt Pack',
    'JPN Business',
    'JPN Gestão Fácil',
    'JPN Pro Kit',
  ];
  for (const product of products) {
    if (!library.includes(product)) errors.push(`Biblioteca não cobre ${product}.`);
  }

  const rows = board.trim().split(/\r?\n/);
  if (rows.length !== 19) errors.push(`Quadro deve ter cabeçalho + 18 peças; encontrado ${rows.length} linha(s).`);

  const header = 'id,tema,produto_foco,formato,template,estado_producao,qa_visual,revisao_humana,autorizacao_publicacao,observacao';
  if (rows[0] !== header) errors.push('Cabeçalho do quadro de produção foi alterado.');

  for (const row of rows.slice(1)) {
    if (!row.includes(',IDEIA,pendente,pendente,NAO_AUTORIZADA,')) {
      errors.push(`Linha do quadro promoveu estado sem evidência: ${row.split(',')[0] ?? 'desconhecida'}.`);
    }
  }

  const prohibited = [
    { re: /\bR\$\s*\d/iu, label: 'preço' },
    { re: /\b(?:compre|comprar)\s+agora\b/iu, label: 'CTA transacional' },
    { re: /\búltimas?\s+(?:vagas?|unidades?)\b/iu, label: 'escassez artificial' },
    { re: /\bgarante?\s+(?:resultado|vendas?|resposta)/iu, label: 'garantia não comprovada' },
    { re: /\b100%\s+privad[oa]\b/iu, label: 'claim absoluto de privacidade' },
    { re: /https?:\/\//iu, label: 'URL externa' },
  ];

  for (const { re, label } of prohibited) {
    if (re.test(board)) errors.push(`Quadro contém padrão proibido: ${label}.`);
  }

  if (!board.includes('GF-QA-10 pendente')) errors.push('Quadro perdeu estado GF-QA-10 pendente.');
  if (!board.includes('QA físico contextual móvel pendente')) errors.push('Quadro perdeu QA físico contextual móvel pendente.');
  if (!board.includes('REPOR é alerta e não autorização de compra')) errors.push('Quadro perdeu guardrail de REPOR.');
  if (!board.includes('EM PREPARAÇÃO')) errors.push('Quadro perdeu estado EM PREPARAÇÃO do Pro Kit.');
}

if (errors.length) {
  console.error('Gate da biblioteca social falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Gate da biblioteca social aprovado: 18 peças candidatas e quadro de produção preservam estados e guardrails.');