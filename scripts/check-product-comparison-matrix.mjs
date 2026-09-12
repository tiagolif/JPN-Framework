import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const matrixPath = path.join(root, 'docs/commercial/PRODUCT_COMPARISON_MATRIX_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const routesPath = path.join(root, 'docs/product-system/PRODUCT_USAGE_ROUTES_v1.json');

const matrix = JSON.parse(await readFile(matrixPath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const routes = JSON.parse(await readFile(routesPath, 'utf8'));
const errors = [];

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const matrixProducts = Array.isArray(matrix.products) ? matrix.products : [];
const portfolioProducts = Array.isArray(portfolio.products) ? portfolio.products : [];
const portfolioIds = new Set(portfolioProducts.map((item) => item.id));
const matrixIds = new Set(matrixProducts.map((item) => item.product_id));
const routeProducts = new Set((routes.routes ?? []).flatMap((route) => [route.start_with, ...(route.then ?? [])]));

if (matrix.version !== '1.0.0') errors.push('PRODUCT_COMPARISON_MATRIX_v1.json deve usar version 1.0.0.');
if (matrix.framework !== portfolio.framework) errors.push('framework da matriz diverge do portfólio canônico.');
if (matrix.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (matrix.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (!nonEmpty(matrix.decision_rule)) errors.push('decision_rule ausente.');

if (matrixProducts.length !== portfolioProducts.length) {
  errors.push(`A matriz deve cobrir exatamente ${portfolioProducts.length} produtos; recebeu ${matrixProducts.length}.`);
}

for (const id of portfolioIds) {
  if (!matrixIds.has(id)) errors.push(`${id}: ausente da matriz comparativa.`);
}
for (const id of matrixIds) {
  if (!portfolioIds.has(id)) errors.push(`${id}: produto da matriz não existe no portfólio.`);
}
if (matrixIds.size !== matrixProducts.length) errors.push('Há product_id duplicado na matriz comparativa.');

const requiredFields = ['best_for', 'start_when', 'avoid_when', 'primary_input', 'primary_output', 'operational_scope'];
for (const product of matrixProducts) {
  for (const field of requiredFields) {
    if (!nonEmpty(product[field])) errors.push(`${product.product_id ?? '<sem-id>'}: ${field} ausente.`);
  }
  if (!Array.isArray(product.next_if_needed)) {
    errors.push(`${product.product_id ?? '<sem-id>'}: next_if_needed deve ser array.`);
    continue;
  }
  for (const nextId of product.next_if_needed) {
    if (!portfolioIds.has(nextId)) errors.push(`${product.product_id}: next_if_needed referencia produto inexistente: ${nextId}.`);
    if (nextId === product.product_id) errors.push(`${product.product_id}: não pode apontar para si em next_if_needed.`);
  }
}

for (const id of routeProducts) {
  if (!portfolioIds.has(id)) errors.push(`Rota canônica referencia produto inexistente no portfólio: ${id}.`);
}

// Toda continuidade declarada na matriz deve aparecer em pelo menos uma rota canônica
// que contenha o produto de origem e o produto de destino.
for (const product of matrixProducts) {
  for (const nextId of product.next_if_needed ?? []) {
    const represented = (routes.routes ?? []).some((route) => {
      const sequence = [route.start_with, ...(route.then ?? [])];
      return sequence.includes(product.product_id) && sequence.includes(nextId);
    });
    if (!represented) errors.push(`${product.product_id}: continuidade ${nextId} não é representada em nenhuma rota canônica.`);
  }
}

const proKit = matrixProducts.find((item) => item.product_id === 'jpn-pro-kit');
if (!proKit) {
  errors.push('jpn-pro-kit ausente da matriz.');
} else {
  const proText = `${proKit.best_for} ${proKit.start_when} ${proKit.avoid_when} ${proKit.operational_scope}`.toLowerCase();
  if (!proText.includes('gate') || !proText.includes('final')) {
    errors.push('jpn-pro-kit deve explicitar dependência dos gates finais.');
  }
}

const gestao = matrixProducts.find((item) => item.product_id === 'jpn-gestao-facil');
if (!gestao) {
  errors.push('jpn-gestao-facil ausente da matriz.');
} else {
  const gestaoText = `${gestao.avoid_when} ${gestao.operational_scope}`.toLowerCase();
  for (const term of ['contabilidade', 'banco', 'fiscal', 'erp']) {
    if (!gestaoText.includes(term)) errors.push(`jpn-gestao-facil deve preservar limite explícito sobre ${term}.`);
  }
}

// Claims são verificados apenas na superfície descritiva dos produtos. Guardrails como
// "sem checkout" e "não substitui" não devem gerar falsos positivos.
const productSurface = matrixProducts
  .map((product) => [
    product.best_for,
    product.start_when,
    product.avoid_when,
    product.primary_input,
    product.primary_output,
    product.operational_scope,
  ].join(' '))
  .join(' ')
  .toLowerCase();

const blockedClaims = [
  /roi\s+garantid/,
  /resultado\s+garantid/,
  /lucro\s+garantid/,
  /100%\s+precis/,
  /substitui\s+revis[aã]o\s+humana/,
  /compre\s+agora/,
  /pre[cç]o\s*:/,
];
for (const claim of blockedClaims) {
  if (claim.test(productSurface)) errors.push(`Matriz contém claim ou elemento comercial bloqueado: ${claim}.`);
}

const safeNegatives = productSurface
  .replaceAll('não substitui contabilidade, banco, fiscal, erp ou auditoria', '')
  .replaceAll('não substitui crm, erp ou ferramenta de automação', '');
if (/substitui\s+(contabilidade|banco|fiscal|erp|auditoria|crm)/.test(safeNegatives)) {
  errors.push('Matriz não pode apresentar produto JPN como substituto de sistema operacional especializado.');
}

if (errors.length > 0) {
  console.error('Product comparison matrix check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Product comparison matrix check OK: ${matrixProducts.length} produtos comparados com guardrails preservados.`);
