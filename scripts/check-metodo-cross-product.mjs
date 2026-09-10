import fs from 'node:fs';
import './check-metodo-casebook.mjs';

const methodPath = 'docs/products/metodo-jpn/METODO_JPN_v1.md';
const quickReferencePath = 'docs/products/metodo-jpn/METODO_JPN_QUICK_REFERENCE_v1.md';
const workbookPath = 'docs/products/metodo-jpn/METODO_JPN_PRACTICE_WORKBOOK_v1.md';
const auditPath = 'docs/products/metodo-jpn/AUDIT.md';
const packIndexPath = 'docs/products/prompt-pack/PROMPT_INDEX.json';
const businessIndexPath = 'docs/products/jpn-business/BUSINESS_INDEX.json';

const method = fs.readFileSync(methodPath, 'utf8');
const quickReference = fs.readFileSync(quickReferencePath, 'utf8');
const workbook = fs.readFileSync(workbookPath, 'utf8');
const audit = fs.readFileSync(auditPath, 'utf8');
const pack = JSON.parse(fs.readFileSync(packIndexPath, 'utf8'));
const business = JSON.parse(fs.readFileSync(businessIndexPath, 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const frameworkBase = '0.3.0-draft';
assert(method.includes(`JPN Framework \`${frameworkBase}\``), 'Método não declara a base canônica 0.3.0-draft.');
assert(quickReference.includes(`JPN Framework \`${frameworkBase}\``), 'Referência rápida divergiu da base metodológica.');
assert(workbook.includes(`JPN Framework \`${frameworkBase}\``), 'Workbook divergiu da base metodológica.');
assert(pack.framework_base === frameworkBase, 'Prompt Pack divergiu da base metodológica do Método.');
assert(business.framework_base === frameworkBase, 'JPN Business divergiu da base metodológica do Método.');

for (const heading of ['## 2. J — Jornada', '## 3. P — Precisão', '## 4. N — Narrativa', '## 6. Política de lacunas', '## 15. Relação com os produtos JPN']) {
  assert(method.includes(heading), `Seção canônica ausente no Método: ${heading}`);
}

for (const heading of [
  '## JPN em 30 segundos',
  '## Fluxo em 7 passos',
  '## Checklist J — Jornada',
  '## Checklist P — Precisão',
  '## Checklist N — Narrativa',
  '## Política de lacunas',
  '### Regra de parada',
  '## Modelo compacto para copiar',
  '## Antes de concluir',
  '## Limites desta referência',
]) {
  assert(quickReference.includes(heading), `Seção obrigatória ausente na referência rápida: ${heading}`);
}

for (const heading of [
  '## Como usar',
  '## Folha 1 — Captura da solicitação',
  '## Folha 2 — J: Jornada',
  '## Folha 3 — P: Precisão',
  '## Folha 4 — N: Narrativa',
  '## Folha 5 — Política de lacunas',
  '### Regra de parada',
  '## Folha 6 — Montagem da instrução JPN',
  '## Folha 7 — Revisão antes de executar',
  '## Folha 8 — Pós-execução',
  '## Autoavaliação — 12 pontos',
  '## Relação com os produtos JPN',
  '## Limites deste workbook',
]) {
  assert(workbook.includes(heading), `Seção obrigatória ausente no workbook: ${heading}`);
}

for (const exercise of ['## Exercício A — Pedido vago', '## Exercício B — Informação conflitante', '## Exercício C — Copy comercial sem fatos suficientes', '## Exercício D — Rotina operacional', '## Exercício E — Entrega parcial útil']) {
  assert(workbook.includes(exercise), `Exercício obrigatório ausente no workbook: ${exercise}`);
}

assert(quickReference.includes('candidate companion / editorial and visual QA pending'), 'Referência rápida deve preservar estado candidato.');
assert(workbook.includes('candidate companion / editorial and visual QA pending'), 'Workbook deve preservar estado candidato.');
assert(quickReference.includes('`METODO_JPN_v1.md`'), 'Referência rápida deve apontar para a fonte canônica.');
assert(workbook.includes('`METODO_JPN_v1.md`'), 'Workbook deve apontar para a fonte canônica.');

for (const state of ['`confirmed`', '`inferred`', '`unknown`', '`conflicting`']) {
  assert(method.includes(state), `Estado de confiança ausente no Método: ${state}`);
  assert(quickReference.includes(state), `Estado de confiança ausente na referência rápida: ${state}`);
  assert(workbook.includes(state), `Estado de confiança ausente no workbook: ${state}`);
}

for (const product of ['JPN Prompt Builder', 'JPN Prompt Pack', 'JPN Business', 'JPN Gestão Fácil', 'JPN Pro Kit']) {
  assert(method.includes(`### ${product}`), `Relação explícita ausente no Método: ${product}`);
  assert(workbook.includes(`**${product}:**`), `Relação explícita ausente no workbook: ${product}`);
}

assert(pack.templates.length === 18, `Prompt Pack deveria ter 18 templates, encontrou ${pack.templates.length}.`);
for (const template of pack.templates) {
  assert(/^PP-\d{2}$/.test(template.id), `ID inválido no Prompt Pack: ${template.id}`);
  assert(Array.isArray(template.primary_jpn), `primary_jpn ausente em ${template.id}.`);
  assert(JSON.stringify(template.primary_jpn) === JSON.stringify(['jornada', 'precisao', 'narrativa']), `${template.id} não preserva as três dimensões JPN.`);
}

const packIds = new Set(pack.templates.map((item) => item.id));
assert(business.playbooks.length === 12, `JPN Business deveria ter 12 playbooks, encontrou ${business.playbooks.length}.`);
for (const playbook of business.playbooks) {
  assert(/^JB-\d{2}$/.test(playbook.id), `ID inválido no Business: ${playbook.id}`);
  assert(Array.isArray(playbook.prompt_pack_links) && playbook.prompt_pack_links.length > 0, `${playbook.id} não possui vínculo com Prompt Pack.`);
  for (const ref of playbook.prompt_pack_links) {
    assert(packIds.has(ref), `${playbook.id} referencia prompt inexistente: ${ref}`);
  }
}

const gapRules = [
  'continuar com uma suposição de baixo risco claramente sinalizada',
  'buscar a informação em uma fonte autorizada',
  'solicitar esclarecimento se a ausência impedir execução correta',
  'entregar uma parte útil sem fingir que a tarefa foi concluída integralmente'
];
for (const rule of gapRules) {
  assert(method.includes(rule), `Regra de lacuna ausente: ${rule}`);
  assert(quickReference.includes(rule), `Regra de lacuna ausente na referência rápida: ${rule}`);
  assert(workbook.includes(rule), `Regra de lacuna ausente no workbook: ${rule}`);
}

for (let step = 1; step <= 7; step += 1) {
  assert(quickReference.includes(`${step}. **`), `Passo ${step} ausente do fluxo resumido.`);
}

for (const field of ['Contexto:', 'Estado atual:', 'Objetivo operacional:', 'Critérios de aceitação:', 'Estado final desejado:', 'Próxima ação:']) {
  assert(quickReference.includes(field), `Campo mínimo ausente no modelo compacto: ${field}`);
  assert(workbook.includes(field), `Campo mínimo ausente na montagem do workbook: ${field}`);
}

for (const scoreLabel of ['0–5: reestruture antes de executar', '6–9: ajuste as lacunas principais', '10–12: candidato a teste controlado']) {
  assert(workbook.includes(scoreLabel), `Faixa de autoavaliação ausente: ${scoreLabel}`);
}

for (const guardrail of [
  'gasto ou compra não autorizada',
  'publicação, anúncio ou envio externo não autorizado',
  'uso de dados financeiros reais para decisão',
  'aceite de termos legais',
  'criação de conta que exija verificação de identidade',
]) {
  assert(workbook.includes(guardrail), `Guardrail ausente no workbook: ${guardrail}`);
}

assert(workbook.includes('QA físico contextual em celular continua pendente'), 'Workbook deve preservar QA móvel do Prompt Builder como pendente.');
assert(workbook.includes('GF-QA-10 multiplataforma continua pendente'), 'Workbook deve preservar GF-QA-10 como pendente.');
assert(workbook.includes('`REPOR` é somente alerta, nunca autorização de compra'), 'Workbook deve preservar REPOR como alerta.');
assert(workbook.includes('permanece `EM PREPARAÇÃO`'), 'Workbook deve preservar o Pro Kit em preparação.');

for (const source of [quickReference, workbook]) {
  for (const prohibited of ['publication_authorized: true', 'release_ready: true', 'visual_qa: approved', 'garante respostas corretas', 'elimina alucinações']) {
    assert(!source.includes(prohibited), `Claim ou promoção indevida encontrada: ${prohibited}`);
  }
}

assert(audit.includes('Teste cruzado com Prompt Pack/Business | concluído'), 'AUDIT ainda não registra o teste cruzado como concluído.');
assert(audit.includes('Revisão ortográfica final | pendente'), 'AUDIT deve preservar revisão ortográfica final como pendente.');
assert(audit.includes('Revisão visual/diagramação | pendente'), 'AUDIT deve preservar revisão visual/diagramação como pendente.');
assert(audit.includes('PDF/DOCX final | pendente'), 'AUDIT deve preservar formatos finais como pendentes.');

console.log('Método JPN cross-product integrity: PASS');
console.log(`Base metodológica: ${frameworkBase}`);
console.log(`Prompt Pack: ${pack.templates.length} templates com J+P+N`);
console.log(`JPN Business: ${business.playbooks.length} playbooks com referências PP válidas`);
console.log('Referência rápida: 7 passos + política de lacunas + modelo compacto');
console.log('Workbook prático: 8 folhas + 5 exercícios + autoavaliação de 12 pontos');