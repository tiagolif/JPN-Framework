import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'jpn-local-hub/index.html');
const cssPath = path.join(root, 'jpn-local-hub/styles.css');
const docsPath = path.join(root, 'docs/product-system/JPN_LOCAL_HUB_v1.md');
const errors = [];

for (const file of [htmlPath, cssPath, docsPath]) {
  try { await access(file); } catch { errors.push(`Arquivo ausente: ${path.relative(root, file)}`); }
}

if (errors.length === 0) {
  const html = await readFile(htmlPath, 'utf8');
  const css = await readFile(cssPath, 'utf8');
  const docs = await readFile(docsPath, 'utf8');

  const requiredRoutes = new Map([
    ['metodo-jpn', '../metodo-jpn-site/index.html'],
    ['jpn-prompt-pack', '../prompt-pack-site/index.html'],
    ['jpn-business', '../business-site/index.html'],
    ['jpn-prompt-builder', '../product-site/index.html'],
    ['jpn-gestao-facil', '../docs/products/gestao-facil/importacao-v0.3/README_IMPORTACAO.md'],
    ['jpn-pro-kit', '../pro-kit-site/index.html'],
  ]);

  for (const [id, href] of requiredRoutes) {
    if (!html.includes(`data-route="${id}"`)) errors.push(`Rota de produto ausente: ${id}`);
    if (!html.includes(`href="${href}"`)) errors.push(`Destino esperado ausente para ${id}: ${href}`);
    const target = path.resolve(path.dirname(htmlPath), href);
    try { await access(target); } catch { errors.push(`Destino local inexistente para ${id}: ${path.relative(root, target)}`); }
  }

  const commercialRoutes = ['commercial-catalog','commercial-presentation','commercial-sales-sheet','commercial-art-gallery','commercial-diagnostic','commercial-faq'];
  for (const id of commercialRoutes) if (!html.includes(`data-route="${id}"`)) errors.push(`Rota comercial ausente: ${id}`);

  const sourceRefs = ['PRODUCT_READINESS_BOARD_v1.md','PRODUCT_RELEASE_STATUS_v1.json','RELEASE_EVIDENCE_CONTRACT_v1.md'];
  for (const source of sourceRefs) if (!html.includes(source) || !docs.includes(source)) errors.push(`Fonte de verdade não referenciada no HTML e na documentação: ${source}`);

  if (!html.includes('noindex,nofollow')) errors.push('Hub deve permanecer noindex,nofollow.');
  if (!html.includes('EM PREPARAÇÃO')) errors.push('Estado EM PREPARAÇÃO do Pro Kit deve permanecer visível.');
  if (!html.includes('18 templates')) errors.push('Quantidade canônica de 18 templates do Prompt Pack deve permanecer visível.');
  if (!html.includes('12 playbooks')) errors.push('Quantidade canônica de 12 playbooks do Business deve permanecer visível.');
  if (!html.includes('Excel, LibreOffice e Google Sheets')) errors.push('Pendência multiplataforma da Gestão Fácil deve permanecer explícita.');
  if (!html.includes('QA físico em celular')) errors.push('Pendência física do Prompt Builder deve permanecer explícita.');
  if (!css.includes('@media print')) errors.push('Hub deve manter suporte de impressão interna.');

  const forbidden = [/<form\b/i,/<input\b/i,/<button\b/i,/fetch\s*\(/i,/XMLHttpRequest/i,/https?:\/\//i,/analytics/i,/checkout/i,/pre[cç]o\s*:/i];
  for (const pattern of forbidden) if (pattern.test(html)) errors.push(`Padrão proibido no hub: ${pattern}`);

  if (!docs.includes('publication_authorized: false')) errors.push('Documentação deve preservar publication_authorized: false.');
  if (!docs.includes('release_effect: none')) errors.push('Documentação deve preservar release_effect: none.');
}

if (errors.length) {
  console.error('JPN local hub check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('JPN local hub check OK: 6 produtos, 6 rotas comerciais, fontes de verdade e guardrails validados.');