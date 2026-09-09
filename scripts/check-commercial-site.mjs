import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'commercial-site');
const htmlPath = path.join(siteRoot, 'index.html');
const selectorPath = path.join(siteRoot, 'escolher-produto.html');
const comparisonPath = path.join(siteRoot, 'comparar-produtos.html');
const howPath = path.join(siteRoot, 'como-funciona.html');
const comparisonDocPath = path.join(root, 'docs', 'commercial', 'PRODUCT_COMPARISON_MATRIX_v1.md');
const howDocPath = path.join(root, 'docs', 'commercial', 'HOW_JPN_WORKS_v1.md');
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

for (const requiredPath of [htmlPath, selectorPath, comparisonPath, howPath, comparisonDocPath, howDocPath, cssPath]) {
  if (!fs.existsSync(requiredPath)) fail(`arquivo obrigatório ausente: ${path.relative(root, requiredPath)}`);
}
if (process.exitCode) process.exit();

const html = read(htmlPath);
const selector = read(selectorPath);
const comparison = read(comparisonPath);
const how = read(howPath);
const comparisonDoc = read(comparisonDocPath);
const howDoc = read(howDocPath);
const css = read(cssPath);

for (const { id, name } of products) {
  const marker = `data-product="${id}"`;
  if (!html.includes(marker)) fail(`produto sem marcador canônico na landing: ${name}`);
  if (!html.includes(`>${name}<`)) fail(`nome canônico ausente na landing: ${name}`);
  if (!selector.includes(`>${name}<`)) fail(`nome canônico ausente no seletor: ${name}`);
  if (!comparison.includes(name)) fail(`nome canônico ausente na comparação: ${name}`);
  if (!comparisonDoc.includes(name)) fail(`nome canônico ausente na matriz documental: ${name}`);
  if (!how.includes(name)) fail(`nome canônico ausente em como funciona: ${name}`);
  if (!howDoc.includes(name)) fail(`nome canônico ausente no documento como funciona: ${name}`);
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
verifySafety(selector, 'seletor');
verifySafety(comparison, 'comparação');
verifySafety(how, 'como funciona');

const selectorRequirements = [
  'Comece pela necessidade, não pelo produto.',
  'Escolha o menor produto que resolva a necessidade atual.',
  'O Pro Kit não deve ser indicado apenas por ser mais abrangente.',
  'GF-QA-10 ainda permanece pendente',
  'sem preço, checkout, reserva ou promessa comercial',
  'As combinações abaixo são rotas de trabalho, não bundles comerciais nem ofertas.',
];
for (const text of selectorRequirements) {
  if (!selector.includes(text)) fail(`seletor: regra/guardrail ausente: ${text}`);
}
if (!html.includes('href="escolher-produto.html"')) fail('landing: link para seletor ausente');
if (!selector.includes('href="comparar-produtos.html"')) fail('seletor: link para comparação ausente');
for (const { file, name } of products) {
  if (!selector.includes(`href="products/${file}"`)) fail(`seletor: link para ${name} ausente`);
  if (!comparison.includes(`href="products/${file}"`)) fail(`comparação: link para ${name} ausente`);
  if (!how.includes(`href="products/${file}"`)) fail(`como funciona: link para ${name} ausente`);
}

const comparisonRequirements = [
  'Compare o que cada produto resolve — e o que ele não pretende resolver.',
  'escolher o menor produto que resolva a necessidade atual',
  'QA físico contextual em celular pendente',
  'GF-QA-10 multiplataforma pendente',
  'EM PREPARAÇÃO',
  'sem preço, checkout, reserva ou promessa comercial',
  'não é a recomendação automática por ser mais abrangente',
  'Não substitui contabilidade, conciliação bancária nem validação profissional.',
];
for (const text of comparisonRequirements) {
  if (!comparison.includes(text)) fail(`comparação: regra/estado ausente: ${text}`);
}

const comparisonDocRequirements = [
  'candidate companion / commercial QA pending',
  'Escolha o menor produto que resolva a necessidade atual.',
  'JPN Pro Kit não é a recomendação automática',
  'GF-QA-10 multiplataforma ainda pendente',
  'QA físico contextual em celular ainda pendente',
  'não substitui contabilidade',
  'não bundles, descontos ou ofertas',
  'Regra de parada',
];
for (const text of comparisonDocRequirements) {
  if (!comparisonDoc.includes(text)) fail(`matriz documental: regra/estado ausente: ${text}`);
}

const howRequirements = [
  'Comece pelo menor recurso que resolva a necessidade atual',
  'Cinco movimentos, sem obrigação de percorrer todos.',
  'QA físico contextual em celular pendente',
  'GF-QA-10 multiplataforma pendente',
  'EM PREPARAÇÃO',
  'não é a recomendação automática por ser mais abrangente',
  'não bundles, descontos ou ofertas',
  'não substitui contabilidade, conciliação bancária nem validação profissional',
];
for (const text of howRequirements) {
  if (!how.includes(text)) fail(`como funciona: regra/estado ausente: ${text}`);
}

const howDocRequirements = [
  'candidate companion / commercial QA pending',
  'comece pelo menor recurso que resolva a necessidade atual',
  'O ciclo JPN em 5 movimentos',
  'GF-QA-10 multiplataforma permanece pendente',
  'QA físico contextual em celular ainda permanece pendente',
  'Não são bundles, pacotes comerciais, descontos nem ofertas.',
  'Regra de parada',
  'não promete eliminar erros',
];
for (const text of howDocRequirements) {
  if (!howDoc.includes(text)) fail(`documento como funciona: regra/estado ausente: ${text}`);
}

const canonicalTokens = ['#06121c', '#0b1f33', '#0e2639', '#21455e', '#f5f9fc', '#a7bdcc', '#2ec4b6', '#86e2d9'];
for (const token of canonicalTokens) {
  if (!css.toLowerCase().includes(token)) fail(`token visual canônico ausente no CSS: ${token}`);
}
if (!css.includes('@media(max-width:900px)') || !css.includes('@media(max-width:620px)')) {
  fail('breakpoints responsivos esperados não encontrados');
}
if (!css.includes('.comparison-wrap') || !css.includes('.comparison-table')) fail('estilos da matriz comparativa ausentes');

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
  console.log('commercial-site preflight: OK — landing + seletor + comparação + como funciona + 6 páginas individuais, guardrails e tokens canônicos presentes.');
}
