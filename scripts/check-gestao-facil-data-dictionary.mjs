import { readFile } from 'node:fs/promises';

const dictionaryPath = new URL('../docs/products/gestao-facil/OPERATIONAL_DATA_DICTIONARY_v0.1.md', import.meta.url);
const dictionary = await readFile(dictionaryPath, 'utf8');

const failures = [];
const requireText = (text, label = text) => {
  if (!dictionary.includes(text)) failures.push(`ausente: ${label}`);
};

requireText('# JPN Gestão Fácil — Dicionário operacional de dados v0.1', 'título canônico');
requireText('candidate companion / human spreadsheet QA pending', 'estado candidato');
requireText('`DATA_MODEL_v0.2.md`', 'fonte do modelo');
requireText('`MANUAL_v0.1.md`', 'fonte do manual');
requireText('`QUICK_START_v0.1.md`', 'fonte do quick start');
requireText('`OPERATING_RHYTHM_v0.2.md`', 'fonte do ritmo operacional');

for (const sheet of ['Leia-me', 'Dashboard', 'Clientes', 'Vendas', 'Tarefas', 'Estoque', 'Financeiro', 'Listas']) {
  requireText(`## Aba ${sheet}`, `seção da aba ${sheet}`);
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

for (const field of [
  'Nome/Empresa',
  'Próxima ação',
  'Data da próxima ação',
  'Produto/Serviço',
  'Quantidade',
  'Valor unitário',
  'Valor total',
  'Prioridade',
  'Status',
  'Próximo passo',
  'Código',
  'Estoque atual',
  'Estoque mínimo',
  'Reposição?',
  'Fornecedor',
  'Centro/Projeto',
  'Vencimento',
]) {
  requireText(field, `campo ${field}`);
}

for (const rule of [
  '`Novo`, `Contato`, `Qualificado`, `Proposta`, `Cliente`, `Inativo`',
  '`Ganha` e `Perdida`',
  '`Baixa`, `Média` ou `Alta`',
  '`Concluída` é o status terminal canônico',
  '`Quantidade × Valor unitário`',
  '`REPOR` se atual <= mínimo; senão `OK`',
  'Saldo registrado = `Entradas − Saídas`',
  'não dependa do número da linha',
  'campo calculado vazio por falta de insumo é preferível a erro ou valor inventado',
]) {
  requireText(rule, `regra ${rule}`);
}

for (const controlledList of [
  'Canal de cliente',
  'Etapa de cliente',
  'Etapa de venda',
  'Prioridade de tarefa',
  'Status de tarefa',
  'Tipo financeiro',
  'Status financeiro',
  'Unidade de estoque',
]) {
  requireText(controlledList, `lista controlada ${controlledList}`);
}

for (const guardrail of [
  'Não use senhas, tokens, credenciais, números completos de cartão, dados bancários sensíveis ou dados financeiros reais em testes e documentação.',
  '`REPOR` é somente alerta operacional. Não autoriza compra, pedido a fornecedor, gasto ou contratação.',
  'não representa saldo bancário, lucro contábil, caixa auditado ou posição fiscal',
  'não digite sobre o Dashboard para corrigir um número',
  'GF-QA-10 continua pendente',
  'o mesmo XLSX candidato',
  'Microsoft Excel',
  'LibreOffice Calc',
  'Google Sheets',
  'não autoriza publicação',
]) {
  requireText(guardrail, `guardrail ${guardrail}`);
}

for (const section of [
  '## Como usar este dicionário',
  '## Tipos de campo',
  '## Regras para IDs',
  '## Regras para datas e números',
  '## Erros comuns de preenchimento',
  '## Checklist antes de salvar',
  '## Estado de QA',
]) {
  requireText(section, `seção ${section}`);
}

for (const prohibited of [
  /GF-QA-10\s+(aprovado|concluído|passed)/iu,
  /compatibilidade\s+(garantida|total|100%)/iu,
  /publica(?:ção|r)\s+autorizad[ao]/iu,
  /compra\s+automática\s+(ativada|habilitada|autorizada)/iu,
  /substitui\s+(contador|contabilidade|ERP|sistema contábil)/iu,
  /saldo\s+bancário\s+garantido/iu,
]) {
  if (prohibited.test(dictionary)) failures.push(`claim/promoção indevida: ${prohibited}`);
}

if (failures.length) {
  console.error('Falha no dicionário operacional da JPN Gestão Fácil:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Gestão Fácil data dictionary: PASS — 8 abas, 7 KPIs, campos operacionais, listas controladas e guardrails preservados; GF-QA-10 continua pendente.');
