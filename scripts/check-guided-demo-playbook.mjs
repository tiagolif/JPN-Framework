import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const demoPath = path.join(root, 'docs/commercial/GUIDED_DEMO_PLAYBOOK_v1.json');
const demoMdPath = path.join(root, 'docs/commercial/GUIDED_DEMO_PLAYBOOK_v1.md');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');

const demo = JSON.parse(await readFile(demoPath, 'utf8'));
const demoMd = await readFile(demoMdPath, 'utf8');
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const errors = [];

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const productIds = new Set((portfolio.products ?? []).map((item) => item.id));
const demos = demo.demos ?? [];

if (demo.version !== '1.0.0') errors.push('GUIDED_DEMO_PLAYBOOK_v1.json deve usar version 1.0.0.');
if (demo.framework !== portfolio.framework) errors.push('framework da demo diverge do portfólio.');
if (!nonEmpty(demo.purpose) || !nonEmpty(demo.principle)) errors.push('purpose/principle da demo estão ausentes.');
if (demo.publication_authorized !== false) errors.push('publication_authorized deve permanecer false.');
if (demo.release_effect !== 'none') errors.push('release_effect deve permanecer none.');

const expectedSequence = ['Contextualizar', 'Escolher', 'Demonstrar', 'Revisar', 'Parar'];
if (JSON.stringify(demo.sequence) !== JSON.stringify(expectedSequence)) {
  errors.push('sequence deve preservar os cinco passos canônicos da demo.');
}

const seenIds = new Set();
const seenProducts = new Set();
for (const item of demos) {
  if (!/^DEMO-0[1-6]$/.test(item.id ?? '')) errors.push(`ID de demo inválido: ${item.id}`);
  if (seenIds.has(item.id)) errors.push(`ID de demo duplicado: ${item.id}`);
  seenIds.add(item.id);
  if (!productIds.has(item.product_id)) errors.push(`${item.id}: product_id inexistente: ${item.product_id}`);
  if (seenProducts.has(item.product_id)) errors.push(`${item.id}: produto duplicado na cobertura: ${item.product_id}`);
  seenProducts.add(item.product_id);
  if (!nonEmpty(item.problem) || !nonEmpty(item.sample_input) || !nonEmpty(item.expected_output)) {
    errors.push(`${item.id}: problem, sample_input e expected_output são obrigatórios.`);
  }
  if (!Array.isArray(item.show) || item.show.length < 3 || item.show.some((value) => !nonEmpty(value))) {
    errors.push(`${item.id}: show deve conter ao menos 3 itens não vazios.`);
  }
  if (!demoMd.includes(item.id)) errors.push(`Markdown não menciona ${item.id}.`);
}
for (const id of productIds) {
  if (!seenProducts.has(id)) errors.push(`${id}: produto ausente da demo guiada.`);
}
if (demos.length !== productIds.size) errors.push('A demo deve cobrir exatamente os seis produtos canônicos.');

const builder = demos.find((item) => item.product_id === 'jpn-prompt-builder');
if (!/QA físico contextual em celular pendente/i.test(builder?.required_state_note ?? '')) {
  errors.push('Prompt Builder deve preservar QA físico contextual em celular como pendente.');
}
const gestao = demos.find((item) => item.product_id === 'jpn-gestao-facil');
if (!/GF-QA-10/i.test(gestao?.required_state_note ?? '') || !/REPOR/i.test(gestao?.required_state_note ?? '')) {
  errors.push('Gestão Fácil deve preservar GF-QA-10 e REPOR como alerta.');
}
const proKit = demos.find((item) => item.product_id === 'jpn-pro-kit');
if (!/EM PREPARAÇÃO/i.test(proKit?.required_state_note ?? '') || !/não apresentar como release-ready/i.test(proKit?.required_state_note ?? '')) {
  errors.push('Pro Kit deve permanecer EM PREPARAÇÃO e não release-ready.');
}

if (!Array.isArray(demo.allowed_data) || demo.allowed_data.length < 2) errors.push('allowed_data insuficiente.');
if (!Array.isArray(demo.forbidden_data) || demo.forbidden_data.length < 5) errors.push('forbidden_data insuficiente.');
if (!Array.isArray(demo.safe_phrases) || demo.safe_phrases.length < 4) errors.push('safe_phrases insuficientes.');
if (!Array.isArray(demo.forbidden_claims) || demo.forbidden_claims.length < 5) errors.push('forbidden_claims insuficientes.');
if (!Array.isArray(demo.approval_criteria) || demo.approval_criteria.length < 5) errors.push('approval_criteria insuficientes.');
if (!Array.isArray(demo.stop_conditions) || demo.stop_conditions.length < 6) errors.push('stop_conditions insuficientes.');

const descriptiveText = JSON.stringify({
  purpose: demo.purpose,
  principle: demo.principle,
  demos: demo.demos,
  safe_phrases: demo.safe_phrases,
  approval_criteria: demo.approval_criteria,
});
const riskyClaims = [/roi\s+garantid/i, /resultado\s+garantid/i, /100%\s+precis/i, /elimina\s+erros/i, /substitui\s+um\s+especialista/i];
for (const claim of riskyClaims) {
  if (claim.test(descriptiveText)) errors.push(`Superfície descritiva da demo contém claim de risco: ${claim}`);
}

if (errors.length > 0) {
  console.error('Guided demo playbook check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Guided demo playbook check OK: ${demos.length} demos, cobertura exata do portfólio e estados críticos preservados.`);
