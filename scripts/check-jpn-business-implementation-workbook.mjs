import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workbookPath = path.join(root, 'docs/products/jpn-business/IMPLEMENTATION_WORKBOOK_v1.md');
const scorecardPath = path.join(root, 'docs/products/jpn-business/OPERATIONAL_SCORECARD_v1.md');
const sprintPath = path.join(root, 'docs/products/jpn-business/30_DAY_IMPLEMENTATION_SPRINT_v1.md');
const trackerPath = path.join(root, 'docs/products/jpn-business/IMPLEMENTATION_TRACKER_v1.csv');
const indexPath = path.join(root, 'docs/products/jpn-business/BUSINESS_INDEX.json');
const promptIndexPath = path.join(root, 'docs/products/prompt-pack/PROMPT_INDEX.json');

function fail(message) {
  console.error(`JPN Business implementation workbook check failed: ${message}`);
  process.exit(1);
}

for (const [label, file] of [
  ['workbook', workbookPath],
  ['scorecard', scorecardPath],
  ['30-day sprint', sprintPath],
  ['implementation tracker', trackerPath],
  ['Business index', indexPath],
  ['Prompt Pack index', promptIndexPath],
]) {
  if (!fs.existsSync(file)) fail(`${label} ausente`);
}

const workbook = fs.readFileSync(workbookPath, 'utf8');
const scorecard = fs.readFileSync(scorecardPath, 'utf8');
const sprint = fs.readFileSync(sprintPath, 'utf8');
const tracker = fs.readFileSync(trackerPath, 'utf8');
const businessIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const promptIndex = JSON.parse(fs.readFileSync(promptIndexPath, 'utf8'));
const playbooks = Array.isArray(businessIndex.playbooks) ? businessIndex.playbooks : [];
const prompts = Array.isArray(promptIndex.templates) ? promptIndex.templates : [];

if (playbooks.length !== 12) fail(`esperados 12 playbooks, encontrados ${playbooks.length}`);
if (prompts.length !== 18) fail(`esperados 18 prompts, encontrados ${prompts.length}`);

const promptIds = new Set(prompts.map((item) => item.id));
for (const playbook of playbooks) {
  if (!workbook.includes(playbook.id)) fail(`${playbook.id} ausente no workbook`);
  if (!workbook.includes(playbook.name)) fail(`nome de ${playbook.id} ausente no workbook`);
  if (!scorecard.includes(playbook.id)) fail(`${playbook.id} ausente no scorecard`);
  if (!scorecard.includes(playbook.name)) fail(`nome de ${playbook.id} ausente no scorecard`);
  if (!sprint.includes(playbook.id)) fail(`${playbook.id} ausente no sprint de 30 dias`);
  if (!sprint.includes(playbook.name)) fail(`nome de ${playbook.id} ausente no sprint de 30 dias`);
  for (const promptId of playbook.prompt_pack_links ?? []) {
    if (!promptIds.has(promptId)) fail(`${playbook.id} referencia prompt inexistente: ${promptId}`);
    if (!workbook.includes(promptId)) fail(`${promptId}, ligado a ${playbook.id}, ausente no workbook`);
    if (!sprint.includes(promptId)) fail(`${promptId}, ligado a ${playbook.id}, ausente no sprint`);
  }
}

const requiredSections = [
  '## 1. Regra de implantação',
  '## 2. Mapa dos 12 playbooks',
  '## 3. Diagnóstico inicial de 15 minutos',
  '## 4. Ciclo de implantação em 7 movimentos',
  '## 5. Fichas rápidas por playbook',
  '## 6. Registro de teste',
  '## 7. Critério mínimo para uso interno recorrente',
  '## 8. Integração com outros produtos JPN',
  '## 9. Estado e limites',
];
for (const section of requiredSections) {
  if (!workbook.includes(section)) fail(`seção obrigatória ausente: ${section}`);
}

const requiredScorecardSections = [
  '## 1. Regra central',
  '## 2. Escala de avaliação',
  '## 3. Dimensões do scorecard',
  '## 4. Classificação auxiliar',
  '## 5. Bloqueadores críticos',
  '## 6. Ficha de avaliação',
  '## 7. Mapa dos 12 playbooks',
  '## 8. Exemplos fictícios',
  '## 9. Relação com outros produtos JPN',
  '## 10. Estado e limites',
];
for (const section of requiredScorecardSections) {
  if (!scorecard.includes(section)) fail(`seção obrigatória ausente no scorecard: ${section}`);
}

const requiredSprintSections = [
  '## 1. Regra central',
  '## 2. Objetivo dos 30 dias',
  '## 3. Semana 1 — Escolher e delimitar',
  '## 4. Semana 2 — Testar e observar',
  '## 5. Semana 3 — Repetir e documentar',
  '## 6. Semana 4 — Avaliar e decidir',
  '## 7. Rotas recomendadas por tipo de necessidade',
  '## 8. Integração com outros produtos JPN',
  '## 9. Limites e guardrails',
];
for (const section of requiredSprintSections) {
  if (!sprint.includes(section)) fail(`seção obrigatória ausente no sprint: ${section}`);
}

const scoreDimensions = [
  'Contexto',
  'Precisão',
  'Narrativa',
  'Segurança',
  'Rastreabilidade',
  'Revisão humana',
  'Repetibilidade',
  'Condição de parada',
];
for (const dimension of scoreDimensions) {
  if (!scorecard.includes(dimension)) fail(`dimensão ausente no scorecard: ${dimension}`);
  if (!sprint.includes(dimension)) fail(`dimensão ausente no sprint: ${dimension}`);
}

for (const range of ['0–7', '8–12', '13–16', '16 pontos']) {
  if (!scorecard.includes(range)) fail(`faixa/limite ausente no scorecard: ${range}`);
}
for (const range of ['0–7', '8–12', '13–16']) {
  if (!sprint.includes(range)) fail(`faixa/limite ausente no sprint: ${range}`);
}

const requiredGuardrails = [
  'Não complete lacunas por suposição.',
  'não inventar preço, desconto, prazo, condição, estoque ou disponibilidade',
  'não publicar, agendar ou declarar resultado esperado como fato',
  'não comprar mídia, publicar anúncio, aceitar termos de plataforma ou definir orçamento financeiro real',
  'não incluir segredos, credenciais, dados financeiros reais ou informação sem origem confiável',
  '`REPOR` é alerta, não autorização de compra',
  'GF-QA-10 permanece pendente',
  'QA físico contextual em celular permanece pendente',
  'JPN Pro Kit',
  '`EM PREPARAÇÃO`',
  'garantia de resultado',
];
for (const marker of requiredGuardrails) {
  if (!workbook.toLowerCase().includes(marker.toLowerCase())) fail(`guardrail/estado ausente: ${marker}`);
}

const scorecardGuardrails = [
  'não substitui julgamento humano',
  'bloqueador crítico',
  'não autoriza envio automático',
  'GF-QA-10 permanece pendente',
  'QA físico contextual em celular permanece pendente',
  '`REPOR` é alerta, não autorização de compra',
  '`EM PREPARAÇÃO`',
  'dados financeiros reais',
  'garantia de resultado',
  'aceite de termos legais',
];
for (const marker of scorecardGuardrails) {
  if (!scorecard.toLowerCase().includes(marker.toLowerCase())) fail(`guardrail/estado ausente no scorecard: ${marker}`);
}

const sprintGuardrails = [
  'candidate companion / operational QA pending',
  'Não complete lacunas por suposição.',
  'dados fictícios ou sanitizados',
  'não autoriza publicação',
  'não autoriza envio automático',
  'GF-QA-10 permanece pendente',
  'QA físico contextual em celular permanece pendente',
  '`REPOR` é alerta, não autorização de compra',
  '`EM PREPARAÇÃO`',
  'dados financeiros reais',
  'aceite de termos legais',
  'garantia de resultado',
];
for (const marker of sprintGuardrails) {
  if (!sprint.toLowerCase().includes(marker.toLowerCase())) fail(`guardrail/estado ausente no sprint: ${marker}`);
}

const trackerHeader = 'registro_id,data_relativa,playbook_id,cenario,entrada_minima,saida_esperada,resultado_observado,pendencia,correcao,responsavel_revisao,status,score_contexto,score_precisao,score_narrativa,score_seguranca,score_rastreabilidade,score_revisao_humana,score_repetibilidade,score_condicao_parada,bloqueador_critico,decisao_humana';
if (!tracker.startsWith(trackerHeader)) fail('cabeçalho canônico ausente no tracker');
if (!tracker.includes('EXEMPLO-01')) fail('linha de exemplo ausente no tracker');
for (const modelId of ['MODELO-01', 'MODELO-02', 'MODELO-03']) {
  if (!tracker.includes(modelId)) fail(`${modelId} ausente no tracker`);
}
if (!tracker.includes('Cenario ficticio')) fail('tracker deve usar cenário fictício no exemplo');
if (!tracker.includes('pendente')) fail('tracker deve preservar decisão pendente nos modelos');

const forbiddenPatterns = [
  /https?:\/\//i,
  /checkout/i,
  /compre agora/i,
  /garantia de (ganho|lucro|vendas|economia)/i,
  /cart[aã]o de cr[eé]dito/i,
  /pix\b/i,
];
for (const [label, content] of [['workbook', workbook], ['scorecard', scorecard], ['sprint', sprint], ['tracker', tracker]]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) fail(`padrão comercial/externo proibido encontrado em ${label}: ${pattern}`);
  }
}

console.log(`JPN Business implementation workbook + scorecard + 30-day sprint + tracker OK: ${playbooks.length} playbooks, ${scoreDimensions.length} dimensões e vínculos com Prompt Pack cobertos; guardrails preservados`);
