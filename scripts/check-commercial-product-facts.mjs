import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const readJson = (relative) => JSON.parse(read(relative));
const errors = [];

const portfolio = readJson('docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const promptIndex = readJson('docs/products/prompt-pack/PROMPT_INDEX.json');
const businessIndex = readJson('docs/products/jpn-business/BUSINESS_INDEX.json');
const landing = read('commercial-site/index.html');

const expectedIds = [
  'metodo-jpn',
  'jpn-prompt-builder',
  'jpn-prompt-pack',
  'jpn-business',
  'jpn-gestao-facil',
  'jpn-pro-kit',
];

const products = portfolio.products ?? [];
const portfolioIds = products.map((product) => product.id);

if (products.length !== expectedIds.length) {
  errors.push(`PRODUCT_PORTFOLIO_v1.json deveria conter ${expectedIds.length} produtos; contém ${products.length}.`);
}

for (const id of expectedIds) {
  if (!portfolioIds.includes(id)) errors.push(`Produto canônico ausente do portfólio: ${id}.`);
}

const countItems = (value, labels) => {
  for (const label of labels) {
    if (Array.isArray(value?.[label])) return value[label].length;
  }
  for (const candidate of Object.values(value ?? {})) {
    if (Array.isArray(candidate) && candidate.every((item) => item && typeof item === 'object')) return candidate.length;
  }
  return null;
};

const promptCount = countItems(promptIndex, ['prompts', 'templates', 'items']);
const businessCount = countItems(businessIndex, ['playbooks', 'items']);

if (!Number.isInteger(promptCount) || promptCount < 1) {
  errors.push('Não foi possível derivar a quantidade canônica de prompts de PROMPT_INDEX.json.');
}
if (!Number.isInteger(businessCount) || businessCount < 1) {
  errors.push('Não foi possível derivar a quantidade canônica de playbooks de BUSINESS_INDEX.json.');
}

const pageById = {
  'metodo-jpn': 'commercial-site/products/metodo-jpn.html',
  'jpn-prompt-builder': 'commercial-site/products/jpn-prompt-builder.html',
  'jpn-prompt-pack': 'commercial-site/products/jpn-prompt-pack.html',
  'jpn-business': 'commercial-site/products/jpn-business.html',
  'jpn-gestao-facil': 'commercial-site/products/jpn-gestao-facil.html',
  'jpn-pro-kit': 'commercial-site/products/jpn-pro-kit.html',
};

for (const product of products) {
  const pagePath = pageById[product.id];
  if (!pagePath || !fs.existsSync(path.join(root, pagePath))) {
    errors.push(`${product.canonical_name}: página comercial individual ausente.`);
    continue;
  }

  const html = read(pagePath);
  if (!html.includes(`data-product="${product.id}"`)) {
    errors.push(`${product.canonical_name}: data-product não corresponde ao ID canônico ${product.id}.`);
  }
  if (!html.includes(product.canonical_name)) {
    errors.push(`${product.id}: nome canônico “${product.canonical_name}” ausente da página.`);
  }
  if (!landing.includes(`data-product="${product.id}"`)) {
    errors.push(`${product.canonical_name}: card canônico ausente da landing.`);
  }
  if (!landing.includes(product.canonical_name)) {
    errors.push(`${product.canonical_name}: nome canônico ausente da landing.`);
  }
}

const methodHtml = read(pageById['metodo-jpn']);
for (const dimension of ['Jornada', 'Precisão', 'Narrativa']) {
  if (!methodHtml.includes(dimension)) errors.push(`Método JPN: dimensão canônica ausente na página comercial: ${dimension}.`);
}

if (Number.isInteger(promptCount)) {
  const promptPackHtml = read(pageById['jpn-prompt-pack']);
  const promptCountPattern = new RegExp(`\\b${promptCount}\\s+templates?\\b`, 'iu');
  if (!promptCountPattern.test(promptPackHtml)) {
    errors.push(`JPN Prompt Pack: página comercial não declara a quantidade canônica atual de ${promptCount} templates.`);
  }
}

if (Number.isInteger(businessCount)) {
  const businessHtml = read(pageById['jpn-business']);
  const businessCountPattern = new RegExp(`\\b${businessCount}\\s+(?:playbooks?|fluxos?)\\b`, 'iu');
  if (!businessCountPattern.test(businessHtml)) {
    errors.push(`JPN Business: página comercial não declara a quantidade canônica atual de ${businessCount} playbooks/fluxos.`);
  }
}

const builderHtml = read(pageById['jpn-prompt-builder']);
if (!/\b(?:local|offline)\b/iu.test(builderHtml)) {
  errors.push('JPN Prompt Builder: página comercial não preserva o fato de entrega/uso local ou offline da versão atual.');
}

const gestaoHtml = read(pageById['jpn-gestao-facil']);
if (!/\bplanilha\b/iu.test(gestaoHtml)) {
  errors.push('JPN Gestão Fácil: página comercial não identifica o artefato como planilha.');
}

const proKitHtml = read(pageById['jpn-pro-kit']);
if (!/EM PREPARAÇÃO/iu.test(proKitHtml)) {
  errors.push('JPN Pro Kit: página comercial perdeu o estado EM PREPARAÇÃO.');
}

if (errors.length) {
  console.error('Integridade factual comercial: FALHOU');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Integridade factual comercial: OK — ${products.length} produtos; Prompt Pack=${promptCount}; Business=${businessCount}.`);
