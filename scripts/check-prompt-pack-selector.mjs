import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'docs/products/prompt-pack/PROMPT_INDEX.json');
const htmlPath = path.join(root, 'prompt-pack-site/index.html');
const appPath = path.join(root, 'prompt-pack-site/app.js');
const cssPath = path.join(root, 'prompt-pack-site/styles.css');
const docsPath = path.join(root, 'docs/products/prompt-pack/PROMPT_SELECTOR_v1.md');

const [indexRaw, html, app, css, docs] = await Promise.all([
  readFile(indexPath, 'utf8'),
  readFile(htmlPath, 'utf8'),
  readFile(appPath, 'utf8'),
  readFile(cssPath, 'utf8'),
  readFile(docsPath, 'utf8'),
]);

const index = JSON.parse(indexRaw);
const errors = [];
const templates = Array.isArray(index.templates) ? index.templates : [];

if (templates.length !== 18) errors.push(`PROMPT_INDEX deve conter 18 templates; encontrado: ${templates.length}.`);

for (const template of templates) {
  const idToken = `id: '${template.id}'`;
  const nameToken = `name: '${template.name.replaceAll("'", "\\'")}'`;
  const categoryToken = `category: '${template.category.replaceAll("'", "\\'")}'`;
  if (!app.includes(idToken)) errors.push(`${template.id}: ID ausente do seletor.`);
  if (!app.includes(nameToken)) errors.push(`${template.id}: nome diverge ou está ausente do seletor.`);
  if (!app.includes(categoryToken)) errors.push(`${template.id}: categoria diverge ou está ausente do seletor.`);
}

const appIds = [...app.matchAll(/id:\s*'(PP-\d{2})'/g)].map((match) => match[1]);
if (appIds.length !== 18) errors.push(`O seletor deve declarar exatamente 18 templates; encontrado: ${appIds.length}.`);
if (new Set(appIds).size !== appIds.length) errors.push('O seletor contém IDs de template duplicados.');

const forbiddenRemotePatterns = [
  /https?:\/\//i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
  /navigator\.sendBeacon/i,
  /gtag\s*\(/i,
  /analytics/i,
  /<form\b/i,
];
for (const pattern of forbiddenRemotePatterns) {
  if (pattern.test(`${html}\n${app}`)) errors.push(`Seletor contém padrão remoto/transacional proibido: ${pattern}`);
}

for (const required of [
  'Escolha o menor template suficiente',
  'nenhum dado é transmitido',
  'ação externa',
  'gasto, compra ou contratação',
  'credencial, segredo ou dado sensível',
  'preço, estoque, desconto, prazo ou condição comercial',
]) {
  if (!`${html}\n${app}`.toLocaleLowerCase('pt-BR').includes(required.toLocaleLowerCase('pt-BR'))) {
    errors.push(`Proteção/texto obrigatório ausente: ${required}`);
  }
}

if (!html.includes('meta name="robots" content="noindex,nofollow"')) errors.push('Interface deve permanecer noindex,nofollow enquanto candidata.');
if (!html.includes('aria-live="polite"')) errors.push('Área de resultados deve usar aria-live="polite".');
if (!css.includes('@media (max-width: 640px)')) errors.push('CSS deve preservar regra responsiva para telas pequenas.');
if (!docs.includes('PROMPT_INDEX.json') || !docs.includes('18 templates')) errors.push('Documentação deve declarar o índice canônico e os 18 templates.');
if (!docs.includes('não usa API externa') || !docs.includes('não envia o objetivo digitado')) errors.push('Documentação deve declarar operação local e privacidade básica.');

if (errors.length) {
  console.error('Prompt Pack selector check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Prompt Pack selector check OK: 18 templates sincronizados, interface local, guardrails e responsividade validados.');
