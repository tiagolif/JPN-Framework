import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mdPath = path.join(root, 'docs', 'product-system', 'RELEASE_EVIDENCE_REGISTER_v1.md');
const csvPath = path.join(root, 'docs', 'product-system', 'RELEASE_EVIDENCE_REGISTER_v1.csv');
const errors = [];

for (const file of [mdPath, csvPath]) {
  if (!fs.existsSync(file)) errors.push(`${path.relative(root, file)} ausente.`);
}

if (fs.existsSync(mdPath)) {
  const md = fs.readFileSync(mdPath, 'utf8');
  for (let i = 1; i <= 16; i += 1) {
    const id = `EV-${String(i).padStart(2, '0')}`;
    if (!md.includes(id)) errors.push(`${id} ausente do registro Markdown.`);
  }
  for (const marker of [
    '`PENDING`', '`IN_PROGRESS`', '`PASSED`', '`FAILED`', '`BLOCKED`',
    'GF-QA-10', 'Microsoft Excel', 'LibreOffice Calc', 'Google Sheets',
    'celular real', 'SHA-256', 'mesmo head congelado',
    'publicação de site, anúncio ou conteúdo externo',
    'aceite de termos legais', 'dados financeiros reais',
  ]) {
    if (!md.includes(marker)) errors.push(`Registro Markdown perdeu marcador obrigatório: ${marker}`);
  }
}

if (fs.existsSync(csvPath)) {
  const csv = fs.readFileSync(csvPath, 'utf8').trim();
  const lines = csv.split(/\r?\n/u);
  const header = 'evidence_id,area,status,artifact_or_commit,environment,executed_at,evidence_path,reviewed_by,notes';
  if (lines[0] !== header) errors.push('Cabeçalho do CSV diverge do modelo canônico.');
  if (lines.length !== 17) errors.push(`CSV deve ter 16 evidências + cabeçalho; linhas encontradas=${lines.length}.`);

  const body = lines.slice(1);
  for (let i = 1; i <= 16; i += 1) {
    const id = `EV-${String(i).padStart(2, '0')}`;
    const row = body.find((line) => line.startsWith(`${id},`));
    if (!row) {
      errors.push(`${id} ausente do CSV.`);
      continue;
    }
    const cols = row.split(',');
    if (cols[2] !== 'PENDING') errors.push(`${id} deve iniciar como PENDING; encontrado=${cols[2] ?? 'vazio'}.`);
  }

  if (/\bPASSED\b/u.test(body.join('\n'))) errors.push('CSV inicial não pode promover nenhuma evidência para PASSED.');
  if (/\bR\$\s*\d|https?:\/\/|(?:api[_-]?key|token|secret|password)\s*=/iu.test(csv)) {
    errors.push('CSV contém padrão de dado financeiro, URL ou credencial não permitido.');
  }
}

if (errors.length) {
  console.error('Release evidence register check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Release evidence register check OK: 16 evidências preservadas em PENDING e guardrails mantidos.');