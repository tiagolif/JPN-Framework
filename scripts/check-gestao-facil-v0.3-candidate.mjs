import { readFile, mkdtemp, rm, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = process.cwd();
const qa = await readFile(path.join(root, 'docs/products/gestao-facil/V0.3_CANDIDATE_QA.csv'), 'utf8');
const w = JSON.parse(await readFile(path.join(root, 'docs/products/gestao-facil/WORKBOOK_SPEC_v0.3.json'), 'utf8'));
const fail = [];
const sheets = ['Leia-me', 'Dashboard', 'Clientes', 'Vendas', 'Tarefas', 'Estoque', 'Financeiro', 'Listas'];

if (JSON.stringify(w.sheets?.map((x) => x.name)) !== JSON.stringify(sheets)) fail.push('abas canônicas divergentes');

const kpis = ['Clientes cadastrados', 'Clientes qualificados', 'Vendas abertas', 'Vendas ganhas', 'Tarefas pendentes', 'Itens para reposição', 'Tarefas vencidas', 'Saldo registrado'];
const dash = w.sheets.find((x) => x.name === 'Dashboard');
for (const k of kpis) if (!dash?.kpis?.includes(k)) fail.push(`KPI ausente: ${k}`);
if (dash?.chart !== 'Situação das vendas') fail.push('gráfico divergente');
if (!w.sheets.find((x) => x.name === 'Vendas')?.calculated_fields?.['Valor total']?.includes('Quantidade*Valor unitário')) fail.push('fórmula de Valor total ausente');
if (!w.sheets.find((x) => x.name === 'Estoque')?.calculated_fields?.['Reposição?']?.includes('REPOR')) fail.push('regra REPOR ausente');
if (w.sheets.find((x) => x.name === 'Financeiro')?.candidate_seed_rule !== 'sem exemplos monetários preenchidos') fail.push('Financeiro deve iniciar vazio');

for (let i = 1; i <= 18; i += 1) {
  const id = `GF3-QA-${String(i).padStart(2, '0')}`;
  if (!qa.includes(id)) fail.push(`QA ausente: ${id}`);
}
for (let i = 11; i <= 18; i += 1) {
  const id = `GF3-QA-${String(i).padStart(2, '0')}`;
  if (!qa.split('\n').find((x) => x.startsWith(id + ','))?.includes(',PENDING,')) fail.push(`${id} deve permanecer PENDING`);
}

if (w.release_ready !== false || w.publication_authorized !== false) fail.push('release/publicação devem permanecer false');
if (!w.sample_data_policy?.fictitious_only || !w.sample_data_policy?.sales_values_zero || !w.sample_data_policy?.finance_rows_empty || w.sample_data_policy?.real_financial_data_required !== false) fail.push('política de dados da candidata divergente');

const b = w.reproducible_build ?? {};
if (b.script !== 'scripts/build-gestao-facil-v0.3.py' || b.network_required !== false || b.external_dependencies !== false || b.repository_binary_promoted !== false) fail.push('contrato do build reproduzível divergente');
if (!b.verification_mode?.includes('two independent CI builds')) fail.push('modo de verificação reprodutível ausente');

const verified = w.verified_local_build ?? {};
if (verified.frozen !== false || verified.sha256 !== null || verified.size_bytes !== null) {
  fail.push('hash/tamanho finais não devem ser congelados antes do QA físico e freeze');
}

async function buildOnce(label) {
  const work = await mkdtemp(path.join(tmpdir(), `jpn-gf3-${label}-`));
  const out = path.join(work, 'candidate.xlsx');
  try {
    const run = spawnSync('python3', [path.join(root, b.script), out], { encoding: 'utf8' });
    if (run.status !== 0) {
      fail.push(`builder ${label} falhou: ${run.stderr || run.stdout}`);
      return null;
    }
    const bytes = await readFile(out);
    const info = await stat(out);
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) fail.push(`saída ${label} não possui assinatura ZIP/OOXML`);
    return {
      digest: createHash('sha256').update(bytes).digest('hex'),
      size: info.size,
    };
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

const first = await buildOnce('A');
const second = await buildOnce('B');
if (first && second) {
  if (first.digest !== second.digest) fail.push(`build não determinístico: sha A=${first.digest} sha B=${second.digest}`);
  if (first.size !== second.size) fail.push(`build não determinístico: bytes A=${first.size} bytes B=${second.size}`);
}

const g = (w.guardrails ?? []).join('\n');
for (const x of ['não autoriza compra', 'não substitui contabilidade', 'não registrar senhas', 'teste físico', 'não implica release_ready=true']) {
  if (!g.includes(x)) fail.push(`guardrail ausente: ${x}`);
}

if (fail.length) {
  console.error('Falha no gate Gestão Fácil v0.3');
  fail.forEach((x) => console.error('- ' + x));
  process.exit(1);
}

console.log('Gestão Fácil v0.3 reproducible build: PASS');
console.log(`candidate_sha256=${first.digest}`);
console.log(`candidate_size_bytes=${first.size}`);
console.log('reproducibility=two independent builds identical');
console.log('final_hash_frozen=false');
console.log('GF3-QA-11..18=PENDING; release_ready=false; publication_authorized=false');
