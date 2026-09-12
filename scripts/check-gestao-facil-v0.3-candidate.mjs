import { readFile } from 'node:fs/promises';

const spec = await readFile(new URL('../docs/products/gestao-facil/V0.3_CANDIDATE_BUILD.md', import.meta.url), 'utf8');
const qa = await readFile(new URL('../docs/products/gestao-facil/V0.3_CANDIDATE_QA.csv', import.meta.url), 'utf8');
const failures = [];

for (const sheet of ['Leia-me','Dashboard','Clientes','Vendas','Tarefas','Estoque','Financeiro','Listas']) {
  if (!spec.includes(`\`${sheet}\``)) failures.push(`aba ausente: ${sheet}`);
}
for (const kpi of ['Clientes cadastrados','Clientes qualificados','Vendas abertas','Vendas ganhas','Tarefas pendentes','Itens para reposição','Tarefas vencidas']) {
  if (!spec.includes(kpi)) failures.push(`KPI ausente: ${kpi}`);
}
for (let i = 1; i <= 18; i += 1) {
  const id = `GF3-QA-${String(i).padStart(2, '0')}`;
  if (!qa.includes(id)) failures.push(`QA ausente: ${id}`);
}
for (let i = 11; i <= 18; i += 1) {
  const id = `GF3-QA-${String(i).padStart(2, '0')}`;
  const row = qa.split('\n').find((line) => line.startsWith(`${id},`));
  if (!row?.includes(',PENDING,')) failures.push(`${id} deve permanecer PENDING`);
}
if (!spec.includes('a0e14b520fcb7b4b62cdb20d4b51031deb38672129ba5a35c8baad5264f3a8fa')) failures.push('hash da candidata não registrado');
if (!spec.includes('não implica `release_ready=true`')) failures.push('limite de release ausente');

if (failures.length) {
  console.error('Falha no gate da Gestão Fácil v0.3');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Gestão Fácil v0.3 candidate spec: PASS');
console.log('qa_auto=GF3-QA-01..10');
console.log('qa_physical=GF3-QA-11..18 PENDING');
