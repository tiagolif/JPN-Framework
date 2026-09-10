import { existsSync, readFileSync } from 'node:fs';

const planPath = 'docs/products/pro-kit/FIRST_WEEK_PLAN_v1.md';
const checklistPath = 'docs/products/pro-kit/FIRST_WEEK_CHECKLIST_v1.csv';

for (const path of [planPath, checklistPath]) {
  if (!existsSync(path)) throw new Error(`Artefato ausente: ${path}`);
}

const plan = readFileSync(planPath, 'utf8');
const checklist = readFileSync(checklistPath, 'utf8');

const requiredPlanMarkers = [
  'menor recurso suficiente',
  '## Dia 1',
  '## Dia 2',
  '## Dia 3',
  '## Dia 4',
  '## Dia 5',
  '## Dia 6',
  '## Dia 7',
  '18 templates',
  '12 playbooks',
  'GF-QA-10',
  'REPOR',
  'EM PREPARAÇÃO',
  'confirmed',
  'inferred',
  'unknown',
  'conflicting',
  'Modo Temporário',
  'QA físico contextual do Prompt Builder em celular continua pendente',
  'aceite de termos legais',
  'criação de conta que exija verificação de identidade'
];
for (const marker of requiredPlanMarkers) {
  if (!plan.includes(marker)) throw new Error(`Plano da primeira semana sem marcador: ${marker}`);
}

const dayCount = [...plan.matchAll(/^## Dia [1-7]/gm)].length;
if (dayCount !== 7) throw new Error(`Esperados 7 dias no plano; encontrados ${dayCount}`);

const rows = checklist.trim().split(/\r?\n/);
if (rows.length !== 17) throw new Error(`Checklist deveria conter cabeçalho + 16 itens; encontrou ${rows.length} linhas`);

for (let i = 1; i <= 16; i += 1) {
  const id = `FW-${String(i).padStart(2, '0')}`;
  if (!checklist.includes(id)) throw new Error(`Checklist sem ${id}`);
}

for (const row of rows.slice(1)) {
  const columns = row.split(',');
  if (columns[3] !== 'PENDING') throw new Error(`Item da primeira semana não inicia PENDING: ${row}`);
}

const forbiddenPatterns = [
  /\bR\$\s*\d/i,
  /https?:\/\//i,
  /compre agora/i,
  /garantia de resultado/i,
  /GF-QA-10\s+(?:aprovado|concluído|passou)/i,
  /REPOR\s+(?:autoriza|aprova|executa).*compra/i,
  /release_ready\s*[:=]\s*true/i
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(`${plan}\n${checklist}`)) {
    throw new Error(`Padrão bloqueado encontrado no plano/checklist da primeira semana: ${pattern}`);
  }
}

console.log(`PASS: plano da primeira semana do Pro Kit verificado (${dayCount} dias, 16 itens PENDING)`);
