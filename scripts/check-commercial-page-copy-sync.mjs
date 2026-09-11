import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const productsRoot = path.join(root, 'commercial-site', 'products');
const copyPath = path.join(root, 'docs', 'commercial', 'PRODUCT_PAGE_COPY_v1.md');

const fail = (message) => {
  console.error(`commercial page copy sync: ${message}`);
  process.exitCode = 1;
};

const read = (file) => fs.readFileSync(file, 'utf8');

if (!fs.existsSync(copyPath)) fail('fonte canônica PRODUCT_PAGE_COPY_v1.md ausente');
if (!fs.existsSync(productsRoot)) fail('diretório commercial-site/products ausente');
if (process.exitCode) process.exit();

const copy = read(copyPath);
const requirements = {
  'metodo-jpn.html': [
    'Método JPN',
    'Jornada',
    'Precisão',
    'Narrativa',
    'Não. Ele melhora a estrutura da instrução',
  ],
  'jpn-prompt-builder.html': [
    'JPN Prompt Builder',
    'Modo Temporário',
    'QA físico contextual em celular real',
    'verificações assistivas humanas continuam pendentes',
    'não é DLP, anonimização nem compliance',
  ],
  'jpn-prompt-pack.html': [
    'JPN Prompt Pack',
    '18 templates',
    'Templates reutilizáveis, não respostas prontas',
  ],
  'jpn-business.html': [
    'JPN Business',
    '12 playbooks',
    'Revisão em 30 dias',
    'MANTER, AJUSTAR, PAUSAR ou DESCARTAR_NESTE_CASO',
    'não promete resultado financeiro',
  ],
  'jpn-gestao-facil.html': [
    'JPN Gestão Fácil',
    'Candidata v0.2',
    'GF-QA-10 permanece pendente',
    'REPOR é somente alerta',
    'Microsoft Excel, LibreOffice Calc e Google Sheets',
  ],
  'jpn-pro-kit.html': [
    'JPN Pro Kit',
    'EM PREPARAÇÃO',
    'sem preço, checkout, reserva',
  ],
};

const blockedPatterns = [
  [/R\$\s*\d/i, 'preço em reais'],
  [/comprar agora/i, 'CTA transacional'],
  [/garantia de resultado/i, 'claim de garantia'],
  [/<form\b/i, 'formulário'],
  [/https?:\/\//i, 'URL externa'],
];

for (const [file, expected] of Object.entries(requirements)) {
  const filePath = path.join(productsRoot, file);
  if (!fs.existsSync(filePath)) {
    fail(`página ausente: ${file}`);
    continue;
  }
  const html = read(filePath);
  for (const text of expected) {
    if (!html.includes(text)) fail(`${file}: fato/estado canônico ausente: ${text}`);
  }
  if (!html.includes('content="noindex,nofollow"')) fail(`${file}: noindex,nofollow ausente`);
  if (!html.toLowerCase().includes('não publicada')) fail(`${file}: estado não publicado ausente`);
  for (const [pattern, label] of blockedPatterns) {
    if (pattern.test(html)) fail(`${file}: padrão bloqueado detectado: ${label}`);
  }
}

for (const canonicalFact of [
  '18 templates canônicos',
  '12 playbooks canônicos',
  'QA físico contextual em celular',
  'GF-QA-10',
  'EM PREPARAÇÃO',
]) {
  if (!copy.includes(canonicalFact)) fail(`fonte canônica: fato obrigatório ausente: ${canonicalFact}`);
}

if (!process.exitCode) {
  console.log('commercial page copy sync: OK — seis páginas preservam fatos, estados e guardrails canônicos selecionados.');
}
