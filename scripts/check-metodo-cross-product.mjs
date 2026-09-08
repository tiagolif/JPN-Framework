import fs from 'node:fs';

const methodPath = 'docs/products/metodo-jpn/METODO_JPN_v1.md';
const auditPath = 'docs/products/metodo-jpn/AUDIT.md';
const packIndexPath = 'docs/products/prompt-pack/PROMPT_INDEX.json';
const businessIndexPath = 'docs/products/jpn-business/BUSINESS_INDEX.json';

const method = fs.readFileSync(methodPath, 'utf8');
const audit = fs.readFileSync(auditPath, 'utf8');
const pack = JSON.parse(fs.readFileSync(packIndexPath, 'utf8'));
const business = JSON.parse(fs.readFileSync(businessIndexPath, 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const frameworkBase = '0.3.0-draft';
assert(method.includes(`JPN Framework \`${frameworkBase}\``), 'Método não declara a base canônica 0.3.0-draft.');
assert(pack.framework_base === frameworkBase, 'Prompt Pack divergiu da base metodológica do Método.');
assert(business.framework_base === frameworkBase, 'JPN Business divergiu da base metodológica do Método.');

for (const heading of ['## 2. J — Jornada', '## 3. P — Precisão', '## 4. N — Narrativa', '## 6. Política de lacunas', '## 15. Relação com os produtos JPN']) {
  assert(method.includes(heading), `Seção canônica ausente no Método: ${heading}`);
}

for (const state of ['`confirmed`', '`inferred`', '`unknown`', '`conflicting`']) {
  assert(method.includes(state), `Estado de confiança ausente no Método: ${state}`);
}

for (const product of ['JPN Prompt Builder', 'JPN Prompt Pack', 'JPN Business', 'JPN Gestão Fácil', 'JPN Pro Kit']) {
  assert(method.includes(`### ${product}`), `Relação explícita ausente no Método: ${product}`);
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
for (const rule of gapRules) assert(method.includes(rule), `Regra de lacuna ausente: ${rule}`);

assert(audit.includes('Teste cruzado com Prompt Pack/Business | concluído'), 'AUDIT ainda não registra o teste cruzado como concluído.');
assert(audit.includes('Revisão ortográfica final | pendente'), 'AUDIT deve preservar revisão ortográfica final como pendente.');
assert(audit.includes('Revisão visual/diagramação | pendente'), 'AUDIT deve preservar revisão visual/diagramação como pendente.');
assert(audit.includes('PDF/DOCX final | pendente'), 'AUDIT deve preservar formatos finais como pendentes.');

console.log('Método JPN cross-product integrity: PASS');
console.log(`Base metodológica: ${frameworkBase}`);
console.log(`Prompt Pack: ${pack.templates.length} templates com J+P+N`);
console.log(`JPN Business: ${business.playbooks.length} playbooks com referências PP válidas`);
