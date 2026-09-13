import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const specPath = path.join(root, 'docs/products/gestao-facil/WORKBOOK_SPEC_v0.3.json');
const spec = JSON.parse(await readFile(specPath, 'utf8'));

const tableAliases = new Map([
  ['clientes', 'Clientes'],
  ['vendas', 'Vendas'],
  ['tarefas', 'Tarefas'],
  ['estoque', 'Estoque'],
  ['financeiro', 'Financeiro'],
]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (quoted && next === '"') { field += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field); field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field); field = '';
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
    } else field += char;
  }
  if (quoted) throw new Error('CSV inválido: aspas não fechadas.');
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.length > 0)) rows.push(row);
  }
  return rows;
}

function normalizeCell(value) {
  return String(value ?? '').replace(/^\uFEFF/, '').trim();
}

function looksLikeDate(value) {
  if (!value) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{2}\/\d{2}\/\d{4}$/.test(value);
}

function sensitiveHit(value) {
  const checks = [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
    /(?:api[_ -]?key|token|senha|password)\s*[:=]\s*\S+/i,
    /\b(?:\d[ -]*?){13,19}\b/,
  ];
  return checks.some((pattern) => pattern.test(value));
}

function fail(message) {
  console.error(`Import validator falhou: ${message}`);
  process.exit(1);
}

const [, , tableArg, fileArg] = process.argv;
if (!tableArg || !fileArg) {
  console.error('Uso: node scripts/validate-gestao-facil-import.mjs <clientes|vendas|tarefas|estoque|financeiro> <arquivo.csv>');
  process.exit(2);
}

const canonicalName = tableAliases.get(tableArg.toLowerCase());
if (!canonicalName) fail(`tabela desconhecida: ${tableArg}`);
const sheet = spec.sheets.find((item) => item.name === canonicalName);
if (!sheet?.headers) fail(`WORKBOOK_SPEC_v0.3.json não define cabeçalhos para ${canonicalName}.`);

const csvPath = path.resolve(fileArg);
let text;
try { text = await readFile(csvPath, 'utf8'); }
catch { fail(`não foi possível ler ${csvPath}.`); }

let rows;
try { rows = parseCsv(text); }
catch (error) { fail(error.message); }
if (rows.length === 0) fail('arquivo vazio.');

const header = rows[0].map(normalizeCell);
const expected = sheet.headers;
if (header.length !== expected.length || header.some((value, index) => value !== expected[index])) {
  fail(`cabeçalhos divergentes em ${canonicalName}. Esperado: ${expected.join(' | ')}`);
}

const dataRows = rows.slice(1).map((row) => row.map(normalizeCell));
const errors = [];
const warnings = [];
const keyField = canonicalName === 'Estoque' ? 'Código' : 'ID';
const keyIndex = header.indexOf(keyField);
const dateFields = ['Data', 'Data da próxima ação', 'Atualização', 'Início', 'Prazo', 'Vencimento'];
const dateIndexes = dateFields.map((field) => [field, header.indexOf(field)]).filter(([, index]) => index >= 0);
const calculated = new Set(Object.keys(sheet.calculated_fields ?? {}));
const calculatedIndexes = [...calculated].map((field) => [field, header.indexOf(field)]).filter(([, index]) => index >= 0);
const seenKeys = new Set();

for (let rowOffset = 0; rowOffset < dataRows.length; rowOffset += 1) {
  const rowNumber = rowOffset + 2;
  const row = dataRows[rowOffset];
  if (row.length !== header.length) {
    errors.push(`linha ${rowNumber}: ${row.length} colunas; esperado ${header.length}.`);
    continue;
  }
  const key = row[keyIndex];
  if (!key) errors.push(`linha ${rowNumber}: ${keyField} vazio.`);
  else if (seenKeys.has(key)) errors.push(`linha ${rowNumber}: ${keyField} duplicado (${key}).`);
  else seenKeys.add(key);

  for (const [field, index] of dateIndexes) {
    if (!looksLikeDate(row[index])) errors.push(`linha ${rowNumber}: ${field} deve usar AAAA-MM-DD ou DD/MM/AAAA.`);
  }
  for (const [field, index] of calculatedIndexes) {
    if (row[index] !== '') errors.push(`linha ${rowNumber}: ${field} é calculado no XLSX e deve ficar vazio no CSV.`);
  }
  for (let col = 0; col < row.length; col += 1) {
    if (sensitiveHit(row[col])) warnings.push(`linha ${rowNumber}, coluna ${header[col]}: conteúdo potencialmente sensível; revise antes de importar.`);
  }
}

if (errors.length > 0) {
  console.error(`Validação falhou para ${canonicalName}:`);
  for (const error of errors) console.error(`- ${error}`);
  for (const warning of warnings) console.error(`AVISO: ${warning}`);
  process.exit(1);
}

console.log(`Validação OK: ${canonicalName}; ${dataRows.length} linha(s) de dados; cabeçalhos e regras estruturais compatíveis com WORKBOOK_SPEC_v0.3.json.`);
if (dataRows.length === 0) console.log('Observação: modelo sem linhas de dados; apenas a estrutura foi validada.');
for (const warning of warnings) console.warn(`AVISO: ${warning}`);
console.log('Este validador não importa dados, não altera o XLSX e não substitui o QA físico em Excel, LibreOffice Calc e Google Sheets.');
