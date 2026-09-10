import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const policyPath = path.join(root, 'docs/product-system/SAFE_DATA_HANDLING_v1.md');
const checklistPath = path.join(root, 'docs/product-system/SAFE_DATA_REVIEW_CHECKLIST_v1.csv');

const policy = await readFile(policyPath, 'utf8');
const checklist = await readFile(checklistPath, 'utf8');
const errors = [];

for (const id of ['SD-01','SD-02','SD-03','SD-04','SD-05','SD-06','SD-07','SD-08']) {
  if (!policy.includes(id)) errors.push(`Política deve conter ${id}.`);
}
for (const id of ['SD-F01','SD-F02','SD-F03','SD-F04','SD-F05','SD-F06']) {
  if (!policy.includes(id)) errors.push(`Fluxo deve conter ${id}.`);
}
for (const product of ['Método JPN','JPN Prompt Pack','JPN Business','JPN Prompt Builder','JPN Gestão Fácil','JPN Pro Kit']) {
  if (!policy.includes(product)) errors.push(`Política deve cobrir ${product}.`);
}
for (const state of ['confirmed','inferred','unknown','conflicting']) {
  if (!policy.includes(state)) errors.push(`Política deve preservar estado ${state}.`);
}
for (const marker of ['18 templates', '12 playbooks', 'QA físico contextual em celular continua pendente', 'GF-QA-10', 'REPOR', 'EM PREPARAÇÃO']) {
  if (!policy.includes(marker)) errors.push(`Política deve preservar marcador: ${marker}.`);
}

const lines = checklist.trim().split(/\r?\n/);
if (lines.length !== 17) errors.push(`Checklist deve ter cabeçalho + 16 itens; encontrado ${lines.length} linhas.`);
for (let i = 1; i <= 16; i++) {
  const id = `SD-C${String(i).padStart(2, '0')}`;
  const line = lines.find((candidate) => candidate.startsWith(`${id},`));
  if (!line) errors.push(`Checklist ausente: ${id}.`);
  else if (!line.includes(',PENDING,')) errors.push(`${id} deve iniciar em PENDING.`);
}

const forbiddenPatterns = [
  /sk-[A-Za-z0-9_-]{16,}/,
  /AIza[0-9A-Za-z_-]{20,}/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/i,
];
for (const [label, text] of [['policy', policy], ['checklist', checklist]]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) errors.push(`${label}: padrão potencialmente sensível detectado (${pattern}).`);
  }
}

if (!/candidate internal policy/i.test(policy)) errors.push('Política deve permanecer candidata/interna.');
if (!policy.includes('não autoriza coleta, publicação, compra, contratação, criação de conta, aceite legal ou ação externa')) {
  errors.push('Política deve preservar regra explícita de não autorização externa.');
}

if (errors.length) {
  console.error('Safe data handling check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Safe data handling check OK: 8 princípios, 6 etapas e 16 verificações preservadas.');
