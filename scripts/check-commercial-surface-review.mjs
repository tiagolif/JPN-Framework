import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const reviewPath = path.join(root, 'docs/commercial/JPN_COMMERCIAL_SURFACE_REVIEW_v1.md');
const review = await readFile(reviewPath, 'utf8');
const errors = [];

const requireText = (fragment, label = fragment) => {
  if (!review.includes(fragment)) errors.push(`trecho obrigatório ausente (${label}): ${fragment}`);
};

for (const fragment of [
  'Status: **INTERNAL / NOT RELEASE READY**',
  'Publicação autorizada: **não**',
  '`release_ready=false`',
  '`publication_authorized=false`',
  'menor solução suficiente',
  'Prompt Builder',
  'Método JPN',
  'JPN Prompt Pack',
  'JPN Business',
  'JPN Gestão Fácil',
  'JPN Pro Kit',
  'Microsoft Excel, LibreOffice Calc e Google Sheets',
  'GF3-QA-11..18',
  'inspeção editorial/visual humana',
]) requireText(fragment);

for (const page of [
  'commercial-site/index.html',
  'commercial-site/ecossistema.html',
  'commercial-site/escolher-produto.html',
  'commercial-site/comparar-produtos.html',
  'commercial-site/products/',
]) requireText(page, `jornada comercial: ${page}`);

for (const criterion of [
  'Não existe preço, checkout, formulário, tracking ou captura de dados.',
  'Não existem depoimentos, métricas ou provas sociais inventadas.',
  'Navegação por teclado e foco visível funcionam.',
  'Tabelas possuem cabeçalhos de coluna/linha adequados.',
  'Layout permanece legível em largura móvel e desktop.',
]) requireText(criterion, `critério: ${criterion}`);

for (const evidence of [
  'caminho do arquivo',
  'commit/SHA avaliado',
  'viewport usado',
  'navegador usado',
  '`PASS` ou `FAIL`',
  'evidência visual',
  'Alteração posterior do conteúdo invalida a evidência',
]) requireText(evidence, `evidência: ${evidence}`);

if (errors.length) {
  console.error('Commercial surface review check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Commercial surface review check OK: jornada, seis produtos, critérios, evidência mínima e bloqueios de release preservados.');
