import { readFile } from 'node:fs/promises';

const base = new URL('../docs/products/gestao-facil/', import.meta.url);
const kitPath = new URL('STARTER_DATA_KIT_v0.1.md', base);

const specs = [
  {
    id: 'GF-SD-01',
    file: 'starter-data/clientes.csv',
    header: 'ID,Nome/Empresa,Contato,Canal,Etapa,Responsável,Próxima ação,Data da próxima ação,Observações',
  },
  {
    id: 'GF-SD-02',
    file: 'starter-data/vendas.csv',
    header: 'ID,Data,Cliente,Produto/Serviço,Etapa,Responsável,Quantidade,Valor unitário,Próxima ação,Observações',
  },
  {
    id: 'GF-SD-03',
    file: 'starter-data/tarefas.csv',
    header: 'Tarefa,Categoria,Responsável,Prioridade,Status,Início,Prazo,Próximo passo,Observações',
  },
  {
    id: 'GF-SD-04',
    file: 'starter-data/estoque.csv',
    header: 'Código,Item,Categoria,Unidade,Estoque atual,Estoque mínimo,Fornecedor,Observações',
  },
  {
    id: 'GF-SD-05',
    file: 'starter-data/financeiro.csv',
    header: 'ID,Data,Tipo,Descrição,Categoria,Centro/Projeto,Valor,Status,Vencimento,Observações',
  },
];

const failures = [];
const kit = await readFile(kitPath, 'utf8');

for (const marker of [
  'candidate companion / human spreadsheet QA pending',
  'GF-QA-10',
  'dados fictícios',
  'REPOR',
  'alerta',
  'não autorização',
  'não altera o XLSX candidato',
  'não cria importador automático',
]) {
  if (!kit.toLowerCase().includes(marker.toLowerCase())) failures.push(`marcador ausente no Starter Data Kit: ${marker}`);
}

for (const spec of specs) {
  if (!kit.includes(spec.id) || !kit.includes(spec.file)) {
    failures.push(`referência ausente no guia: ${spec.id} / ${spec.file}`);
  }

  const content = await readFile(new URL(spec.file, base), 'utf8');
  const lines = content.trimEnd().split(/\r?\n/);
  if (lines[0] !== spec.header) failures.push(`cabeçalho divergente: ${spec.file}`);
  if (lines.length !== 2) failures.push(`modelo deve conter exatamente cabeçalho + 1 exemplo: ${spec.file}`);

  const lower = content.toLowerCase();
  for (const forbidden of ['senha,', 'token,', 'cartão,', 'cvv,', 'credencial,', 'http://', 'https://']) {
    if (lower.includes(forbidden)) failures.push(`conteúdo proibido em ${spec.file}: ${forbidden}`);
  }
}

const vendas = await readFile(new URL('starter-data/vendas.csv', base), 'utf8');
const vendasLines = vendas.trimEnd().split(/\r?\n/);
if (vendasLines[0].includes('Valor total')) failures.push('vendas.csv não deve expor o campo calculado Valor total');
const vendaCells = vendasLines[1].split(',');
if (vendaCells[7] !== '') failures.push('valor unitário demonstrativo deve permanecer vazio em vendas.csv');

const estoque = await readFile(new URL('starter-data/estoque.csv', base), 'utf8');
if (estoque.split(/\r?\n/)[0].includes('Reposição?')) failures.push('estoque.csv não deve expor o campo calculado Reposição?');

const financeiro = await readFile(new URL('starter-data/financeiro.csv', base), 'utf8');
const financeiroLines = financeiro.trimEnd().split(/\r?\n/);
const financeiroCells = financeiroLines[1].split(',');
if (financeiroCells[6] !== '') failures.push('Valor do exemplo financeiro deve permanecer vazio');

if (!kit.includes('Excel') || !kit.includes('LibreOffice Calc') || !kit.includes('Google Sheets')) {
  failures.push('limite multiplataforma deve citar Excel, LibreOffice Calc e Google Sheets');
}

if (failures.length) {
  console.error('Falha no gate do Starter Data Kit da JPN Gestão Fácil:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Gestão Fácil Starter Data Kit: ${specs.length} modelos CSV validados; valores financeiros demonstrativos permanecem vazios e GF-QA-10 segue pendente.`);
