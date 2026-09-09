import { readFile } from 'node:fs/promises';

const guidePath = new URL('../docs/products/gestao-facil/QUICK_START_v0.1.md', import.meta.url);
const guide = await readFile(guidePath, 'utf8');

const failures = [];
const requireText = (text, label = text) => {
  if (!guide.includes(text)) failures.push(`ausente: ${label}`);
};

requireText('# JPN Gestão Fácil — Guia de início rápido v0.1', 'título canônico');
requireText('candidate companion / human spreadsheet QA pending', 'estado candidato');
requireText('`MANUAL_v0.1.md`', 'fonte manual');
requireText('`DATA_MODEL_v0.2.md`', 'fonte do modelo');
requireText('`OPERATING_RHYTHM_v0.2.md`', 'fonte do ritmo operacional');

for (const sheet of ['Leia-me', 'Dashboard', 'Clientes', 'Vendas', 'Tarefas', 'Estoque', 'Financeiro', 'Listas']) {
  requireText(sheet, `aba ${sheet}`);
}

for (const kpi of [
  'Clientes cadastrados',
  'Clientes qualificados',
  'Vendas abertas',
  'Vendas ganhas',
  'Tarefas pendentes',
  'Itens para reposição',
  'Saldo registrado',
]) {
  requireText(kpi, `KPI ${kpi}`);
}

for (const rule of [
  'Quantidade × Valor unitário',
  'estoque atual menor ou igual ao mínimo → esperado `REPOR`',
  'estoque atual maior que o mínimo → esperado `OK`',
  'Entradas − Saídas',
]) {
  requireText(rule, `regra ${rule}`);
}

for (const guardrail of [
  'Não armazene senhas, tokens, credenciais, números completos de cartão ou dados bancários sensíveis.',
  '`REPOR` é somente alerta operacional. Não autoriza compra, pedido a fornecedor, gasto ou contratação.',
  'não representa preço, faturamento ou dado financeiro real',
  'Não corrija um indicador digitando sobre o Dashboard.',
  'o mesmo XLSX candidato',
  'Microsoft Excel',
  'LibreOffice Calc',
  'Google Sheets',
  'GF-QA-10 continua pendente',
]) {
  requireText(guardrail, `guardrail ${guardrail}`);
}

for (const section of [
  '## Objetivo dos primeiros 30 minutos',
  '## Antes de preencher',
  '## Passo 1 — Leia-me',
  '## Passo 2 — Listas',
  '## Passo 3 — Cadastre um cliente de teste',
  '## Passo 4 — Crie uma oportunidade/venda de teste',
  '## Passo 5 — Crie a próxima tarefa',
  '## Passo 6 — Valide o sinal de estoque',
  '## Passo 7 — Financeiro com dados de demonstração',
  '## Passo 8 — Confira o Dashboard',
  '## Rotina mínima recomendada',
  '## Problemas comuns e primeira ação',
  '## Checklist de implantação inicial',
  '## Limites e estado de QA',
]) {
  requireText(section, `seção ${section}`);
}

for (const prohibited of [
  /GF-QA-10\s+(aprovado|concluído|passed)/iu,
  /compatibilidade\s+(garantida|total|100%)/iu,
  /publica(?:ção|r)\s+autorizad[ao]/iu,
  /compra\s+automática/iu,
  /substitui\s+(contador|ERP|sistema contábil)/iu,
]) {
  if (prohibited.test(guide)) failures.push(`claim/promoção indevida: ${prohibited}`);
}

if (failures.length) {
  console.error('Falha no guia de início rápido da JPN Gestão Fácil:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Gestão Fácil quick start: PASS — 8 abas, 7 KPIs, fluxo de implantação e guardrails preservados; GF-QA-10 continua pendente.');
