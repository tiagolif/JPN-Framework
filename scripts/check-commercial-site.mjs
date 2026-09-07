import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'commercial-site');
const htmlPath = path.join(siteRoot, 'index.html');
const cssPath = path.join(siteRoot, 'styles.css');
const read = (p) => fs.readFileSync(p, 'utf8');

const fail = (message) => {
  console.error(`commercial-site preflight: ${message}`);
  process.exitCode = 1;
};

const products = [
  { id: 'metodo-jpn', name: 'Método JPN', file: 'metodo-jpn.html' },
  { id: 'jpn-prompt-builder', name: 'JPN Prompt Builder', file: 'jpn-prompt-builder.html' },
  { id: 'jpn-prompt-pack', name: 'JPN Prompt Pack', file: 'jpn-prompt-pack.html' },
  { id: 'jpn-business', name: 'JPN Business', file: 'jpn-business.html' },
  { id: 'jpn-gestao-facil', name: 'JPN Gestão Fácil', file: 'jpn-gestao-facil.html' },
  { id: 'jpn-pro-kit', name: 'JPN Pro Kit', file: 'jpn-pro-kit.html' },
];

const forbiddenPatterns = [
  [/<form\b/i, 'formulário'],
  [/<input\b/i, 'input/coleta de dados'],
  [/<script\b[^>]*src=/i, 'script externo'],
  [/https?:\/\//i, 'URL externa'],
  [/R\$\s*\d/i, 'preço em reais'],
  [/comprar agora/i, 'CTA de compra'],
  [/finalizar compra/i, 'CTA de checkout'],
  [/ir para (?:o )?checkout/i, 'CTA de checkout'],
  [/garant[iaeo]\w*\s+(?:de\s+)?(?:resultado|retorno|vendas|lucro)/i, 'claim de garantia'],
];

const verifySafety = (html, label) => {
  if (!html.includes('content="noindex,nofollow"')) fail(`${label}: noindex,nofollow ausente`);
  if (!html.toLowerCase().includes('não publicada')) fail(`${label}: estado interno/não publicado ausente`);
  for (const [pattern, blockedLabel] of forbiddenPatterns) {
    if (pattern.test(html)) fail(`${label}: conteúdo bloqueado detectado: ${blockedLabel}`);
  }
};

if (!fs.existsSync(htmlPath)) fail('index.html ausente');
if (!fs.existsSync(cssPath)) fail('styles.css ausente');
if (process.exitCode) process.exit();

const html = read(htmlPath);
const css = read(cssPath);

for (const { id, name } of products) {
  const marker = `data-product="${id}"`;
  if (!html.includes(marker)) fail(`produto sem marcador canônico na landing: ${name}`);
  if (!html.includes(`>${name}<`)) fail(`nome canônico ausente na landing: ${name}`);
}

const uniqueMarkers = [...html.matchAll(/data-product="([^"]+)"/g)].map((m) => m[1]);
if (uniqueMarkers.length !== 6) fail(`esperados 6 cards de produto; encontrados ${uniqueMarkers.length}`);
if (new Set(uniqueMarkers).size !== uniqueMarkers.length) fail('há data-product duplicado na landing');

const requiredSafety = [
  'content="noindex,nofollow"',
  'EM PREPARAÇÃO',
  'não publicada',
  'Sem preço, checkout ou promessa de resultado.',
];
for (const text of requiredSafety) {
  if (!html.includes(text)) fail(`guardrail ausente na landing: ${text}`);
}
verifySafety(html, 'landing');

const canonicalTokens = ['#06121c', '#0b1f33', '#0e2639', '#21455e', '#f5f9fc', '#a7bdcc', '#2ec4b6', '#86e2d9'];
for (const token of canonicalTokens) {
  if (!css.toLowerCase().includes(token)) fail(`token visual canônico ausente no CSS: ${token}`);
}
if (!css.includes('@media(max-width:900px)') || !css.includes('@media(max-width:620px)')) {
  fail('breakpoints responsivos esperados não encontrados');
}

const productsDir = path.join(siteRoot, 'products');
if (!fs.existsSync(productsDir)) fail('diretório commercial-site/products ausente');

for (const { id, name, file } of products) {
  const productPath = path.join(productsDir, file);
  if (!fs.existsSync(productPath)) {
    fail(`página individual ausente: ${name}`);
    continue;
  }
  const productHtml = read(productPath);
  if (!productHtml.includes(`<body data-product="${id}">`)) fail(`${name}: data-product canônico ausente no body`);
  if (!productHtml.includes(name)) fail(`${name}: nome canônico ausente da página individual`);
  if (!productHtml.includes('href="../styles.css"')) fail(`${name}: stylesheet compartilhado ausente`);
  if (!productHtml.includes('href="../index.html')) fail(`${name}: retorno relativo ao portfólio ausente`);
  if (!productHtml.includes('<footer>')) fail(`${name}: rodapé de identidade/status ausente`);
  verifySafety(productHtml, name);
}

const proKitHtml = read(path.join(productsDir, 'jpn-pro-kit.html'));
if (!proKitHtml.includes('EM PREPARAÇÃO')) fail('JPN Pro Kit: estado EM PREPARAÇÃO ausente');
if (!proKitHtml.includes('sem preço, checkout, reserva')) fail('JPN Pro Kit: guardrail transacional específico ausente');

if (!process.exitCode) {
  console.log('commercial-site preflight: OK — landing + 6 páginas individuais, guardrails e tokens canônicos presentes.');
}
