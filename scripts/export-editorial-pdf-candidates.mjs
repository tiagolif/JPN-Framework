import { createHash } from 'node:crypto';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = resolve(process.cwd());
const stagingRoot = join(root, 'dist', 'editorial-print-staging');
const outputRoot = join(root, 'dist', 'editorial-pdf-candidates');

const products = [
  { id: 'metodo-jpn', file: 'Metodo_JPN_v1.pdf' },
  { id: 'jpn-prompt-pack', file: 'JPN_Prompt_Pack_v1.pdf' },
  { id: 'jpn-business', file: 'JPN_Business_v1.pdf' },
  { id: 'gestao-facil-manual', file: 'JPN_Gestao_Facil_Manual_v0.1.pdf' },
  { id: 'pro-kit-leia-primeiro', file: 'JPN_Pro_Kit_Leia_Primeiro_v1.pdf' },
];

function commandExists(command) {
  const result = spawnSync(command, ['--version'], { encoding: 'utf8', timeout: 8000 });
  return !result.error && result.status === 0;
}

function commandVersion(command) {
  const result = spawnSync(command, ['--version'], { encoding: 'utf8', timeout: 8000 });
  return `${result.stdout || result.stderr || ''}`.trim().split('\n')[0] || command;
}

function detectEngine() {
  const requested = process.env.JPN_PDF_ENGINE?.trim();
  if (requested) {
    if (!commandExists(requested)) throw new Error(`JPN_PDF_ENGINE=${requested} não está disponível.`);
    return { kind: requested.includes('weasyprint') ? 'weasyprint' : 'chromium', command: requested };
  }

  if (commandExists('weasyprint')) return { kind: 'weasyprint', command: 'weasyprint' };

  for (const command of ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable']) {
    if (commandExists(command)) return { kind: 'chromium', command };
  }

  throw new Error(
    'Nenhum motor de PDF encontrado. Instale WeasyPrint ou disponibilize Chromium/Chrome e, se necessário, defina JPN_PDF_ENGINE.',
  );
}

function runOrThrow(command, args, timeout = 90000) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    timeout,
    env: { ...process.env },
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      [`Falha ao executar ${command}.`, result.stdout, result.stderr].filter(Boolean).join('\n'),
    );
  }

  return result;
}

async function ensureStaging() {
  const manifest = join(stagingRoot, 'manifest.json');
  try {
    await access(manifest, constants.R_OK);
  } catch {
    runOrThrow(process.execPath, ['scripts/build-editorial-print-staging.mjs']);
  }
}

function exportWithWeasyPrint(command, htmlPath, pdfPath) {
  runOrThrow(command, [htmlPath, pdfPath]);
}

function exportWithChromium(command, htmlPath, pdfPath) {
  const fileUrl = pathToFileURL(htmlPath).href;
  runOrThrow(command, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    fileUrl,
  ], 60000);
}

async function inspectPdf(pdfPath) {
  const bytes = await readFile(pdfPath);
  if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error(`${basename(pdfPath)} não possui assinatura PDF válida.`);
  }

  const fileStat = await stat(pdfPath);
  if (fileStat.size < 4096) {
    throw new Error(`${basename(pdfPath)} parece pequeno demais (${fileStat.size} bytes).`);
  }

  let pages = null;
  let pageSize = null;
  if (commandExists('pdfinfo')) {
    const info = runOrThrow('pdfinfo', [pdfPath], 15000).stdout;
    pages = Number(info.match(/^Pages:\s+(\d+)/m)?.[1] || '') || null;
    pageSize = info.match(/^Page size:\s+(.+)$/m)?.[1]?.trim() || null;
  }

  return {
    bytes: fileStat.size,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    pages,
    pageSize,
  };
}

await ensureStaging();
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const engine = detectEngine();
const engineVersion = commandVersion(engine.command);
const stagingManifest = JSON.parse(await readFile(join(stagingRoot, 'manifest.json'), 'utf8'));
const sourceById = new Map(stagingManifest.products.map((item) => [item.id, item]));
const exported = [];

for (const product of products) {
  const source = sourceById.get(product.id);
  if (!source) throw new Error(`Documento ${product.id} ausente do manifest de staging.`);

  const htmlPath = join(root, source.output);
  const pdfPath = join(outputRoot, product.file);
  await access(htmlPath, constants.R_OK);

  if (engine.kind === 'weasyprint') exportWithWeasyPrint(engine.command, htmlPath, pdfPath);
  else exportWithChromium(engine.command, htmlPath, pdfPath);

  const inspection = await inspectPdf(pdfPath);
  exported.push({
    id: product.id,
    sourceHtml: source.output,
    output: `dist/editorial-pdf-candidates/${product.file}`,
    ...inspection,
    status: 'pdf-candidate-generated-visual-review-pending',
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  status: 'internal-pdf-candidates-visual-review-pending',
  engine: { kind: engine.kind, command: engine.command, version: engineVersion },
  rules: [
    'Estes PDFs são candidatos internos, não artefatos finais publicados.',
    'Hash de candidato não deve ser copiado para o manifesto final antes da revisão visual e do congelamento.',
    'Cada PDF precisa ser renderizado e inspecionado página a página antes da promoção de estado.',
  ],
  products: exported,
};

await writeFile(
  join(outputRoot, 'CANDIDATE_MANIFEST.json'),
  JSON.stringify(manifest, null, 2) + '\n',
  'utf8',
);

console.log(`PDFs editoriais candidatos gerados: ${exported.length} em ${outputRoot}`);
console.log(`Motor: ${engineVersion}`);
for (const item of exported) {
  console.log(`- ${item.output} | ${item.bytes} bytes | sha256 ${item.sha256} | páginas ${item.pages ?? 'n/d'}`);
}
