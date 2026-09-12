import { readFile } from 'node:fs/promises';

const specText = await readFile(new URL('../docs/products/gestao-facil/V0.3_CANDIDATE_BUILD.md', import.meta.url), 'utf8');
const qa = await readFile(new URL('../docs/products/gestao-facil/V0.3_CANDIDATE_QA.csv', import.meta.url), 'utf8');
const workbook = JSON.parse(await readFile(new URL('../docs/products/gestao-facil/WORKBOOK_SPEC_v0.3.json', import.meta.url), 'utf8'));
const failures = [];

const canonicalSheets = ['Leia-me','Dashboard','Clientes','Vendas','Tarefas','Estoque','Financeiro','Listas'];
const sheetNames = workbook.sheets?.map((sheet) => sheet.name) ?? [];
if (JSON.stringify(sheetNames) !== JSON.stringify(canonicalSheets)) {
  failures.push(`abas canônicas divergentes: ${sheetNames.join(', ')}`);
}
for (const sheet of canonicalSheets) {
  if (!specText.includes(`\`${sheet}\``)) failures.push(`aba ausente da evidência histórica: ${sheet}`);
}

const canonicalKpis = [
  'Clientes cadastrados',
  'Clientes qualificados',
  'Vendas abertas',
  'Vendas ganhas',
  'Tarefas pendentes',
  'Itens para reposição',
  'Tarefas vencidas',
];
const dashboard = workbook.sheets.find((sheet) => sheet.name === 'Dashboard');
for (const kpi of canonicalKpis) {
  if (!specText.includes(kpi)) failures.push(`KPI ausente da evidência histórica: ${kpi}`);
  if (!dashboard?.kpis?.includes(kpi)) failures.push(`KPI ausente do contrato: ${kpi}`);
}
if (!dashboard?.kpis?.includes('Saldo registrado')) failures.push('Saldo registrado ausente do contrato');
if (dashboard?.chart !== 'Situação das vendas') failures.push('gráfico operacional divergente');

const vendas = workbook.sheets.find((sheet) => sheet.name === 'Vendas');
const estoque = workbook.sheets.find((sheet) => sheet.name === 'Estoque');
const financeiro = workbook.sheets.find((sheet) => sheet.name === 'Financeiro');
if (!vendas?.headers?.includes('Valor total')) failures.push('Valor total ausente de Vendas');
if (!vendas?.calculated_fields?.['Valor total']?.includes('Quantidade*Valor unitário')) failures.push('regra de Valor total ausente');
if (!estoque?.headers?.includes('Reposição?')) failures.push('Reposição? ausente de Estoque');
if (!estoque?.calculated_fields?.['Reposição?']?.includes('REPOR')) failures.push('regra REPOR ausente');
if (financeiro?.candidate_seed_rule !== 'sem exemplos monetários preenchidos') failures.push('Financeiro deve iniciar sem exemplos monetários');

for (let i = 1; i <= 18; i += 1) {
  const id = `GF3-QA-${String(i).padStart(2, '0')}`;
  if (!qa.includes(id)) failures.push(`QA ausente: ${id}`);
}
for (let i = 11; i <= 18; i += 1) {
  const id = `GF3-QA-${String(i).padStart(2, '0')}`;
  const row = qa.split('\n').find((line) => line.startsWith(`${id},`));
  if (!row?.includes(',PENDING,')) failures.push(`${id} deve permanecer PENDING`);
}

if (workbook.release_ready !== false) failures.push('release_ready deve permanecer false');
if (workbook.publication_authorized !== false) failures.push('publication_authorized deve permanecer false');
if (workbook.sample_data_policy?.fictitious_only !== true) failures.push('dados fictícios devem ser obrigatórios na candidata');
if (workbook.sample_data_policy?.finance_rows_empty !== true) failures.push('Financeiro deve permanecer vazio na candidata');
if (workbook.sample_data_policy?.real_financial_data_required !== false) failures.push('dados financeiros reais não podem ser requisito de QA');
if (workbook.local_candidate_evidence?.repository_binary_promoted !== false) failures.push('binário não deve ser marcado como promovido');
if (!/^[a-f0-9]{64}$/.test(workbook.local_candidate_evidence?.sha256 ?? '')) failures.push('SHA-256 local inválido');
if (!(workbook.local_candidate_evidence?.size_bytes > 0)) failures.push('tamanho da candidata local inválido');
if (workbook.local_candidate_evidence?.formula_error_scan !== 0) failures.push('varredura local deve registrar zero erros de fórmula');

const observed = workbook.local_candidate_evidence?.dashboard_observed ?? {};
const expectedObserved = {
  'Clientes cadastrados': 3,
  'Clientes qualificados': 1,
  'Vendas abertas': 2,
  'Vendas ganhas': 1,
  'Tarefas pendentes': 2,
  'Itens para reposição': 1,
  'Tarefas vencidas': 0,
  'Saldo registrado': 0,
};
for (const [label, expected] of Object.entries(expectedObserved)) {
  if (observed[label] !== expected) failures.push(`evidência local divergente para ${label}: ${observed[label]}`);
}

const guardrails = (workbook.guardrails ?? []).join('\n');
for (const required of ['não autoriza compra','não substitui contabilidade','não registrar senhas','teste físico','não implica release_ready=true']) {
  if (!guardrails.includes(required)) failures.push(`guardrail ausente: ${required}`);
}

if (!specText.includes('não implica `release_ready=true`')) failures.push('limite histórico de release ausente');

if (failures.length) {
  console.error('Falha no gate da Gestão Fácil v0.3');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Gestão Fácil v0.3 candidate contract: PASS');
console.log(`local_candidate_sha256=${workbook.local_candidate_evidence.sha256}`);
console.log('qa_auto=GF3-QA-01..10');
console.log('qa_physical=GF3-QA-11..18 PENDING');
console.log('release_ready=false');
