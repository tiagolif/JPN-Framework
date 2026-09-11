import { readFile } from 'node:fs/promises';

const specPath = new URL('../docs/products/gestao-facil/V0.2_CANDIDATE_BUILD.md', import.meta.url);
const qaPath = new URL('../docs/products/gestao-facil/V0.2_CANDIDATE_QA.csv', import.meta.url);

const [spec, qa] = await Promise.all([
  readFile(specPath, 'utf8'),
  readFile(qaPath, 'utf8'),
]);

const failures = [];
const requiredSheets = ['Leia-me','Dashboard','Clientes','Vendas','Tarefas','Estoque','Financeiro','Listas'];
const requiredKpis = ['Clientes cadastrados','Clientes qualificados','Vendas abertas','Vendas ganhas','Tarefas pendentes','Itens para reposição'];

for (const sheet of requiredSheets) {
  if (!spec.includes(`\`${sheet}\``)) failures.push(`aba v0.2 ausente da especificação: ${sheet}`);
}
for (const kpi of requiredKpis) {
  if (!spec.includes(kpi)) failures.push(`KPI v0.2 ausente da especificação: ${kpi}`);
}

for (let i = 1; i <= 18; i += 1) {
  const id = `GF2-QA-${String(i).padStart(2, '0')}`;
  if (!qa.includes(id)) failures.push(`item de QA ausente: ${id}`);
}

for (const id of ['GF2-QA-10','GF2-QA-11','GF2-QA-12','GF2-QA-13','GF2-QA-14','GF2-QA-15','GF2-QA-16','GF2-QA-17','GF2-QA-18']) {
  const row = qa.split('\n').find((line) => line.startsWith(`${id},`));
  if (!row || !row.includes(',PENDING,')) failures.push(`${id} deve permanecer PENDING até evidência física/humana`);
}

if (!spec.includes('GF-QA-10` continua `PENDING')) failures.push('GF-QA-10 canônico não está preservado como PENDING');
if (!spec.includes('REPOR` é somente alerta operacional')) failures.push('guardrail de REPOR ausente');
if (!spec.includes('não substitui contabilidade')) failures.push('limite financeiro ausente');
if (!spec.includes('não implica `release_ready=true`')) failures.push('não-claim de release ausente');
if (!spec.includes('9f43a089a360d767afa9b0f320c6dfd1e472a99168aca462f2a2fd6d1a24fff0')) failures.push('SHA-256 observado da candidata não registrado');

if (qa.match(/GF2-QA-(1[0-8]),[^\n]*,(AUTO_PASS|PASS|DONE|COMPLETE),/i)) {
  failures.push('QA físico/humano foi promovido indevidamente');
}

if (failures.length) {
  console.error('Falha no gate da candidata Gestão Fácil v0.2:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Gestão Fácil v0.2 candidate spec: PASS');
console.log('structure=8 sheets');
console.log('qa_auto=GF2-QA-01..09 AUTO_PASS');
console.log('qa_physical=GF2-QA-10..18 PENDING');

await import('./check-gestao-facil-operating-guide.mjs');
