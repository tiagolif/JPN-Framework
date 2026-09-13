import { access, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const specText = await readFile(path.join(root, 'docs/products/gestao-facil/V0.3_CANDIDATE_BUILD.md'), 'utf8');
const qa = await readFile(path.join(root, 'docs/products/gestao-facil/V0.3_CANDIDATE_QA.csv'), 'utf8');
const workbook = JSON.parse(await readFile(path.join(root, 'docs/products/gestao-facil/WORKBOOK_SPEC_v0.3.json'), 'utf8'));
const failures = [];

const canonicalSheets = ['Leia-me','Dashboard','Clientes','Vendas','Tarefas','Estoque','Financeiro','Listas'];
const sheetNames = workbook.sheets?.map((sheet) => sheet.name) ?? [];
if (JSON.stringify(sheetNames) !== JSON.stringify(canonicalSheets)) failures.push(`abas canônicas divergentes: ${sheetNames.join(', ')}`);

const canonicalKpis = ['Clientes cadastrados','Clientes qualificados','Vendas abertas','Vendas ganhas','Tarefas pendentes','Itens para reposição','Tarefas vencidas','Saldo registrado'];
const dashboard = workbook.sheets.find((sheet) => sheet.name === 'Dashboard');
for (const kpi of canonicalKpis) if (!dashboard?.kpis?.includes(kpi)) failures.push(`KPI ausente do contrato: ${kpi}`);
if (dashboard?.chart !== 'Situação das vendas') failures.push('gráfico operacional divergente');

const vendas = workbook.sheets.find((sheet) => sheet.name === 'Vendas');
const estoque = workbook.sheets.find((sheet) => sheet.name === 'Estoque');
const financeiro = workbook.sheets.find((sheet) => sheet.name === 'Financeiro');
if (!vendas?.calculated_fields?.['Valor total']?.includes('Quantidade*Valor unitário')) failures.push('regra de Valor total ausente');
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
if (workbook.sample_data_policy?.fictitious_only !== true) failures.push('dados fictícios devem ser obrigatórios');
if (workbook.sample_data_policy?.sales_values_zero !== true) failures.push('valores de venda da amostra devem permanecer zerados');
if (workbook.sample_data_policy?.finance_rows_empty !== true) failures.push('Financeiro deve permanecer vazio');
if (workbook.sample_data_policy?.real_financial_data_required !== false) failures.push('dados financeiros reais não podem ser requisito');

const candidate = workbook.repository_candidate ?? {};
if (candidate.repository_binary_promoted !== true) failures.push('binário candidato versionado deve estar registrado como promovido');
if (candidate.promotion_scope !== 'candidate only; not a release') failures.push('escopo da promoção binária deve continuar limitado a candidata');
if (!/^[a-f0-9]{64}$/.test(candidate.sha256 ?? '')) failures.push('SHA-256 do binário candidato inválido');
if (!(candidate.size_bytes > 0)) failures.push('tamanho do binário candidato inválido');
if (!candidate.path?.endsWith('.xlsx')) failures.push('caminho do XLSX candidato ausente');

if (candidate.path) {
  const binaryPath = path.join(root, candidate.path);
  try {
    await access(binaryPath);
    const bytes = await readFile(binaryPath);
    const digest = createHash('sha256').update(bytes).digest('hex');
    const info = await stat(binaryPath);
    if (digest !== candidate.sha256) failures.push(`SHA-256 divergente: contrato=${candidate.sha256}, arquivo=${digest}`);
    if (info.size !== candidate.size_bytes) failures.push(`tamanho divergente: contrato=${candidate.size_bytes}, arquivo=${info.size}`);
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) failures.push('arquivo candidato não possui assinatura ZIP/OOXML esperada');
  } catch (error) {
    failures.push(`XLSX candidato não acessível: ${error.message}`);
  }
}

const observed = workbook.dashboard_observed ?? {};
const expectedObserved = {'Clientes cadastrados':3,'Clientes qualificados':1,'Vendas abertas':2,'Vendas ganhas':1,'Tarefas pendentes':2,'Itens para reposição':1,'Tarefas vencidas':0,'Saldo registrado':0};
for (const [label, expected] of Object.entries(expectedObserved)) if (observed[label] !== expected) failures.push(`evidência divergente para ${label}: ${observed[label]}`);

const guardrails = (workbook.guardrails ?? []).join('\n');
for (const required of ['não autoriza compra','não substitui contabilidade','não registrar senhas','teste físico','não implica release_ready=true']) if (!guardrails.includes(required)) failures.push(`guardrail ausente: ${required}`);
if (!specText.includes('não implica `release_ready=true`')) failures.push('limite histórico de release ausente');

if (failures.length) {
  console.error('Falha no gate da Gestão Fácil v0.3');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Gestão Fácil v0.3 candidate contract + binary integrity: PASS');
console.log(`candidate_path=${candidate.path}`);
console.log(`candidate_sha256=${candidate.sha256}`);
console.log(`candidate_size_bytes=${candidate.size_bytes}`);
console.log('qa_physical=GF3-QA-11..18 PENDING');
console.log('release_ready=false');
console.log('publication_authorized=false');
