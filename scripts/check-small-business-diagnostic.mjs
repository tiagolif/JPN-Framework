import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const diagnosticPath = path.join(root, 'docs/commercial/SMALL_BUSINESS_DIAGNOSTIC_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const routesPath = path.join(root, 'docs/product-system/PRODUCT_USAGE_ROUTES_v1.json');
const useCasesPath = path.join(root, 'docs/commercial/SMALL_BUSINESS_USE_CASES_v1.json');

const [diagnostic, portfolio, routes, useCases] = await Promise.all([
  readFile(diagnosticPath, 'utf8').then(JSON.parse),
  readFile(portfolioPath, 'utf8').then(JSON.parse),
  readFile(routesPath, 'utf8').then(JSON.parse),
  readFile(useCasesPath, 'utf8').then(JSON.parse),
]);

const errors = [];
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const productIds = new Set((portfolio.products ?? []).map((item) => item.id));
const routeById = new Map((routes.routes ?? []).map((route) => [route.id, route]));
const useCaseStarts = new Set((useCases.use_cases ?? []).map((item) => item.start_product));
const questions = Array.isArray(diagnostic.questions) ? diagnostic.questions : [];
const outcomes = Array.isArray(diagnostic.outcomes) ? diagnostic.outcomes : [];

if (diagnostic.version !== '1.0.0') errors.push('Diagnóstico deve usar version 1.0.0.');
if (diagnostic.framework !== portfolio.framework) errors.push('Framework do diagnóstico diverge do portfólio.');
if (diagnostic.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (diagnostic.release_effect !== 'none') errors.push('release_effect deve permanecer none.');
if (questions.length < 5) errors.push('Diagnóstico deve conter ao menos 5 perguntas.');
if (outcomes.length < 5) errors.push('Diagnóstico deve conter ao menos 5 resultados.');

const questionIds = new Set();
const validConditions = new Set();
for (const question of questions) {
  if (!nonEmpty(question.id) || questionIds.has(question.id)) errors.push(`Pergunta inválida ou duplicada: ${question.id ?? '<sem-id>'}`);
  questionIds.add(question.id);
  if (!nonEmpty(question.prompt)) errors.push(`${question.id}: prompt ausente.`);
  if (!Array.isArray(question.options) || question.options.length < 2) errors.push(`${question.id}: deve ter ao menos 2 opções.`);
  const optionIds = new Set();
  for (const option of question.options ?? []) {
    if (!nonEmpty(option.id) || optionIds.has(option.id)) errors.push(`${question.id}: opção inválida ou duplicada: ${option.id ?? '<sem-id>'}`);
    optionIds.add(option.id);
    if (!nonEmpty(option.label)) errors.push(`${question.id}/${option.id}: label ausente.`);
    validConditions.add(`${question.id}=${option.id}`);
  }
}

const outcomeIds = new Set();
const representedStarts = new Set();
for (const outcome of outcomes) {
  if (!nonEmpty(outcome.id) || outcomeIds.has(outcome.id)) errors.push(`Resultado inválido ou duplicado: ${outcome.id ?? '<sem-id>'}`);
  outcomeIds.add(outcome.id);
  if (!productIds.has(outcome.start_product)) errors.push(`${outcome.id}: produto inicial inválido: ${outcome.start_product}`);
  if (outcome.start_product === 'jpn-pro-kit') errors.push(`${outcome.id}: JPN Pro Kit não pode ser resultado comercial do diagnóstico.`);
  representedStarts.add(outcome.start_product);

  const route = routeById.get(outcome.route_id);
  if (!route) {
    errors.push(`${outcome.id}: rota inexistente: ${outcome.route_id}`);
  } else {
    const routeProducts = new Set([route.start_with, ...(route.then ?? [])]);
    if (!routeProducts.has(outcome.start_product)) errors.push(`${outcome.id}: produto inicial não pertence à rota ${outcome.route_id}.`);
    for (const product of outcome.optional_next ?? []) {
      if (!productIds.has(product)) errors.push(`${outcome.id}: optional_next contém produto inválido: ${product}`);
      if (!routeProducts.has(product)) errors.push(`${outcome.id}: optional_next ${product} não pertence à rota ${outcome.route_id}.`);
      if (product === 'jpn-pro-kit') errors.push(`${outcome.id}: Pro Kit não pode aparecer em optional_next.`);
    }
  }

  if (!Array.isArray(outcome.when) || outcome.when.length === 0) errors.push(`${outcome.id}: condição when ausente.`);
  for (const condition of outcome.when ?? []) {
    if (!validConditions.has(condition)) errors.push(`${outcome.id}: condição inválida: ${condition}`);
  }
  if (!nonEmpty(outcome.message)) errors.push(`${outcome.id}: message ausente.`);
  if (!nonEmpty(outcome.stop_rule)) errors.push(`${outcome.id}: stop_rule ausente.`);
}

for (const expected of ['metodo-jpn', 'jpn-prompt-pack', 'jpn-business', 'jpn-gestao-facil']) {
  if (!representedStarts.has(expected) && !useCaseStarts.has(expected)) {
    errors.push(`Cobertura insuficiente para produto de entrada: ${expected}`);
  }
}

if (!diagnostic.fallback || diagnostic.fallback.start_product !== 'metodo-jpn' || diagnostic.fallback.route_id !== 'rota-aprender') {
  errors.push('Fallback deve apontar para Método JPN pela rota-aprender.');
}

const serialized = JSON.stringify(diagnostic);
const claimText = serialized.replace(/n[aã]o\s+substitui\s+(erp|contabilidade|banco|fiscal|auditoria)/gi, 'guardrail-de-nao-substituicao');
const riskyClaims = [
  /roi\s+garantid/i,
  /resultado\s+garantid/i,
  /aument(a|o)\s+vendas/i,
  /economia\s+garantid/i,
  /100%\s+precis/i,
  /substitui\s+(erp|contabilidade|banco|fiscal|auditoria)/i,
];
for (const claim of riskyClaims) {
  if (claim.test(claimText)) errors.push(`Diagnóstico contém claim de risco: ${claim}`);
}

if (errors.length > 0) {
  console.error('Small business diagnostic check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Small business diagnostic check OK: ${questions.length} perguntas, ${outcomes.length} resultados, sem Pro Kit comercial.`);
