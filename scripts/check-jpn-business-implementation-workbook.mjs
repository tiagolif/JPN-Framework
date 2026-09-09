import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workbookPath = path.join(root, 'docs/products/jpn-business/IMPLEMENTATION_WORKBOOK_v1.md');
const indexPath = path.join(root, 'docs/products/jpn-business/BUSINESS_INDEX.json');
const promptIndexPath = path.join(root, 'docs/products/prompt-pack/PROMPT_INDEX.json');

function fail(message) {
  console.error(`JPN Business implementation workbook check failed: ${message}`);
  process.exit(1);
}

for (const [label, file] of [
  ['workbook', workbookPath],
  ['Business index', indexPath],
  ['Prompt Pack index', promptIndexPath],
]) {
  if (!fs.existsSync(file)) fail(`${label} ausente`);
}

const workbook = fs.readFileSync(workbookPath, 'utf8');
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
  for (const promptId of playbook.prompt_pack_links ?? []) {
    if (!promptIds.has(promptId)) fail(`${playbook.id} referencia prompt inexistente: ${promptId}`);
    if (!workbook.includes(promptId)) fail(`${promptId}, ligado a ${playbook.id}, ausente no workbook`);
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

const forbiddenPatterns = [
  /https?:\/\//i,
  /checkout/i,
  /compre agora/i,
  /garantia de (ganho|lucro|vendas|economia)/i,
  /cart[aã]o de cr[eé]dito/i,
  /pix\b/i,
];
for (const pattern of forbiddenPatterns) {
  if (pattern.test(workbook)) fail(`padrão comercial/externo proibido encontrado: ${pattern}`);
}

console.log(`JPN Business implementation workbook OK: ${playbooks.length} playbooks e vínculos com Prompt Pack cobertos; guardrails preservados`);
