import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const validator = 'scripts/validate-gestao-facil-import.mjs';
const importRoot = 'docs/products/gestao-facil/importacao-v0.3';
const spec = JSON.parse(await readFile(path.join(root, 'docs/products/gestao-facil/WORKBOOK_SPEC_v0.3.json'), 'utf8'));
const validatorSource = await readFile(path.join(root, validator), 'utf8');
const errors = [];

const expected = [
  ['clientes', 'Clientes', 'clientes.csv'],
  ['vendas', 'Vendas', 'vendas.csv'],
  ['tarefas', 'Tarefas', 'tarefas.csv'],
  ['estoque', 'Estoque', 'estoque.csv'],
  ['financeiro', 'Financeiro', 'financeiro.csv'],
];

for (const [, canonical, filename] of expected) {
  const sheet = spec.sheets.find((item) => item.name === canonical);
  if (!sheet?.headers) errors.push(`${canonical}: cabeçalhos ausentes no contrato v0.3.`);
  try { await access(path.join(root, importRoot, filename)); }
  catch { errors.push(`${filename}: modelo CSV ausente.`); }
}

const requiredSourceMarkers = [
  'WORKBOOK_SPEC_v0.3.json',
  'calculated_fields',
  'não altera o XLSX',
  'Excel, LibreOffice Calc e Google Sheets',
  'potencialmente sensível',
];
for (const marker of requiredSourceMarkers) {
  if (!validatorSource.includes(marker)) errors.push(`validador não preserva marcador obrigatório: ${marker}`);
}

const calculatedFields = new Set((spec.sheets ?? []).flatMap((sheet) => Object.keys(sheet.calculated_fields ?? {})));
for (const requiredField of ['Valor total', 'Reposição?']) {
  if (!calculatedFields.has(requiredField)) errors.push(`WORKBOOK_SPEC_v0.3.json deve preservar campo calculado obrigatório: ${requiredField}`);
}

if (/writeFile|appendFile|unlink|rmSync|rename\(/.test(validatorSource)) {
  errors.push('validador deve ser somente leitura; operação de escrita detectada no código.');
}

if (errors.length === 0) {
  for (const [alias, canonical, filename] of expected) {
    const result = spawnSync(process.execPath, [validator, alias, path.join(importRoot, filename)], {
      cwd: root,
      encoding: 'utf8',
    });
    if (result.status !== 0) {
      errors.push(`${canonical}/${filename}: modelo oficial não passou pelo validador. ${result.stderr || result.stdout}`.trim());
    }
  }
}

if (errors.length > 0) {
  console.error('Gestão Fácil import validator check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Gestão Fácil import validator check OK: ferramenta somente leitura e 5 modelos CSV canônicos validados contra WORKBOOK_SPEC_v0.3.json.');
