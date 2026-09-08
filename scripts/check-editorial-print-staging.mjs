import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const stagingRoot = join(root, 'dist', 'editorial-print-staging');

const expected = [
  {
    id: 'metodo-jpn',
    title: 'Método JPN',
    version: 'v1',
    source: 'docs/products/metodo-jpn/METODO_JPN_v1.md',
    cover: 'assets/covers/metodo-jpn-v1.svg',
  },
  {
    id: 'jpn-prompt-pack',
    title: 'JPN Prompt Pack',
    version: 'v1',
    source: 'docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md',
    cover: 'assets/covers/jpn-prompt-pack-v1.svg',
  },
  {
    id: 'jpn-business',
    title: 'JPN Business',
    version: 'v1',
    source: 'docs/products/jpn-business/JPN_BUSINESS_v1.md',
    cover: 'assets/covers/jpn-business-v1.svg',
  },
  {
    id: 'gestao-facil-manual',
    title: 'JPN Gestão Fácil — Manual',
    version: 'v0.1',
    source: 'docs/products/gestao-facil/MANUAL_v0.1.md',
    cover: 'assets/covers/jpn-gestao-facil-v01.svg',
  },
  {
    id: 'pro-kit-leia-primeiro',
    title: 'JPN Pro Kit — Leia Primeiro',
    version: 'v1',
    source: 'docs/products/pro-kit/LEIA_PRIMEIRO.md',
    cover: 'assets/covers/jpn-pro-kit-v1.svg',
  },
];

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function fail(message) {
  throw new Error(`[editorial-print-staging] ${message}`);
}

const manifestPath = join(stagingRoot, 'manifest.json');
const manifestRaw = await readFile(manifestPath, 'utf8').catch(() => fail('manifest.json ausente; execute build:editorial-print antes deste gate.'));
const manifest = JSON.parse(manifestRaw);

if (manifest.status !== 'internal-print-staging') {
  fail(`status inesperado no manifesto: ${String(manifest.status)}`);
}
if (!Array.isArray(manifest.products) || manifest.products.length !== expected.length) {
  fail(`manifesto deve conter exatamente ${expected.length} produtos.`);
}

const digestParts = [];

for (let i = 0; i < expected.length; i += 1) {
  const spec = expected[i];
  const item = manifest.products[i];
  if (!item || item.id !== spec.id) fail(`ordem/id divergente na posição ${i + 1}: esperado ${spec.id}.`);
  for (const key of ['title', 'version', 'source', 'cover']) {
    if (item[key] !== spec[key]) fail(`${spec.id}: ${key} divergente do contrato canônico.`);
  }
  if (item.status !== 'print-html-generated-pdf-review-pending') {
    fail(`${spec.id}: status deve permanecer print-html-generated-pdf-review-pending.`);
  }

  const expectedOutput = `dist/editorial-print-staging/${spec.id}/index.html`;
  if (item.output !== expectedOutput) fail(`${spec.id}: output divergente.`);

  const [source, cover, html, outputStat] = await Promise.all([
    readFile(join(root, spec.source)),
    readFile(join(root, spec.cover)),
    readFile(join(root, expectedOutput), 'utf8'),
    stat(join(root, expectedOutput)),
  ]);

  if (!outputStat.isFile() || outputStat.size < 500) fail(`${spec.id}: HTML ausente ou pequeno demais para um candidato válido.`);
  if (!html.includes(`<title>${spec.title} ${spec.version} — staging editorial</title>`)) fail(`${spec.id}: title de staging ausente.`);
  if (!html.includes(spec.source)) fail(`${spec.id}: referência à fonte não aparece no HTML.`);
  if (!html.includes('staging interno para revisão')) fail(`${spec.id}: aviso de staging interno ausente.`);
  if (!html.includes('não representa PDF final aprovado nem autorização de publicação')) fail(`${spec.id}: guardrail de não publicação ausente.`);
  if (/comprar agora|finalizar compra|checkout|garantia de resultado/i.test(html)) fail(`${spec.id}: linguagem transacional/proibida detectada.`);

  const sourceHash = sha256(source);
  const coverHash = sha256(cover);
  const htmlHash = sha256(Buffer.from(html, 'utf8'));
  digestParts.push(`${spec.id}:${sourceHash}:${coverHash}:${htmlHash}`);
}

const indexHtml = await readFile(join(stagingRoot, 'index.html'), 'utf8');
for (const spec of expected) {
  if (!indexHtml.includes(`./${spec.id}/index.html`)) fail(`índice não referencia ${spec.id}.`);
  if (!indexHtml.includes(`${spec.title} ${spec.version}`)) fail(`índice não nomeia ${spec.title}.`);
}
if (!indexHtml.includes('Não é pacote publicado nem artefato final')) fail('índice perdeu o guardrail de staging interno.');

const sourceStateDigest = sha256(Buffer.from(digestParts.join('\n'), 'utf8'));
console.log(`Editorial print staging íntegro: ${expected.length} documentos; source_state_digest=${sourceStateDigest}`);
