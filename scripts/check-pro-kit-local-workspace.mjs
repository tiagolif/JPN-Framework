import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'pro-kit-site/index.html');
const cssPath = path.join(root, 'pro-kit-site/styles.css');
const docPath = path.join(root, 'docs/products/pro-kit/LOCAL_WORKSPACE_v1.md');
const rollupPath = path.join(root, 'docs/products/pro-kit/COMPONENT_READINESS_ROLLUP_v1.json');

const [html, css, doc, rollupText] = await Promise.all([
  readFile(htmlPath, 'utf8'),
  readFile(cssPath, 'utf8'),
  readFile(docPath, 'utf8'),
  readFile(rollupPath, 'utf8'),
]);
const rollup = JSON.parse(rollupText);
const errors = [];

const expected = [
  ['metodo-jpn', '../metodo-jpn-site/index.html', 'Método JPN'],
  ['jpn-prompt-pack', '../prompt-pack-site/index.html', 'JPN Prompt Pack'],
  ['jpn-business', '../business-site/index.html', 'JPN Business'],
  ['jpn-prompt-builder', '../product-site/index.html', 'JPN Prompt Builder'],
  ['jpn-gestao-facil', '../docs/products/gestao-facil/importacao-v0.3/README_IMPORTACAO.md', 'JPN Gestão Fácil'],
];

if (rollup.product !== 'JPN Pro Kit') errors.push('Roll-up deve pertencer ao JPN Pro Kit.');
if (rollup.release_effect !== 'none') errors.push('Roll-up deve manter release_effect=none.');
if (rollup.summary?.all_components_release_ready !== false) errors.push('Workspace só é válido enquanto não promover all_components_release_ready.');
if (rollup.summary?.component_count !== expected.length) errors.push(`Quantidade de componentes divergente: esperado=${expected.length}, roll-up=${rollup.summary?.component_count}.`);

for (const [id, href, name] of expected) {
  if (!html.includes(`data-component="${id}"`)) errors.push(`${id}: card ausente.`);
  if (!html.includes(`href="${href}"`)) errors.push(`${id}: rota local esperada ausente: ${href}`);
  if (!html.includes(name)) errors.push(`${id}: nome canônico ausente da página.`);
  const component = rollup.components?.find((item) => item.id === id);
  if (!component) errors.push(`${id}: ausente do roll-up de prontidão.`);
}

const requiredTargets = [
  'metodo-jpn-site/index.html',
  'prompt-pack-site/index.html',
  'business-site/index.html',
  'product-site/index.html',
  'docs/products/gestao-facil/QUICK_START_v0.1.md',
  'docs/products/gestao-facil/importacao-v0.3/README_IMPORTACAO.md',
  'docs/products/pro-kit/USAGE_ROUTING_GUIDE_v1.md',
  'docs/products/pro-kit/READINESS_MATRIX_v1.md',
];
for (const target of requiredTargets) {
  try { await access(path.join(root, target)); }
  catch { errors.push(`Destino local inexistente: ${target}`); }
}

for (const phrase of ['EM PREPARAÇÃO', 'menor recurso suficiente', '0 dependências aprovadas', '11 pendentes', 'não torna o JPN Pro Kit disponível para venda']) {
  if (!html.includes(phrase)) errors.push(`Mensagem obrigatória ausente: ${phrase}`);
}

if (!html.includes('18 templates')) errors.push('Prompt Pack deve preservar a contagem de 18 templates.');
if (!html.includes('12 playbooks')) errors.push('JPN Business deve preservar a contagem de 12 playbooks.');
if (!html.includes('Excel, LibreOffice Calc e Google Sheets')) errors.push('Gestão Fácil deve manter QA multiplataforma explícito.');
if (!html.includes('QA físico contextual em celular')) errors.push('Prompt Builder deve manter QA físico contextual pendente explícito.');

const forbidden = [
  /https?:\/\//i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
  /<form\b/i,
  /analytics/i,
  /checkout/i,
  /comprar agora/i,
  /preço\s*[:=]/i,
];
for (const pattern of forbidden) if (pattern.test(html)) errors.push(`Padrão remoto/transacional proibido no HTML: ${pattern}`);

if (html.includes('JPN_Gestao_Facil_v0.1_reconstruida.xlsx')) errors.push('Workspace não pode promover o XLSX histórico como entrega atual.');
if (!doc.includes('JPN_Gestao_Facil_v0.1_reconstruida.xlsx')) errors.push('Documentação deve registrar explicitamente a proteção contra promoção do XLSX histórico.');
if (!doc.includes('release_effect: none')) errors.push('Documentação deve preservar release_effect: none.');
if (!css.includes('@media print')) errors.push('Workspace deve permanecer imprimível para revisão interna.');
if (!html.includes('name="robots" content="noindex,nofollow"')) errors.push('Workspace deve permanecer noindex,nofollow.');

if (errors.length) {
  console.error('Pro Kit local workspace check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Pro Kit local workspace check OK: ${expected.length} componentes locais roteados, estados pendentes visíveis e nenhuma promoção de release.`);
