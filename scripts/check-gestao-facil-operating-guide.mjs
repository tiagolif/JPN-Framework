import { readFile } from 'node:fs/promises';

const guidePath = new URL('../docs/products/gestao-facil/SMALL_BUSINESS_OPERATING_GUIDE_v1.md', import.meta.url);
const modelPath = new URL('../docs/products/gestao-facil/DATA_MODEL_v0.2.md', import.meta.url);

const [guide, model] = await Promise.all([
  readFile(guidePath, 'utf8'),
  readFile(modelPath, 'utf8'),
]);

const failures = [];
const requiredSheets = ['Leia-me','Dashboard','Clientes','Vendas','Tarefas','Estoque','Financeiro','Listas'];
const requiredKpis = ['Clientes cadastrados','Clientes qualificados','Vendas abertas','Vendas ganhas','Tarefas pendentes','Itens para reposição','Saldo registrado'];

for (const sheet of requiredSheets) {
  if (!guide.includes(`\`${sheet}\``)) failures.push(`aba ausente do guia: ${sheet}`);
  if (!model.includes(`| ${sheet} |`)) failures.push(`aba não encontrada no modelo canônico: ${sheet}`);
}

for (const kpi of requiredKpis) {
  if (!guide.includes(kpi)) failures.push(`KPI ausente do guia: ${kpi}`);
  if (!model.includes(kpi)) failures.push(`KPI não encontrado no modelo canônico: ${kpi}`);
}

const requiredPhrases = [
  'REPOR é somente alerta operacional',
  'nunca autoriza compra automática',
  'não substitui contabilidade',
  'GF-QA-10` continua `PENDING',
  'não implica `release_ready=true`',
  'Excel, LibreOffice Calc e Google Sheets continua não comprovada',
  'não exige dados financeiros reais',
  'não armazene credenciais ou segredos',
];

for (const phrase of requiredPhrases) {
  if (!guide.includes(phrase)) failures.push(`guardrail/frase obrigatória ausente: ${phrase}`);
}

const requiredErrors = ['#REF!', '#DIV/0!', '#VALUE!', '#NAME?', '#N/A'];
for (const error of requiredErrors) {
  if (!guide.includes(error)) failures.push(`erro de fórmula não coberto: ${error}`);
}

if (!guide.includes('Rotina diária') || !guide.includes('Rotina semanal')) {
  failures.push('rotinas diária e semanal são obrigatórias');
}
if (!guide.includes('Cenário de treinamento fictício')) {
  failures.push('cenário de treinamento fictício ausente');
}

const blockedClaims = [
  /compatibilidade (garantida|comprovada)/i,
  /lucro garantido/i,
  /resultado garantido/i,
  /compra automática autorizada/i,
  /release_ready=true(?!`)/i,
];
for (const pattern of blockedClaims) {
  if (pattern.test(guide)) failures.push(`claim bloqueado detectado: ${pattern}`);
}

if (failures.length) {
  console.error('Falha no gate do guia operacional da Gestão Fácil:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Gestão Fácil operating guide: PASS');
console.log('sheets=8');
console.log('kpis=7');
console.log('gf_qa_10=PENDING');
console.log('release_effect=none');
