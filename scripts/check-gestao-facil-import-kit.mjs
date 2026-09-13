import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const spec = JSON.parse(await readFile(path.join(root, 'docs/products/gestao-facil/WORKBOOK_SPEC_v0.3.json'), 'utf8'));
const kitRoot = path.join(root, 'docs/products/gestao-facil/importacao-v0.3');
const errors = [];

const expected = {
  clientes: 'Clientes',
  vendas: 'Vendas',
  tarefas: 'Tarefas',
  estoque: 'Estoque',
  financeiro: 'Financeiro',
};

const parseCsvLine = (line) => {
  const out = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      out.push(cell);
      cell = '';
    } else cell += ch;
  }
  out.push(cell);
  return out;
};

const sheets = new Map((spec.sheets ?? []).map((sheet) => [sheet.name, sheet]));
for (const [fileBase, sheetName] of Object.entries(expected)) {
  const sheet = sheets.get(sheetName);
  if (!sheet?.headers) {
    errors.push(`${sheetName}: headers ausentes em WORKBOOK_SPEC_v0.3.json.`);
    continue;
  }

  const file = path.join(kitRoot, `${fileBase}.csv`);
  let text = '';
  try { text = await readFile(file, 'utf8'); }
  catch { errors.push(`${fileBase}.csv ausente.`); continue; }

  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const lines = text.replace(/\r\n/g, '\n').split('\n').filter((line) => line.length > 0);
  if (lines.length === 0) { errors.push(`${fileBase}.csv vazio.`); continue; }

  const actualHeaders = parseCsvLine(lines[0]);
  if (JSON.stringify(actualHeaders) !== JSON.stringify(sheet.headers)) {
    errors.push(`${fileBase}.csv: cabeçalhos divergem da aba ${sheetName}.`);
  }

  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i]);
    if (cells.length !== sheet.headers.length) errors.push(`${fileBase}.csv linha ${i + 1}: ${cells.length} colunas; esperado ${sheet.headers.length}.`);
  }
}

const vendas = await readFile(path.join(kitRoot, 'vendas.csv'), 'utf8');
const vendasRows = vendas.replace(/\r\n/g, '\n').trim().split('\n');
if (vendasRows.length > 1) {
  const headers = parseCsvLine(vendasRows[0]);
  const row = parseCsvLine(vendasRows[1]);
  const unitIndex = headers.indexOf('Valor unitário');
  const totalIndex = headers.indexOf('Valor total');
  if (row[unitIndex] !== '0') errors.push('vendas.csv: exemplo candidato deve manter Valor unitário = 0.');
  if (row[totalIndex] !== '') errors.push('vendas.csv: Valor total deve ficar vazio para não substituir campo calculado.');
}

const estoque = await readFile(path.join(kitRoot, 'estoque.csv'), 'utf8');
const estoqueRows = estoque.replace(/\r\n/g, '\n').trim().split('\n');
if (estoqueRows.length > 1) {
  const headers = parseCsvLine(estoqueRows[0]);
  const row = parseCsvLine(estoqueRows[1]);
  if (row[headers.indexOf('Reposição?')] !== '') errors.push('estoque.csv: Reposição? deve ficar vazia para preservar cálculo no XLSX.');
}

const financeiro = await readFile(path.join(kitRoot, 'financeiro.csv'), 'utf8');
if (financeiro.replace(/\r\n/g, '\n').trim().split('\n').length !== 1) errors.push('financeiro.csv deve ser entregue sem linhas monetárias de exemplo.');

const readme = await readFile(path.join(kitRoot, 'README_IMPORTACAO.md'), 'utf8');
const requiredReadmeTerms = [
  'REPOR',
  'não substitui contabilidade',
  'Excel, LibreOffice Calc e Google Sheets',
  'release_ready',
  'senhas, tokens, chaves',
];
for (const term of requiredReadmeTerms) if (!readme.includes(term)) errors.push(`README_IMPORTACAO.md deve preservar o aviso: ${term}`);

if (spec.release_ready !== false) errors.push('WORKBOOK_SPEC_v0.3.json não pode estar release_ready=true neste gate.');
if (spec.publication_authorized !== false) errors.push('WORKBOOK_SPEC_v0.3.json não pode autorizar publicação neste gate.');

if (errors.length) {
  console.error('Gestão Fácil import kit check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Gestão Fácil import kit check OK: 5 CSVs alinhados ao WORKBOOK_SPEC_v0.3, campos calculados protegidos e Financeiro sem exemplo monetário.');
