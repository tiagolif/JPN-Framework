import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const portfolio = JSON.parse(await readFile(path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json'), 'utf8'));
const routes = JSON.parse(await readFile(path.join(root, 'docs/product-system/PRODUCT_USAGE_ROUTES_v1.json'), 'utf8'));
const cases = JSON.parse(await readFile(path.join(root, 'docs/commercial/SMALL_BUSINESS_USE_CASES_v1.json'), 'utf8'));

const errors = [];
const products = new Set((portfolio.products ?? []).map((item) => item.id));
const routeById = new Map((routes.routes ?? []).map((item) => [item.id, item]));
const seen = new Set();
const useCases = Array.isArray(cases.use_cases) ? cases.use_cases : [];

if (cases.version !== '1.0.0') errors.push('SMALL_BUSINESS_USE_CASES_v1.json deve usar version 1.0.0.');
if (cases.framework !== portfolio.framework) errors.push('framework da biblioteca diverge de PRODUCT_PORTFOLIO_v1.json.');
if (cases.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (cases.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (useCases.length < 8) errors.push('A biblioteca deve conter pelo menos 8 casos de uso distintos.');

const riskyPatterns = [
  /\broi\s+(garantid|comprovad)/i,
  /\bgarant(e|ia|ido|ida)\b.*\b(venda|resultado|convers[aã]o|economia|retorno)/i,
  /\b100%\b.*\b(precis|efic|resultado)/i,
  /\bcaso\s+de\s+sucesso\b/i,
  /\bcliente\s+real\b/i,
  /\bdepoimento\b/i,
  /\bsubstitui\s+(contabilidade|erp|crm|revis[aã]o\s+humana)/i,
];

for (const item of useCases) {
  if (!item.id || seen.has(item.id)) errors.push(`ID ausente ou duplicado: ${item.id ?? '<sem-id>'}`);
  seen.add(item.id);

  if (!products.has(item.start_product)) errors.push(`${item.id}: start_product inválido: ${item.start_product}`);
  const route = routeById.get(item.route_id);
  if (!route) {
    errors.push(`${item.id}: route_id inexistente: ${item.route_id}`);
  } else if (route.start_with !== item.start_product) {
    errors.push(`${item.id}: start_product ${item.start_product} diverge do start_with de ${item.route_id} (${route.start_with}).`);
  }

  const optional = Array.isArray(item.optional_products) ? item.optional_products : [];
  for (const product of optional) {
    if (!products.has(product)) errors.push(`${item.id}: optional_product inválido: ${product}`);
  }

  if (!Array.isArray(item.workflow) || item.workflow.length < 2) errors.push(`${item.id}: workflow deve ter pelo menos 2 passos.`);
  for (const field of ['segment', 'scenario', 'expected_output', 'boundary']) {
    if (typeof item[field] !== 'string' || !item[field].trim()) errors.push(`${item.id}: ${field} ausente.`);
  }

  const text = JSON.stringify(item);
  for (const pattern of riskyPatterns) {
    if (pattern.test(text)) errors.push(`${item.id}: contém claim ou enquadramento proibido: ${pattern}`);
  }

  if (item.start_product === 'jpn-pro-kit' || optional.includes('jpn-pro-kit')) {
    errors.push(`${item.id}: JPN Pro Kit não pode aparecer em caso comercial enquanto rota-conjunto for arquitetural.`);
  }
}

const representedStarts = new Set(useCases.map((item) => item.start_product));
for (const expected of ['metodo-jpn', 'jpn-prompt-pack', 'jpn-business', 'jpn-gestao-facil']) {
  if (!representedStarts.has(expected)) errors.push(`Falta ao menos um caso começando por ${expected}.`);
}

if (errors.length) {
  console.error('Small business use cases check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Small business use cases check OK: ${useCases.length} casos ilustrativos validados contra ${products.size} produtos e ${routeById.size} rotas.`);
