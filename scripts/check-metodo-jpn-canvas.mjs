import { readFile } from 'node:fs/promises';

const html = await readFile('metodo-jpn-site/index.html','utf8');
const css = await readFile('metodo-jpn-site/styles.css','utf8');
const js = await readFile('metodo-jpn-site/app.js','utf8');
const doc = await readFile('docs/products/metodo-jpn/METODO_JPN_CANVAS_v1.md','utf8');
const release = JSON.parse(await readFile('docs/product-system/PRODUCT_RELEASE_STATUS_v1.json','utf8'));
const quick = await readFile('docs/products/metodo-jpn/METODO_JPN_QUICK_REFERENCE_v1.md','utf8');
const errors = [];

const expectedFields = ['contexto','estadoAtual','recursos','restricoesJ','incertezas','confianca','objetivo','inclui','naoInclui','entradas','saida','restricoesP','criterios','riscos','validacao','estadoFinal','sequencia','formato','detalhe','proxima','continuidade'];
for(const field of expectedFields){
  if(!html.includes(`name="${field}"`)) errors.push(`Campo ausente no canvas: ${field}`);
  if(!js.includes(`'${field}'`)) errors.push(`Campo não tratado pelo gerador: ${field}`);
}
for(const confidence of ['confirmed','inferred','unknown','conflicting']){
  if(!html.includes(`value="${confidence}"`)) errors.push(`Confiança ausente no select: ${confidence}`);
  if(!quick.includes(`\`${confidence}\``)) errors.push(`Confiança ${confidence} não está na referência canônica.`);
}
for(const heading of ['Jornada','Precisão','Narrativa']) if(!html.includes(heading)) errors.push(`Dimensão JPN ausente: ${heading}`);
for(const token of ['Critérios de aceitação','Validação','Estado final desejado','Continuidade a preservar']) if(!html.includes(token)) errors.push(`Campo canônico ausente: ${token}`);
if(!html.includes('noindex,nofollow')) errors.push('Canvas deve permanecer noindex,nofollow.');
if(!css.includes('@media print')) errors.push('Canvas deve preservar modo de impressão.');
if(/fetch\s*\(|XMLHttpRequest|https?:\/\//i.test(js)) errors.push('Canvas não deve fazer chamadas de rede.');
if(/<form[^>]+action=/i.test(html)) errors.push('Formulário não deve possuir action externa.');
if(/analytics|gtag\s*\(|pixel/i.test(`${html}\n${js}`)) errors.push('Canvas não deve conter analytics/tracking.');
if(!doc.includes('não usa API externa')) errors.push('Documentação deve registrar operação local sem API externa.');

const metodo = release.products.find((product) => product.id === 'metodo-jpn');
const statuses = new Map((metodo?.dependencies ?? []).map((item) => [item.id,item.status]));
for(const gate of ['revisao-editorial-humana','pdf-final']) if(statuses.get(gate) !== 'pending') errors.push(`Gate ${gate} do Método JPN deve permanecer pending nesta entrega.`);

if(errors.length){
  console.error('Método JPN Canvas check falhou:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Método JPN Canvas check OK: ${expectedFields.length} campos canônicos, confidências, privacidade e gates preservados.`);
