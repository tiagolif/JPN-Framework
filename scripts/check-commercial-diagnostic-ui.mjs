import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const diagnostic = JSON.parse(await readFile(path.join(root, 'docs/commercial/SMALL_BUSINESS_DIAGNOSTIC_v1.json'), 'utf8'));
const html = await readFile(path.join(root, 'commercial-site/escolher-produto.html'), 'utf8');
const errors = [];

const expect = (condition, message) => { if (!condition) errors.push(message); };
const includes = (value) => html.includes(value);

expect(includes('data-diagnostic-source="SMALL_BUSINESS_DIAGNOSTIC_v1.json"'), 'A página deve declarar SMALL_BUSINESS_DIAGNOSTIC_v1.json como fonte.');
expect(/<meta name="robots" content="noindex,nofollow"\s*\/>/.test(html), 'A página deve permanecer noindex,nofollow.');
expect(includes('Sem preço, checkout, lead capture ou promessa de resultado.'), 'Guardrail comercial principal ausente.');
expect(!/<form[^>]+action=/i.test(html), 'O diagnóstico não pode enviar formulário para endpoint externo.');
expect(!/fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|localStorage|sessionStorage/i.test(html), 'O diagnóstico deve operar localmente, sem rede ou armazenamento persistente.');
expect(!/jpn-pro-kit[^<]{0,120}(resultado|sugerid|recomend)/i.test(html), 'Pro Kit não pode ser sugerido como resultado do diagnóstico.');

for (const question of diagnostic.questions ?? []) {
  expect(includes(`data-question="${question.id}"`), `Pergunta ausente na UI: ${question.id}`);
  expect(includes(question.prompt), `Texto da pergunta diverge/ausente: ${question.id}`);
  for (const option of question.options ?? []) {
    expect(includes(`name="${question.id}" value="${option.id}"`), `Opção ausente na UI: ${question.id}=${option.id}`);
    expect(includes(option.label), `Label de opção ausente na UI: ${question.id}=${option.id}`);
  }
}

for (const outcome of diagnostic.outcomes ?? []) {
  expect(includes(`id:'${outcome.id}'`), `Outcome ausente da lógica local: ${outcome.id}`);
  expect(includes(`product:'${outcome.start_product}'`), `Produto inicial ausente da lógica: ${outcome.id} -> ${outcome.start_product}`);
  expect(includes(`route:'${outcome.route_id}'`), `Rota ausente da lógica: ${outcome.id} -> ${outcome.route_id}`);
  expect(includes(outcome.message), `Mensagem do outcome diverge/ausente: ${outcome.id}`);
  expect(includes(outcome.stop_rule), `Stop rule diverge/ausente: ${outcome.id}`);
  for (const next of outcome.optional_next ?? []) {
    expect(includes(`'${next}'`), `Continuação opcional ausente da lógica: ${outcome.id} -> ${next}`);
  }
  for (const condition of outcome.when ?? []) {
    const [questionId, value] = condition.split('=');
    expect(includes(`'${questionId}':'${value}'`), `Condição ausente da lógica: ${outcome.id} -> ${condition}`);
  }
}

expect(includes(`product:'${diagnostic.fallback.start_product}'`), 'Produto de fallback ausente da lógica local.');
expect(includes(`route:'${diagnostic.fallback.route_id}'`), 'Rota de fallback ausente da lógica local.');
expect(includes(diagnostic.fallback.message), 'Mensagem de fallback diverge/ausente.');

const legacyRoutes = [
  'Método JPN → Prompt Builder',
  'Método JPN → Prompt Pack',
  'Prompt Pack → JPN Business',
  'JPN Business → Gestão Fácil'
];
for (const legacy of legacyRoutes) {
  expect(!includes(legacy), `Combinação editorial legada ainda presente: ${legacy}`);
}

const blockedClaims = [
  /roi\s+garantid/i,
  /resultado\s+garantid/i,
  /garantia\s+de\s+vendas/i,
  /substitui\s+(contabilidade|erp|banco|auditoria)/i,
  /compre\s+agora/i,
  /checkout/i,
  /preço\s*:/i
];
const safeText = html
  .replace(/sem preço/gi, '')
  .replace(/sem[^<]{0,40}checkout/gi, '')
  .replace(/não substitui[^<.]{0,120}/gi, '');
for (const claim of blockedClaims) {
  if (claim.test(safeText)) errors.push(`Claim/comportamento comercial de risco detectado: ${claim}`);
}

expect(diagnostic.publication_authorized === false, 'Contrato do diagnóstico deve manter publication_authorized=false.');
expect(diagnostic.release_effect === 'none', 'Contrato do diagnóstico deve manter release_effect=none.');

if (errors.length) {
  console.error('Commercial diagnostic UI check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial diagnostic UI check OK: ${diagnostic.questions.length} perguntas e ${diagnostic.outcomes.length} outcomes sincronizados, sem envio ou armazenamento.`);
