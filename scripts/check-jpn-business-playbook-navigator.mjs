import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const [indexRaw, html, app, css, docs] = await Promise.all([
  readFile(path.join(root,'docs/products/jpn-business/BUSINESS_INDEX.json'),'utf8'),
  readFile(path.join(root,'business-site/index.html'),'utf8'),
  readFile(path.join(root,'business-site/app.js'),'utf8'),
  readFile(path.join(root,'business-site/styles.css'),'utf8'),
  readFile(path.join(root,'docs/products/jpn-business/PLAYBOOK_NAVIGATOR_v1.md'),'utf8'),
]);
const index = JSON.parse(indexRaw);
const playbooks = Array.isArray(index.playbooks) ? index.playbooks : [];
const errors = [];
if (playbooks.length !== 12) errors.push(`BUSINESS_INDEX deve conter 12 playbooks; encontrado: ${playbooks.length}.`);
for (const playbook of playbooks) {
  for (const token of [`id:'${playbook.id}'`,`name:'${playbook.name.replaceAll("'","\\'")}'`,`category:'${playbook.category.replaceAll("'","\\'")}'`]) {
    if (!app.includes(token)) errors.push(`${playbook.id}: campo canônico ausente ou divergente no navegador: ${token}`);
  }
  for (const link of playbook.prompt_pack_links ?? []) if (!app.includes(`'${link}'`)) errors.push(`${playbook.id}: vínculo ${link} ausente do navegador.`);
}
const appIds = [...app.matchAll(/id:'(JB-\d{2})'/g)].map((m)=>m[1]);
if (appIds.length !== 12) errors.push(`Navegador deve declarar exatamente 12 playbooks; encontrado: ${appIds.length}.`);
if (new Set(appIds).size !== appIds.length) errors.push('Há IDs JB duplicados no navegador.');
for (const pattern of [/https?:\/\//i,/fetch\s*\(/i,/XMLHttpRequest/i,/navigator\.sendBeacon/i,/gtag\s*\(/i,/analytics/i,/<form\b/i]) {
  if (pattern.test(`${html}\n${app}`)) errors.push(`Padrão remoto/transacional proibido: ${pattern}`);
}
for (const required of ['12 playbooks','não envia dados','ação externa','gasto, compra, contratação','credencial, segredo ou dado sensível']) {
  if (!`${html}\n${docs}`.toLocaleLowerCase('pt-BR').includes(required.toLocaleLowerCase('pt-BR'))) errors.push(`Proteção/texto obrigatório ausente: ${required}`);
}
if (!html.includes('meta name="robots" content="noindex,nofollow"')) errors.push('Interface deve permanecer noindex,nofollow.');
if (!html.includes('aria-live="polite"')) errors.push('Resultados devem usar aria-live="polite".');
if (!css.includes('@media(max-width:640px)')) errors.push('CSS deve conter regra responsiva móvel.');
if (!docs.includes('BUSINESS_INDEX.json') || !docs.includes('Prompt Pack')) errors.push('Documentação deve apontar para o índice canônico e os vínculos com Prompt Pack.');
if (errors.length) {
  console.error('JPN Business playbook navigator check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('JPN Business playbook navigator check OK: 12 playbooks sincronizados, vínculos Prompt Pack, operação local e guardrails validados.');
