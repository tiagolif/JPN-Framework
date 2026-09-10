import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const guidePath = path.join(root, 'docs/product-system/CUSTOMER_ONBOARDING_v1.md');
const checklistPath = path.join(root, 'docs/product-system/CUSTOMER_ONBOARDING_CHECKLIST_v1.csv');
const guide = await readFile(guidePath, 'utf8');
const checklist = await readFile(checklistPath, 'utf8');
const errors = [];

for (const marker of [
  'ONB-01', 'ONB-02', 'ONB-03', 'ONB-04', 'ONB-05', 'ONB-06',
  'Método JPN', 'JPN Prompt Pack', 'JPN Business', 'JPN Prompt Builder', 'JPN Gestão Fácil', 'JPN Pro Kit',
  'confirmed', 'inferred', 'unknown', 'conflicting',
  '18 templates canônicos', '12 playbooks canônicos',
  'QA físico contextual em celular real', 'GF-QA-10', 'REPOR', 'EM PREPARAÇÃO',
  'não torna um produto release-ready',
]) {
  if (!guide.includes(marker)) errors.push(`Guia de onboarding deve preservar: ${marker}`);
}

const rows = checklist.trim().split(/\r?\n/);
if (rows.length !== 17) errors.push(`Checklist deve conter cabeçalho + 16 itens; encontrado=${rows.length}.`);
for (let i = 1; i <= 16; i += 1) {
  const id = `ONB-C${String(i).padStart(2, '0')}`;
  if (!checklist.includes(id)) errors.push(`Checklist ausente: ${id}`);
}

const pendingCount = (checklist.match(/,PENDING,/g) ?? []).length;
if (pendingCount !== 16) errors.push(`Todos os 16 itens devem iniciar em PENDING; encontrado=${pendingCount}.`);
if (/,PASSED,|,DONE,|,CONCLUIDO,/i.test(checklist)) errors.push('Checklist candidato não pode iniciar com item concluído.');

for (const forbidden of [
  /api[_ -]?key/i,
  /token\s*[:=]/i,
  /senha\s*[:=]/i,
  /cart[aã]o\s+(de\s+)?cr[eé]dito/i,
  /checkout/i,
  /compre agora/i,
  /garantia de resultado/i,
]) {
  if (forbidden.test(guide) || forbidden.test(checklist)) errors.push(`Padrão proibido encontrado: ${forbidden}`);
}

if (!/nenhum dado financeiro real/i.test(guide)) errors.push('Guia deve bloquear dados financeiros reais em exemplos/demonstrações.');
if (!/nenhum anúncio, post ou campanha foi publicado/i.test(guide)) errors.push('Guia deve preservar bloqueio de publicação.');
if (!/nenhum termo legal foi aceito/i.test(guide)) errors.push('Guia deve preservar bloqueio de aceite legal.');
if (!/nenhuma conta externa foi criada/i.test(guide)) errors.push('Guia deve preservar bloqueio de criação de conta externa.');

if (errors.length) {
  console.error('Customer onboarding check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Customer onboarding check OK: 6 produtos, 16 itens PENDING e guardrails preservados.');
