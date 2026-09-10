import { readFile } from 'node:fs/promises';

const modelPath = new URL('../docs/products/gestao-facil/DATA_MODEL_v0.2.md', import.meta.url);
const rhythmPath = new URL('../docs/products/gestao-facil/OPERATING_RHYTHM_v0.2.md', import.meta.url);

const [model, rhythm] = await Promise.all([
  readFile(modelPath, 'utf8'),
  readFile(rhythmPath, 'utf8'),
]);

const requiredSheets = [
  'Leia-me',
  'Dashboard',
  'Clientes',
  'Vendas',
  'Tarefas',
  'Estoque',
  'Financeiro',
  'Listas',
];

const requiredKpis = [
  'Clientes cadastrados',
  'Clientes qualificados',
  'Vendas abertas',
  'Vendas ganhas',
  'Tarefas pendentes',
  'Itens para reposição',
  'Saldo registrado',
];

const requiredSafetyTerms = [
  'não substitui sistemas contábeis',
  'senha',
  'token',
  'credencial',
  'REPOR',
];

const requiredFlows = [
  'Novo contato',
  'Nova oportunidade',
  'Venda concluída',
  'Oportunidade perdida',
  'Item abaixo do mínimo',
  'Atividade concluída',
];

const failures = [];

for (const sheet of requiredSheets) {
  if (!model.includes(sheet)) failures.push(`aba ausente no modelo: ${sheet}`);
}

for (const kpi of requiredKpis) {
  if (!model.toLowerCase().includes(kpi.toLowerCase())) failures.push(`KPI ausente no modelo: ${kpi}`);
}

for (const term of requiredSafetyTerms) {
  if (!model.toLowerCase().includes(term.toLowerCase()) && !rhythm.toLowerCase().includes(term.toLowerCase())) {
    failures.push(`guardrail ausente: ${term}`);
  }
}

for (const flow of requiredFlows) {
  if (!rhythm.includes(flow)) failures.push(`fluxo operacional ausente: ${flow}`);
}

if (!model.includes('Quantidade × Valor unitário')) {
  failures.push('regra canônica de Valor total ausente');
}

if (!model.includes('atual <= mínimo')) {
  failures.push('regra canônica de reposição ausente');
}

if (!model.includes('Entrada') || !model.includes('Saída')) {
  failures.push('tipos financeiros canônicos ausentes');
}

if (failures.length) {
  console.error('Falha no gate da JPN Gestão Fácil:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

await import('./check-gestao-facil-quick-start.mjs');
if (process.exitCode) {
  throw new Error('Guia de início rápido da JPN Gestão Fácil falhou no gate.');
}

await import('./check-gestao-facil-data-dictionary.mjs');
if (process.exitCode) {
  throw new Error('Dicionário operacional da JPN Gestão Fácil falhou no gate.');
}

console.log(`Gestão Fácil: modelo v0.2 íntegro (${requiredSheets.length} abas, ${requiredKpis.length} KPIs, ${requiredFlows.length} fluxos) + guia de início rápido + dicionário operacional validados.`);
