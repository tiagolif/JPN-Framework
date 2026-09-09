import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docPath = path.join(root, 'docs', 'commercial', 'USE_CASE_LIBRARY_v1.md');
const pagePath = path.join(root, 'commercial-site', 'casos-de-uso.html');

const fail = (message) => {
  console.error(`commercial use cases: ${message}`);
  process.exitCode = 1;
};

for (const required of [docPath, pagePath]) {
  if (!fs.existsSync(required)) fail(`arquivo obrigatório ausente: ${path.relative(root, required)}`);
}
if (process.exitCode) process.exit();

const doc = fs.readFileSync(docPath, 'utf8');
const html = fs.readFileSync(pagePath, 'utf8');

const products = ['Método JPN', 'JPN Prompt Builder', 'JPN Prompt Pack', 'JPN Business', 'JPN Gestão Fácil', 'JPN Pro Kit'];
for (const product of products) {
  if (!doc.includes(product)) fail(`documento sem produto canônico: ${product}`);
  if (!html.includes(product)) fail(`página sem produto canônico: ${product}`);
}

for (let i = 1; i <= 12; i += 1) {
  const id = `UC-${String(i).padStart(2, '0')}`;
  if (!doc.includes(id)) fail(`documento sem caso ${id}`);
  if (!html.includes(id)) fail(`página sem caso ${id}`);
}

const requiredDoc = [
  'candidate companion / commercial QA pending',
  'Comece pelo menor recurso que resolva a necessidade atual.',
  'QA físico contextual em celular ainda pendente',
  'GF-QA-10 multiplataforma permanece pendente',
  'rotas de trabalho, não bundles, descontos ou ofertas',
  'Regra de parada',
  'não substitui contabilidade, conciliação bancária nem validação profissional',
  'não é recomendação automática por ser mais completo',
];
for (const text of requiredDoc) if (!doc.includes(text)) fail(`documento sem regra/estado: ${text}`);

const requiredHtml = [
  'content="noindex,nofollow"',
  'Superfície interna e não publicada.',
  'Comece pelo menor recurso que resolva a necessidade atual.',
  'QA físico contextual em celular pendente',
  'GF-QA-10 multiplataforma pendente',
  'EM PREPARAÇÃO',
  'não bundles, descontos ou ofertas',
  'não autoriza compra, anúncio, publicação, criação de conta, checkout ou aceite legal',
];
for (const text of requiredHtml) if (!html.includes(text)) fail(`página sem regra/estado: ${text}`);

const forbidden = [/<form\b/i, /<input\b/i, /https?:\/\//i, /R\$\s*\d/i, /comprar agora/i, /garant[iaeo]\w*\s+(?:de\s+)?(?:resultado|retorno|vendas|lucro)/i];
for (const pattern of forbidden) if (pattern.test(html)) fail(`padrão comercial bloqueado detectado: ${pattern}`);

if (!process.exitCode) console.log('Commercial use cases check OK: 12 casos, 6 produtos, estados e guardrails preservados.');
