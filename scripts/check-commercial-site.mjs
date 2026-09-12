import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const siteRoot = path.join(root, 'commercial-site');
const productsDir = path.join(siteRoot, 'products');
const read = (p) => fs.readFileSync(p, 'utf8');
const fail = (message) => { console.error(`commercial-site preflight: ${message}`); process.exitCode = 1; };

const files = {
  landing: path.join(siteRoot, 'index.html'),
  selector: path.join(siteRoot, 'escolher-produto.html'),
  comparison: path.join(siteRoot, 'comparar-produtos.html'),
  how: path.join(siteRoot, 'como-funciona.html'),
  demo: path.join(siteRoot, 'demonstracao.html'),
  comparisonDoc: path.join(root, 'docs/commercial/PRODUCT_COMPARISON_MATRIX_v1.md'),
  howDoc: path.join(root, 'docs/commercial/HOW_JPN_WORKS_v1.md'),
  demoDoc: path.join(root, 'docs/commercial/GUIDED_DEMO_PLAYBOOK_v1.md'),
  css: path.join(siteRoot, 'styles.css'),
};

const products = [
  { id: 'metodo-jpn', name: 'Método JPN', file: 'metodo-jpn.html', diagnostic: true },
  { id: 'jpn-prompt-builder', name: 'JPN Prompt Builder', file: 'jpn-prompt-builder.html', diagnostic: true },
  { id: 'jpn-prompt-pack', name: 'JPN Prompt Pack', file: 'jpn-prompt-pack.html', diagnostic: true },
  { id: 'jpn-business', name: 'JPN Business', file: 'jpn-business.html', diagnostic: true },
  { id: 'jpn-gestao-facil', name: 'JPN Gestão Fácil', file: 'jpn-gestao-facil.html', diagnostic: true },
  { id: 'jpn-pro-kit', name: 'JPN Pro Kit', file: 'jpn-pro-kit.html', diagnostic: false },
];

for (const required of Object.values(files)) {
  if (!fs.existsSync(required)) fail(`arquivo obrigatório ausente: ${path.relative(root, required)}`);
}
for (const product of products) {
  const productPath = path.join(productsDir, product.file);
  if (!fs.existsSync(productPath)) fail(`página individual ausente: ${product.name}`);
}
if (process.exitCode) process.exit();

const html = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));

const baseForbidden = [
  [/<script\b[^>]*src=/i, 'script externo'],
  [/https?:\/\//i, 'URL externa'],
  [/R\$\s*\d/i, 'preço em reais'],
  [/comprar agora/i, 'CTA de compra'],
  [/finalizar compra/i, 'CTA de checkout'],
  [/ir para (?:o )?checkout/i, 'CTA de checkout'],
  [/garant[iaeo]\w*\s+(?:de\s+)?(?:resultado|retorno|vendas|lucro)/i, 'claim de garantia'],
];

const verifySafety = (content, label, { allowLocalDiagnosticForm = false } = {}) => {
  if (!content.includes('content="noindex,nofollow"')) fail(`${label}: noindex,nofollow ausente`);
  if (!content.toLowerCase().includes('não publicada')) fail(`${label}: estado interno/não publicado ausente`);
  for (const [pattern, blockedLabel] of baseForbidden) {
    if (pattern.test(content)) fail(`${label}: conteúdo bloqueado detectado: ${blockedLabel}`);
  }
  if (!allowLocalDiagnosticForm && /<(form|input)\b/i.test(content)) {
    fail(`${label}: formulário/input não permitido fora do diagnóstico local`);
  }
  if (allowLocalDiagnosticForm) {
    if (!/<form\b/i.test(content) || !/<input\b/i.test(content)) fail(`${label}: formulário diagnóstico esperado não encontrado`);
    if (/<form[^>]+action=/i.test(content)) fail(`${label}: formulário local não pode possuir action`);
    if (/fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|localStorage|sessionStorage/i.test(content)) {
      fail(`${label}: diagnóstico não pode usar rede ou armazenamento persistente`);
    }
  }
};

verifySafety(html.landing, 'landing');
verifySafety(html.selector, 'diagnóstico', { allowLocalDiagnosticForm: true });
verifySafety(html.comparison, 'comparação');
verifySafety(html.how, 'como funciona');
verifySafety(html.demo, 'demonstração');

for (const { id, name } of products) {
  if (!html.landing.includes(`data-product="${id}"`)) fail(`produto sem marcador canônico na landing: ${name}`);
  if (!html.landing.includes(`>${name}<`)) fail(`nome canônico ausente na landing: ${name}`);
  if (!html.selector.includes(name)) fail(`nome canônico ausente no diagnóstico: ${name}`);
  if (!html.comparison.includes(name)) fail(`nome canônico ausente na comparação: ${name}`);
  if (!html.comparisonDoc.includes(name)) fail(`nome canônico ausente na matriz documental: ${name}`);
  if (!html.how.includes(name)) fail(`nome canônico ausente em como funciona: ${name}`);
  if (!html.howDoc.includes(name)) fail(`nome canônico ausente no documento como funciona: ${name}`);
  if (!html.demo.includes(name)) fail(`nome canônico ausente na demonstração: ${name}`);
  if (!html.demoDoc.includes(name)) fail(`nome canônico ausente no playbook de demonstração: ${name}`);
}

const landingMarkers = [...html.landing.matchAll(/data-product="([^"]+)"/g)].map((match) => match[1]);
if (landingMarkers.length !== 6 || new Set(landingMarkers).size !== 6) fail('landing deve conter exatamente 6 data-product canônicos e únicos');

for (const required of ['content="noindex,nofollow"', 'EM PREPARAÇÃO', 'não publicada', 'Sem preço, checkout ou promessa de resultado.']) {
  if (!html.landing.includes(required)) fail(`guardrail ausente na landing: ${required}`);
}
if (!html.landing.includes('href="escolher-produto.html"')) fail('landing: link para diagnóstico ausente');
if (!html.selector.includes('href="comparar-produtos.html"')) fail('diagnóstico: link para comparação ausente');

const selectorRequirements = [
  'Comece pelo menor produto suficiente.',
  'SMALL_BUSINESS_DIAGNOSTIC_v1.json',
  'A lógica roda localmente nesta página',
  'O Pro Kit pode aparecer como resultado?',
  'não substitui contabilidade, banco, fiscal, ERP ou auditoria',
];
for (const text of selectorRequirements) {
  if (!html.selector.includes(text)) fail(`diagnóstico: regra/guardrail ausente: ${text}`);
}

for (const { name, file, diagnostic } of products) {
  if (diagnostic && !html.selector.includes(`products/${file}`)) fail(`diagnóstico: destino de resultado ausente para ${name}`);
  if (!html.comparison.includes(`href="products/${file}"`)) fail(`comparação: link para ${name} ausente`);
  if (!html.how.includes(`href="products/${file}"`)) fail(`como funciona: link para ${name} ausente`);
  if (!html.demo.includes(`href="products/${file}"`)) fail(`demonstração: link para ${name} ausente`);
}
if (/productPages\s*=\s*\{[^}]*jpn-pro-kit/s.test(html.selector)) fail('diagnóstico: Pro Kit não pode existir no mapa de resultados');

const documentRequirements = [
  [html.comparison, ['QA físico contextual em celular pendente','GF-QA-10 multiplataforma pendente','EM PREPARAÇÃO','não é a recomendação automática por ser mais abrangente']],
  [html.comparisonDoc, ['Escolha o menor produto que resolva a necessidade atual.','JPN Pro Kit não é a recomendação automática','GF-QA-10 multiplataforma ainda pendente','Regra de parada']],
  [html.how, ['Comece pelo menor recurso que resolva a necessidade atual','Cinco movimentos, sem obrigação de percorrer todos.','GF-QA-10 multiplataforma pendente','EM PREPARAÇÃO']],
  [html.howDoc, ['comece pelo menor recurso que resolva a necessidade atual','O ciclo JPN em 5 movimentos','GF-QA-10 multiplataforma permanece pendente','Regra de parada']],
  [html.demo, ['demonstração curta e controlada','dados fictícios','menor recurso suficiente','GF-QA-10 pendente','EM PREPARAÇÃO','Regra de parada']],
  [html.demoDoc, ['Toda demo deve seguir a sequência','Use somente dados fictícios ou explicitamente sanitizados','GF-QA-10 multiplataforma pendente','Regra de parada']],
];
for (const [content, requirements] of documentRequirements) {
  for (const required of requirements) if (!content.includes(required)) fail(`superfície/documento comercial perdeu regra esperada: ${required}`);
}
for (let i = 1; i <= 6; i += 1) {
  const id = `DEMO-${String(i).padStart(2, '0')}`;
  if (!html.demo.includes(id) || !html.demoDoc.includes(id)) fail(`cenário de demonstração ausente/inconsistente: ${id}`);
}

const canonicalTokens = ['#06121c','#0b1f33','#0e2639','#21455e','#f5f9fc','#a7bdcc','#2ec4b6','#86e2d9'];
for (const token of canonicalTokens) if (!html.css.toLowerCase().includes(token)) fail(`token visual canônico ausente no CSS: ${token}`);
if (!html.css.includes('@media(max-width:900px)') || !html.css.includes('@media(max-width:620px)')) fail('breakpoints responsivos esperados não encontrados');

for (const { id, name, file } of products) {
  const productHtml = read(path.join(productsDir, file));
  if (!productHtml.includes(`<body data-product="${id}">`)) fail(`${name}: data-product canônico ausente no body`);
  if (!productHtml.includes('href="../styles.css"')) fail(`${name}: stylesheet compartilhado ausente`);
  if (!productHtml.includes('href="../index.html')) fail(`${name}: retorno relativo ao portfólio ausente`);
  if (!productHtml.includes('<footer>')) fail(`${name}: rodapé de identidade/status ausente`);
  verifySafety(productHtml, name);
}
const proKitHtml = read(path.join(productsDir, 'jpn-pro-kit.html'));
if (!proKitHtml.includes('EM PREPARAÇÃO')) fail('JPN Pro Kit: estado EM PREPARAÇÃO ausente');
if (!proKitHtml.includes('sem preço, checkout, reserva')) fail('JPN Pro Kit: guardrail transacional específico ausente');

if (!process.exitCode) {
  const diagnosticCheck = spawnSync(process.execPath, ['scripts/check-commercial-diagnostic-ui.mjs'], { cwd: root, encoding: 'utf8' });
  if (diagnosticCheck.stdout) process.stdout.write(diagnosticCheck.stdout);
  if (diagnosticCheck.stderr) process.stderr.write(diagnosticCheck.stderr);
  if (diagnosticCheck.status !== 0) {
    fail('gate dedicado do diagnóstico comercial falhou');
  }
}

if (!process.exitCode) console.log('commercial-site preflight: OK — landing + diagnóstico local + comparação + como funciona + demonstração + 6 páginas individuais validados.');
