import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const persistentOut = path.join(root, 'dist', 'prompt-builder-offline');
const site = path.join(root, 'product-site');
const browserBundle = path.join(root, 'dist', 'browser', 'index.js');
const accessInstructions = path.join(root, 'docs', 'products', 'prompt-builder', 'INSTRUCOES_DE_ACESSO.txt');
const checkOnly = process.argv.includes('--check');

const requiredSiteFiles = ['index.html', 'app.js', 'styles.css', 'README.md'];

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

async function inspectFile(filePath) {
  const data = await readFile(filePath);
  return { bytes: data.length, sha256: sha256(data) };
}

const tempRoot = checkOnly
  ? await mkdtemp(path.join(os.tmpdir(), 'jpn-prompt-builder-staging-'))
  : null;
const out = checkOnly ? path.join(tempRoot, 'prompt-builder-offline') : persistentOut;

try {
  await rm(out, { recursive: true, force: true });
  await mkdir(path.join(out, 'product-site'), { recursive: true });
  await mkdir(path.join(out, 'dist', 'browser'), { recursive: true });

  for (const file of requiredSiteFiles) {
    await readFile(path.join(site, file));
  }
  await readFile(browserBundle);
  await readFile(accessInstructions);

  await cp(site, path.join(out, 'product-site'), { recursive: true });
  await cp(browserBundle, path.join(out, 'dist', 'browser', 'index.js'));
  await cp(accessInstructions, path.join(out, 'INSTRUCOES_DE_ACESSO.txt'));

  const trackedFiles = [
    { source: path.join(site, 'index.html'), delivery: 'product-site/index.html' },
    { source: path.join(site, 'app.js'), delivery: 'product-site/app.js' },
    { source: path.join(site, 'styles.css'), delivery: 'product-site/styles.css' },
    { source: path.join(site, 'README.md'), delivery: 'product-site/README.md' },
    { source: browserBundle, delivery: 'dist/browser/index.js' },
    { source: accessInstructions, delivery: 'INSTRUCOES_DE_ACESSO.txt' },
  ];

  const manifest = {
    product: 'JPN Prompt Builder',
    delivery_mode: 'offline-local-http',
    status: 'internal-staging',
    release_ready: false,
    final_bundle: false,
    publication_authorized: false,
    public_url: null,
    requires_external_account: false,
    generated_in_check_mode: checkOnly,
    files: [],
  };

  for (const entry of trackedFiles) {
    const sourceState = await inspectFile(entry.source);
    const stagedState = await inspectFile(path.join(out, entry.delivery));

    if (sourceState.sha256 !== stagedState.sha256 || sourceState.bytes !== stagedState.bytes) {
      throw new Error(`Integridade divergente no staging: ${entry.delivery}`);
    }

    manifest.files.push({
      path: entry.delivery,
      bytes: stagedState.bytes,
      sha256: stagedState.sha256,
      source_sha256: sourceState.sha256,
      source_matches_staged: true,
    });
  }

  const stateDigestInput = manifest.files
    .map((file) => `${file.path}:${file.sha256}:${file.bytes}`)
    .sort()
    .join('\n');
  manifest.source_state_digest = sha256(Buffer.from(stateDigestInput, 'utf8'));

  await writeFile(
    path.join(out, 'STAGING_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  if (checkOnly) {
    console.log('Prompt Builder offline staging preflight aprovado em diretório temporário.');
  } else {
    console.log(`Prompt Builder offline staging criado em ${path.relative(root, out)}`);
  }
  console.log(`Arquivos rastreados e verificados: ${manifest.files.length}`);
  console.log(`Source state digest: ${manifest.source_state_digest}`);
} finally {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
}
