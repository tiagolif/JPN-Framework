import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const playbookPath = path.join(root, 'docs/commercial/SALES_ENABLEMENT_PLAYBOOK_v1.md');
const recordPath = path.join(root, 'docs/commercial/SALES_CONVERSATION_RECORD_v1.md');
const objectionsPath = path.join(root, 'docs/commercial/OBJECTION_RESPONSE_LIBRARY_v1.md');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');

function fail(message) {
  console.error(`sales enablement check failed: ${message}`);
  process.exit(1);
}

for (const [label, file] of [
  ['playbook', playbookPath],
  ['registro de conversa', recordPath],
  ['biblioteca de objeções', objectionsPath],
  ['portfólio canônico', portfolioPath],
]) {
  if (!fs.existsSync(file)) fail(`${label} ausente`);
}

const playbook = fs.readFileSync(playbookPath, 'utf8');
const record = fs.readFileSync(recordPath, 'utf8');
const objections = fs.readFileSync(objectionsPath, 'utf8');
const portfolio = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));

if (!Array.isArray(portfolio.products) || portfolio.products.length !== 6) {
  fail('esperados exatamente 6 produtos no portfólio canônico');
}

for (const product of portfolio.products) {
  if (!product.canonical_name || !playbook.includes(product.canonical_name)) {
    fail(`produto canônico não representado no playbook: ${product.id}`);
  }
  if (!record.includes(product.canonical_name)) {
    fail(`produto canônico não representado no registro de conversa: ${product.id}`);
  }
  if (!objections.includes(product.canonical_name)) {
    fail(`produto canônico não representado na biblioteca de objeções: ${product.id}`);
  }
}

const requiredSections = [
  '## 1. Princípio de uso',
  '## 2. Mapa de indicação por necessidade',
  '## 3. Qualificação curta',
  '## 4. Roteiro de demonstração sem promessas',
  '## 5. Objeções e respostas seguras',
  '## 6. Encaminhamento entre produtos',
  '## 8. Mini-casos fictícios',
  '## 9. Checklist antes de enviar proposta ou link',
  '## 11. Claims que exigem evidência antes de uso',
  '## 12. Estado do material'
];

for (const section of requiredSections) {
  if (!playbook.includes(section)) fail(`seção obrigatória ausente: ${section}`);
}

const requiredGuardrails = [
  'não prometer ganho de receita, produtividade, precisão ou economia sem evidência específica',
  'não inventar preço, desconto, bônus, prazo, compatibilidade ou disponibilidade',
  'não apresentar candidato interno como produto final',
  'não pressionar o cliente com urgência artificial',
  'não representa publicação, oferta comercial ativa, preço ou autorização de venda'
];

for (const guardrail of requiredGuardrails) {
  if (!playbook.includes(guardrail)) fail(`guardrail obrigatório ausente: ${guardrail}`);
}

const claimsHeading = '## 11. Claims que exigem evidência antes de uso';
const stateHeading = '## 12. Estado do material';
const claimsStart = playbook.indexOf(claimsHeading);
const claimsEnd = playbook.indexOf(stateHeading);
if (claimsStart < 0 || claimsEnd <= claimsStart) fail('bloco de claims inválido');

const claimsBlock = playbook.slice(claimsStart, claimsEnd);
const requiredBlockedClaims = [
  'aumenta vendas',
  'reduz custos em X%',
  'economiza X horas',
  'melhora respostas em X%',
  'funciona em qualquer IA sem adaptação',
  '100% privado',
  'sem erros',
  'substitui funcionário, consultor, contador ou ERP',
  'garante resultado'
];

for (const claim of requiredBlockedClaims) {
  if (!claimsBlock.includes(claim)) fail(`claim que deve permanecer bloqueado não listado: ${claim}`);
}

if (!playbook.includes('Não há garantia de resultado')) {
  fail('disclaimer explícito de ausência de garantia não encontrado');
}
if (!playbook.includes('Este arquivo é um ativo interno de sales enablement')) {
  fail('estado interno do material não declarado');
}

const requiredRecordSections = [
  '## 1. Contexto confirmado',
  '## 2. Classificação da necessidade',
  '## 3. Produto indicado',
  '## 4. Fatos, lacunas e hipóteses',
  '## 5. Claims e condições',
  '## 6. Demonstração ou material usado',
  '## 7. Próximo passo',
  '## 8. Estado comercial',
];
for (const section of requiredRecordSections) {
  if (!record.includes(section)) fail(`seção obrigatória ausente no registro: ${section}`);
}

for (const marker of [
  'Publicação autorizada por este registro: **não**',
  'Venda autorizada por este registro: **não**',
  'Não usar credenciais, dados financeiros reais ou informação sensível em demonstrações internas.',
  'O Pro Kit não deve ser indicado automaticamente quando um produto individual resolve a necessidade.',
  'não completar lacunas por suposição',
]) {
  if (!record.toLowerCase().includes(marker.toLowerCase())) {
    fail(`guardrail ausente no registro de conversa: ${marker}`);
  }
}

const objectionSections = [
  '## 1. Regra de uso',
  '## 2. Estrutura-padrão de resposta',
  '## 3. Objeções sobre necessidade e valor',
  '## 4. Objeções sobre resultado e eficácia',
  '## 5. Objeções sobre compatibilidade e tecnologia',
  '## 6. Objeções sobre produtos específicos',
  '## 7. Objeções sobre implementação',
  '## 8. Objeções comerciais e transacionais',
  '## 9. Objeções sobre suporte, responsabilidade e risco',
  '## 10. Sinais para não tentar “vencer” a objeção',
  '## 11. Matriz rápida de encaminhamento',
  '## 12. Checklist antes de usar uma resposta',
  '## 13. Estado do material',
];
for (const section of objectionSections) {
  if (!objections.includes(section)) fail(`seção obrigatória ausente na biblioteca de objeções: ${section}`);
}

const objectionIds = [...objections.matchAll(/### OBJ-(\d{2}) —/g)].map((match) => match[1]);
if (objectionIds.length !== 28) {
  fail(`esperadas exatamente 28 objeções, encontradas ${objectionIds.length}`);
}
for (let i = 1; i <= 28; i += 1) {
  const id = String(i).padStart(2, '0');
  if (!objectionIds.includes(id)) fail(`objeção OBJ-${id} ausente`);
}

for (const marker of [
  'menor recurso suficiente',
  'Não há garantia de resultado',
  '18 templates canônicos',
  '12 playbooks canônicos',
  'QA físico contextual em dispositivo real continua pendente',
  'GF-QA-10 multiplataforma continua pendente',
  '`REPOR` é somente alerta operacional, nunca autorização de compra',
  'JPN Pro Kit permanece `EM PREPARAÇÃO`',
  'não se deve prometer “100% privado”',
  'não autoriza preço, estimativa, desconto, condição ou forma de pagamento',
  'não autoriza publicação, envio externo, campanha ou automação de comunicação',
  'candidate internal sales enablement / commercial QA pending',
]) {
  if (!objections.toLowerCase().includes(marker.toLowerCase())) {
    fail(`marcador obrigatório ausente na biblioteca de objeções: ${marker}`);
  }
}

const forbiddenTransactionalPatterns = [
  /https?:\/\//i,
  /pix\b/i,
  /cart[aã]o de cr[eé]dito/i,
  /boleto/i,
  /compre agora/i,
  /garantia de resultado/i,
  /últimas vagas/i,
  /s[oó] hoje/i,
];
for (const pattern of forbiddenTransactionalPatterns) {
  if (pattern.test(objections)) {
    const allowedContext = pattern.source.includes('garantia') || pattern.source.includes('últimas') || pattern.source.includes('s[oó] hoje') || pattern.source.includes('compre agora');
    if (!allowedContext) fail(`padrão transacional proibido encontrado na biblioteca: ${pattern}`);
  }
}

console.log(`sales enablement OK: ${portfolio.products.length} produtos cobertos; 28 objeções seguras validadas; claims e ações transacionais permanecem bloqueados`);
