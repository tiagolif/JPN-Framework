import fs from 'node:fs';

const path = 'docs/products/metodo-jpn/METODO_JPN_CASEBOOK_v1.md';
const checklistPath = 'docs/products/metodo-jpn/CASEBOOK_REVIEW_CHECKLIST_v1.csv';
const text = fs.readFileSync(path, 'utf8');
const checklist = fs.readFileSync(checklistPath, 'utf8').trim();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(text.includes('JPN Framework `0.3.0-draft`'), 'Casebook deve declarar a base metodológica canônica.');
assert(text.includes('`METODO_JPN_v1.md`'), 'Casebook deve apontar para a fonte canônica do Método.');
assert(text.includes('candidate companion / editorial and visual QA pending'), 'Casebook deve preservar estado candidato.');

for (const state of ['`confirmed`', '`inferred`', '`unknown`', '`conflicting`']) {
  assert(text.includes(state), `Estado de confiança ausente: ${state}`);
}

for (let index = 1; index <= 5; index += 1) {
  const id = `CJ-0${index}`;
  assert(text.includes(`## Caso ${id}`), `Caso obrigatório ausente: ${id}`);
}

for (const section of [
  '### 1. Solicitação original',
  '### 2. Jornada',
  '### 3. Estados de confiança',
  '### 4. Precisão',
  '### 5. Narrativa',
  '### 6. Instrução JPN consolidada',
  '### 7. Saída candidata resumida',
  '### 8. Revisão',
  '### 9. Decisão',
]) {
  const occurrences = text.split(section).length - 1;
  assert(occurrences === 5, `${section} deve aparecer exatamente 5 vezes; encontrou ${occurrences}.`);
}

for (const product of ['JPN Prompt Builder', 'JPN Prompt Pack', 'JPN Business', 'JPN Gestão Fácil', 'JPN Pro Kit']) {
  assert(text.includes(`**${product}:**`), `Relação com produto ausente: ${product}`);
}

for (const invariant of [
  '18 templates canônicos',
  '12 playbooks canônicos',
  '`REPOR` é somente alerta, nunca autorização de compra',
  '`GF-QA-10` multiplataforma continua pendente',
  'QA físico contextual em celular continua pendente',
  'permanece `EM PREPARAÇÃO`',
]) {
  assert(text.includes(invariant), `Invariante de produto ausente: ${invariant}`);
}

for (const guardrail of [
  'gasto ou compra não autorizada',
  'publicação, anúncio ou envio externo não autorizado',
  'uso de dados financeiros reais para decisão',
  'credenciais reais',
  'aceite de termos legais',
  'criação de conta que exija verificação de identidade',
  'promoção de QA ou release sem a evidência correspondente',
]) {
  assert(text.includes(guardrail), `Guardrail ausente: ${guardrail}`);
}

for (const prohibited of [
  'publication_authorized: true',
  'release_ready: true',
  'visual_qa: approved',
  'GF-QA-10: PASSED',
  'QA físico: PASSED',
  'garante respostas corretas',
  'elimina alucinações',
]) {
  assert(!text.includes(prohibited), `Claim ou promoção indevida encontrada: ${prohibited}`);
}

assert(text.includes('Os casos são didáticos e fictícios.'), 'Casebook deve declarar que os casos são fictícios.');
assert(text.includes('não usam dados financeiros reais, credenciais, URLs privadas ou informações pessoais reais'), 'Casebook deve declarar sanitização dos exemplos.');
assert(text.includes('inferência não vira fato apenas porque parece provável'), 'Casebook deve preservar regra central de confiança.');

const rows = checklist.split(/\r?\n/);
assert(rows[0] === 'id,case_id,check,status,evidence', 'Cabeçalho do checklist divergiu do contrato.');
assert(rows.length === 16, `Checklist deve conter cabeçalho + 15 itens; encontrou ${rows.length} linhas.`);

const ids = new Set();
for (const row of rows.slice(1)) {
  const [id, caseId, check, status, evidence = ''] = row.split(',');
  assert(/^CB-QA-(0[1-9]|1[0-5])$/.test(id), `ID inválido no checklist: ${id}`);
  assert(!ids.has(id), `ID duplicado no checklist: ${id}`);
  ids.add(id);
  assert(/^CJ-0[1-5]$/.test(caseId), `case_id inválido em ${id}: ${caseId}`);
  assert(check?.trim(), `Descrição de verificação ausente em ${id}.`);
  assert(status === 'PENDING', `${id} deve iniciar em PENDING, encontrou ${status}.`);
  assert(evidence === '', `${id} não deve inventar evidência antes da revisão humana.`);
}

for (let index = 1; index <= 15; index += 1) {
  const id = `CB-QA-${String(index).padStart(2, '0')}`;
  assert(ids.has(id), `Item obrigatório ausente no checklist: ${id}`);
}

console.log('Método JPN casebook: PASS');
console.log('Casos: 5 cenários completos CJ-01..CJ-05');
console.log('Checklist: 15 verificações CB-QA-01..CB-QA-15, todas PENDING');
console.log('Estrutura: Jornada + Precisão + Narrativa + revisão + decisão');
console.log('Guardrails: preservados; sem promoção artificial de QA/release');
