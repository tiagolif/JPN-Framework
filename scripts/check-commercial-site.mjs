import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'commercial-site', 'index.html');
const cssPath = path.join(root, 'commercial-site', 'styles.css');
const read = (p) => fs.readFileSync(p, 'utf8');

const fail = (message) => {
  console.error(`commercial-site preflight: ${message}`);
  process.exitCode = 1;
};

if (!fs.existsSync(htmlPath)) fail('index.html ausente');
if (!fs.existsSync(cssPath)) fail('styles.css ausente');
if (process.exitCode) process.exit();

const html = read(htmlPath);
const css = read(cssPath);

const products = [
  ['metodo-jpn', 'Método JPN'],
  ['jpn-prompt-builder', 'JPN Prompt Builder'],
  ['jpn-prompt-pack', 'JPN Prompt Pack'],
  ['jpn-business', 'JPN Business'],
  ['jpn-gestao-facil', 'JPN Gestão Fácil'],
  ['jpn-pro-kit', 'JPN Pro Kit'],
];

for (const [id, name] of products) {
  const marker = `data-product="${id}"`;
  if (!html.includes(marker)) fail(`produto sem marcador canônico: ${name}`);
  if (!html.includes(`>${name}<`)) fail(`nome canônico ausente: ${name}`);
}

const uniqueMarkers = [...html.matchAll(/data-product="([^"]+)"/g)].map((m) => m[1]);
if (uniqueMarkers.length !== 6) fail(`esperados 6 cards de produto; encontrados ${uniqueMarkers.length}`);
if (new Set(uniqueMarkers).size !== uniqueMarkers.length) fail('há data-product duplicado');

const requiredSafety = [
  'content="noindex,nofollow"',
  'EM PREPARAÇÃO',
  'não publicada',
  'Sem preço, checkout ou promessa de resultado.',
];
for (const text of requiredSafety) {
  if (!html.includes(text)) fail(`guardrail ausente: ${text}`);
}

const forbiddenPatterns = [
  [/<form\b/i, 'formulário'],
  [/<input\b/i, 'input/coleta de dados'],
  [/<script\b[^>]*src=/i, 'script externo'],
  [/https?:\/\//i, 'URL externa'],
  [/R\$\s*\d/i, 'preço em reais'],
  [/\bcheckout\b(?!(?:[^<]{0,80})(?:sem|não))/i, 'checkout possivelmente transacional'],
  [/comprar agora/i, 'CTA de compra'],
  [/garant[iaeo]\w*\s+(?:de\s+)?(?:resultado|retorno|vendas|lucro)/i, 'claim de garantia'],
];

for (const [pattern, label] of forbiddenPatterns) {
  if (pattern.test(html)) fail(`conteúdo bloqueado detectado: ${label}`);
}

const canonicalTokens = ['#06121c', '#0b1f33', '#0e2639', '#21455e', '#f5f9fc', '#a7bdcc', '#2ec4b6', '#86e2d9'];
for (const token of canonicalTokens) {
  if (!css.toLowerCase().includes(token)) fail(`token visual canônico ausente no CSS: ${token}`);
}

if (!css.includes('@media(max-width:900px)') || !css.includes('@media(max-width:620px)')) {
  fail('breakpoints responsivos esperados não encontrados');
}

if (!process.exitCode) console.log('commercial-site preflight: OK — 6 produtos, guardrails e tokens canônicos presentes.');
