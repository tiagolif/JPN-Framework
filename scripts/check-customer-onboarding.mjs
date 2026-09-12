import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const onboardingPath = path.join(root, 'docs/commercial/CUSTOMER_ONBOARDING_GUIDE_v1.json');
const onboardingMdPath = path.join(root, 'docs/commercial/CUSTOMER_ONBOARDING_GUIDE_v1.md');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const routesPath = path.join(root, 'docs/product-system/PRODUCT_USAGE_ROUTES_v1.json');

const onboarding = JSON.parse(await readFile(onboardingPath, 'utf8'));
const onboardingMd = await readFile(onboardingMdPath, 'utf8');
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const routes = JSON.parse(await readFile(routesPath, 'utf8'));
const errors = [];

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const productIds = new Set((portfolio.products ?? []).map((item) => item.id));
const routeIds = (routes.routes ?? []).map((item) => item.id);
const onboardingRouteIds = onboarding.route_ids ?? [];
const products = onboarding.products ?? [];

if (onboarding.version !== '1.0.0') errors.push('CUSTOMER_ONBOARDING_GUIDE_v1.json deve usar version 1.0.0.');
if (onboarding.framework !== portfolio.framework) errors.push('framework do onboarding diverge do portfólio.');
if (!nonEmpty(onboarding.purpose)) errors.push('purpose do onboarding está ausente.');
if (!nonEmpty(onboarding.principle)) errors.push('principle do onboarding está ausente.');
if (onboarding.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (onboarding.release_effect !== 'none') errors.push('release_effect deve permanecer none.');

if (!Array.isArray(onboarding.flow) || onboarding.flow.length !== 5) {
  errors.push('flow deve conter exatamente 5 passos.');
} else {
  onboarding.flow.forEach((item, index) => {
    if (item.step !== index + 1) errors.push(`flow[${index}] deve usar step ${index + 1}.`);
    if (!nonEmpty(item.name) || !nonEmpty(item.instruction)) errors.push(`flow[${index}] possui campo vazio.`);
  });
}

const seenProducts = new Set();
for (const item of products) {
  if (!productIds.has(item.product_id)) errors.push(`Produto inexistente no onboarding: ${item.product_id}`);
  if (seenProducts.has(item.product_id)) errors.push(`Produto duplicado no onboarding: ${item.product_id}`);
  seenProducts.add(item.product_id);
  if (!Array.isArray(item.first_steps) || item.first_steps.length < 3 || item.first_steps.some((step) => !nonEmpty(step))) {
    errors.push(`${item.product_id}: first_steps deve ter ao menos 3 itens não vazios.`);
  }
  if (!nonEmpty(item.done_signal)) errors.push(`${item.product_id}: done_signal ausente.`);
  if (!nonEmpty(item.release_note)) errors.push(`${item.product_id}: release_note ausente.`);
}
for (const id of productIds) {
  if (!seenProducts.has(id)) errors.push(`${id}: produto ausente do onboarding.`);
}
if (seenProducts.size !== productIds.size) errors.push('Cobertura do onboarding deve ser exata para os produtos canônicos.');

if (JSON.stringify(onboardingRouteIds) !== JSON.stringify(routeIds)) {
  errors.push(`route_ids diverge do contrato canônico: onboarding=${JSON.stringify(onboardingRouteIds)} routes=${JSON.stringify(routeIds)}`);
}
for (const id of routeIds) {
  if (!onboardingMd.includes(id)) errors.push(`Markdown de onboarding não menciona a rota canônica ${id}.`);
}

const staleRoutes = [
  /Método\s*(?:JPN)?\s*→\s*Prompt Builder/i,
  /Método\s*(?:JPN)?\s*→\s*Prompt Pack(?!\s*→\s*Prompt Builder)/i,
  /Prompt Pack\s*→\s*Business/i,
  /Business\s*→\s*Gestão Fácil/i,
];
for (const stale of staleRoutes) {
  if (stale.test(onboardingMd)) errors.push(`Markdown contém rota antiga isolada: ${stale}`);
}

if (!Array.isArray(onboarding.stop_conditions) || onboarding.stop_conditions.length < 4) errors.push('stop_conditions insuficientes.');
if (!Array.isArray(onboarding.checklist) || onboarding.checklist.length < 6) errors.push('checklist insuficiente.');
if (!Array.isArray(onboarding.guardrails) || onboarding.guardrails.length < 4) errors.push('guardrails insuficientes.');

const text = JSON.stringify(onboarding);
const riskyClaims = [
  /roi\s+garantid/i,
  /resultado\s+garantid/i,
  /100%\s+precis/i,
  /elimina\s+alucina/i,
  /substitui\s+revis[aã]o\s+humana/i,
];
for (const claim of riskyClaims) {
  if (claim.test(text)) errors.push(`Onboarding contém claim de risco: ${claim}`);
}

const proKit = products.find((item) => item.product_id === 'jpn-pro-kit');
if (!proKit || !/arquitetural|prepara/i.test(proKit.release_note ?? '')) {
  errors.push('JPN Pro Kit deve manter nota explícita de rota arquitetural/em preparação.');
}
const gestao = products.find((item) => item.product_id === 'jpn-gestao-facil');
if (!gestao || !/GF-QA-10/i.test(gestao.release_note ?? '') || !/REPOR/i.test(gestao.release_note ?? '')) {
  errors.push('Gestão Fácil deve preservar GF-QA-10 e o limite de REPOR como alerta.');
}

if (errors.length > 0) {
  console.error('Customer onboarding check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Customer onboarding check OK: ${products.length} produtos, ${routeIds.length} rotas canônicas e guardrails sincronizados.`);
