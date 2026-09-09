import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workbookPath = path.join(root, 'docs/products/jpn-business/IMPLEMENTATION_WORKBOOK_v1.md');
const scorecardPath = path.join(root, 'docs/products/jpn-business/OPERATIONAL_SCORECARD_v1.md');
const sprintPath = path.join(root, 'docs/products/jpn-business/30_DAY_IMPLEMENTATION_SPRINT_v1.md');
const trackerPath = path.join(root, 'docs/products/jpn-business/IMPLEMENTATION_TRACKER_v1.csv');
const weeklyReviewPath = path.join(root, 'docs/products/jpn-business/WEEKLY_OPERATING_REVIEW_v1.md');
const weeklyLogPath = path.join(root, 'docs/products/jpn-business/WEEKLY_REVIEW_LOG_v1.csv');
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
  ['weekly operating review', weeklyReviewPath],
  ['weekly review log', weeklyLogPath],
  ['Business index', indexPath],
  ['Prompt Pack index', promptIndexPath],
]) {
  if (!fs.existsSync(file)) fail(`${label} ausente`);
}

const workbook = fs.readFileSync(workbookPath, 'utf8');
const scorecard = fs.readFileSync(scorecardPath, 'utf8');
const sprint = fs.readFileSync(sprintPath, 'utf8');
const tracker = fs.readFileSync(trackerPath, 'utf8');
const weeklyReview = fs.readFileSync(weeklyReviewPath, 'utf8');
const weeklyLog = fs.readFileSync(weeklyLogPath, 'utf8');
const businessIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const promptIndex = JSON.parse(fs.readFileSync(promptIndexPath, 'utf8'));
const playbooks = Array.isArray(businessIndex.playbooks) ? businessIndex.playbooks : [];
const prompts = Array.isArray(promptIndex.templates) ? promptIndex.templates : [];

if (playbooks.length !== 12) fail(`esperados 12 playbooks, encontrados ${playbooks.length}`);
if (prompts.length !== 18) fail(`esperados 18 prompts, encontrados ${prompts.length}`);

const promptIds = new Set(prompts.map((item) => item.id));
for (const playbook of playbooks) {
  if (!workbook.includes(playbook.id) || !workbook.includes(playbook.name)) fail(`${playbook.id} ausente/inconsistente no workbook`);
  if (!scorecard.includes(playbook.id) || !scorecard.includes(playbook.name)) fail(`${playbook.id} ausente/inconsistente no scorecard`);
  if (!sprint.includes(playbook.id) || !sprint.includes(playbook.name)) fail(`${playbook.id} ausente/inconsistente no sprint`);
  if (!weeklyReview.includes(playbook.id) || !weeklyReview.includes(playbook.name)) fail(`${playbook.id} ausente/inconsistente na revisão semanal`);
  for (const promptId of playbook.prompt_pack_links ?? []) {
    if (!promptIds.has(promptId)) fail(`${playbook.id} referencia prompt inexistente: ${promptId}`);
    if (!workbook.includes(promptId)) fail(`${promptId}, ligado a ${playbook.id}, ausente no workbook`);
    if (!sprint.includes(promptId)) fail(`${promptId}, ligado a ${playbook.id}, ausente no sprint`);
  }
}

for (const promptId of ['PP-04', 'PP-10', 'PP-17']) {
  if (!weeklyReview.includes(promptId)) fail(`${promptId} ausente na ligação JB-12 da revisão semanal`);
}

const scoreDimensions = ['Contexto','Precisão','Narrativa','Segurança','Rastreabilidade','Revisão humana','Repetibilidade','Condição de parada'];
for (const dimension of scoreDimensions) {
  if (!scorecard.includes(dimension)) fail(`dimensão ausente no scorecard: ${dimension}`);
  if (!sprint.includes(dimension)) fail(`dimensão ausente no sprint: ${dimension}`);
  if (!weeklyReview.includes(dimension)) fail(`dimensão ausente na revisão semanal: ${dimension}`);
}

for (const range of ['0–7', '8–12', '13–16']) {
  if (!scorecard.includes(range) || !sprint.includes(range) || !weeklyReview.includes(range)) fail(`faixa ausente em artefato operacional: ${range}`);
}

const requiredWeeklySections = [
  '## 1. Regra central',
  '## 2. Cadência de 30 minutos',
  '## 3. Perguntas obrigatórias',
  '## 4. Mapa dos 12 playbooks',
  '## 5. Ligação com Prompt Pack',
  '## 6. Semáforo operacional',
  '## 7. Relação com o scorecard',
  '## 8. Relação com o sprint de 30 dias',
  '## 9. Template de saída',
  '## 10. Guardrails',
  '## 11. Estado e limite',
];
for (const section of requiredWeeklySections) {
  if (!weeklyReview.includes(section)) fail(`seção obrigatória ausente na revisão semanal: ${section}`);
}
for (const marker of ['VERDE', 'AMARELO', 'VERMELHO', 'candidate companion / operational QA pending', 'Não complete lacunas por suposição.', 'dados fictícios ou sanitizados', 'não autoriza publicação', 'não autoriza envio automático', 'GF-QA-10 permanece pendente', 'QA físico contextual em celular permanece pendente', '`REPOR` é alerta, não autorização de compra', '`EM PREPARAÇÃO`', 'dados financeiros reais', 'aceite de termos legais', 'garantia de resultado']) {
  if (!weeklyReview.toLowerCase().includes(marker.toLowerCase())) fail(`guardrail/estado ausente na revisão semanal: ${marker}`);
}

const trackerHeader = 'registro_id,data_relativa,playbook_id,cenario,entrada_minima,saida_esperada,resultado_observado,pendencia,correcao,responsavel_revisao,status,score_contexto,score_precisao,score_narrativa,score_seguranca,score_rastreabilidade,score_revisao_humana,score_repetibilidade,score_condicao_parada,bloqueador_critico,decisao_humana';
if (!tracker.startsWith(trackerHeader)) fail('cabeçalho canônico ausente no tracker');
if (!tracker.includes('EXEMPLO-01')) fail('linha de exemplo ausente no tracker');
for (const modelId of ['MODELO-01', 'MODELO-02', 'MODELO-03']) if (!tracker.includes(modelId)) fail(`${modelId} ausente no tracker`);

const weeklyHeader = 'semana_id,data_relativa,playbooks_observados,fatos_confirmados,pendencias,correcoes,bloqueador_critico,semaforo,proximo_passo_1,proximo_passo_2,proximo_passo_3,responsavel_revisao,decisao';
if (!weeklyLog.startsWith(weeklyHeader)) fail('cabeçalho canônico ausente no log semanal');
if (!weeklyLog.includes('EXEMPLO-SEMANA-01')) fail('exemplo ausente no log semanal');
for (const modelId of ['MODELO-SEMANA-01','MODELO-SEMANA-02','MODELO-SEMANA-03','MODELO-SEMANA-04']) if (!weeklyLog.includes(modelId)) fail(`${modelId} ausente no log semanal`);
if (!weeklyLog.includes('Cenario ficticio')) fail('log semanal deve conter cenário fictício');

const forbiddenPatterns = [/https?:\/\//i,/checkout/i,/compre agora/i,/garantia de (ganho|lucro|vendas|economia)/i,/cart[aã]o de cr[eé]dito/i,/pix\b/i];
for (const [label, content] of [['workbook', workbook],['scorecard', scorecard],['sprint', sprint],['tracker', tracker],['weekly review', weeklyReview],['weekly log', weeklyLog]]) {
  for (const pattern of forbiddenPatterns) if (pattern.test(content)) fail(`padrão comercial/externo proibido encontrado em ${label}: ${pattern}`);
}

console.log(`JPN Business implementation stack OK: ${playbooks.length} playbooks, ${scoreDimensions.length} dimensões, sprint, tracker e revisão semanal protegidos; guardrails preservados`);
