import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const guidePath = path.join(root, 'docs/product-system/CUSTOMER_SUPPORT_PLAYBOOK_v1.md');
const csvPath = path.join(root, 'docs/product-system/SUPPORT_INTAKE_TEMPLATE_v1.csv');
const guide = await readFile(guidePath, 'utf8');
const csv = await readFile(csvPath, 'utf8');
const errors = [];

for (const marker of ['SUP-01', 'SUP-02', 'SUP-03', 'SUP-04', 'SUP-05', 'SUP-06']) {
  if (!guide.includes(marker)) errors.push(`Playbook sem etapa obrigatória ${marker}.`);
}

for (const product of ['Método JPN', 'JPN Prompt Pack', 'JPN Business', 'JPN Prompt Builder', 'JPN Gestão Fácil', 'JPN Pro Kit']) {
  if (!guide.includes(product)) errors.push(`Playbook sem cobertura explícita de ${product}.`);
}

for (const state of ['confirmed', 'inferred', 'unknown', 'conflicting']) {
  if (!guide.includes(`\`${state}\``)) errors.push(`Playbook deve preservar estado de confiança ${state}.`);
}

for (const category of ['DUVIDA_DE_USO', 'CONTEUDO', 'INTERFACE', 'DADOS', 'COMPATIBILIDADE', 'RELEASE_QA', 'BLOQUEIO_EXTERNO']) {
  if (!guide.includes(`\`${category}\``)) errors.push(`Categoria de suporte ausente: ${category}.`);
}

for (const severity of ['S1_CRITICO', 'S2_ALTO', 'S3_MEDIO', 'S4_BAIXO']) {
  if (!guide.includes(`\`${severity}\``)) errors.push(`Severidade ausente: ${severity}.`);
}

for (const required of [
  'QA físico contextual em celular real continua pendente',
  '`GF-QA-10` continua pendente',
  '`REPOR` continua somente um alerta operacional',
  'JPN Pro Kit permanece `EM PREPARAÇÃO`',
  'não transforma produto em `release_ready`',
]) {
  if (!guide.includes(required)) errors.push(`Playbook deve preservar: ${required}`);
}

const expectedHeader = 'ticket_id,produto,categoria,severidade,status,reproducao,descricao_curta,confianca_causa,causa,contorno_reversivel,proximo_passo,bloqueio_externo,evidencia_encerramento';
const [header, ...rows] = csv.trimEnd().split(/\r?\n/);
if (header !== expectedHeader) errors.push('SUPPORT_INTAKE_TEMPLATE_v1.csv possui cabeçalho divergente.');
if (rows.length !== 1) errors.push('Template de suporte deve conter exatamente uma linha de exemplo fictício.');
if (!rows[0]?.startsWith('SUP-EXEMPLO-001,')) errors.push('Linha de exemplo fictício ausente ou com ID inesperado.');
if (!rows[0]?.includes(',unknown,')) errors.push('Exemplo deve iniciar causa como unknown.');
if (!rows[0]?.includes(',NAO_TESTADO,')) errors.push('Exemplo deve iniciar reprodução como NAO_TESTADO.');

const forbidden = [
  /sk-[A-Za-z0-9_-]{12,}/,
  /ghp_[A-Za-z0-9]{20,}/,
  /AIza[A-Za-z0-9_-]{20,}/,
  /https?:\/\/[^,\s]+/i,
  /cart[aã]o/i,
  /pix/i,
  /senha\s*[:=]/i,
  /token\s*[:=]/i,
];
for (const pattern of forbidden) {
  if (pattern.test(csv)) errors.push(`Template CSV contém padrão proibido: ${pattern}`);
}

if (!/candidato interno/i.test(guide)) errors.push('Playbook deve permanecer explicitamente candidato interno.');
if (!/não representa SLA contratado/i.test(guide)) errors.push('Playbook não pode implicar SLA inexistente.');

if (errors.length) {
  console.error('Customer support playbook check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Customer support playbook check OK: fluxo SUP-01..06, 6 produtos e template de triagem validados.');
