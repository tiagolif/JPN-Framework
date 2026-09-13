import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const persistentOut = path.join(root, 'dist', 'prompt-builder-offline');
const site = path.join(root, 'product-site');
const browserBundle = path.join(root, 'dist', 'browser', 'index.js');
const promptBuilderDocs = path.join(root, 'docs', 'products', 'prompt-builder');
const accessInstructions = path.join(promptBuilderDocs, 'INSTRUCOES_DE_ACESSO.txt');
const quickStart = path.join(promptBuilderDocs, 'PROMPT_BUILDER_QUICK_START_v1.md');
const localRecovery = path.join(promptBuilderDocs, 'LOCAL_RECOVERY_v1.md');
const localWorkspaces = path.join(promptBuilderDocs, 'LOCAL_WORKSPACES_v1.md');
const workspaceManagement = path.join(promptBuilderDocs, 'WORKSPACE_MANAGEMENT_v1.md');
const sensitiveDataGuard = path.join(promptBuilderDocs, 'SENSITIVE_DATA_GUARD_v1.md');
const temporaryMode = path.join(promptBuilderDocs, 'TEMPORARY_MODE_v1.md');
const safeDataHandling = path.join(root, 'docs', 'product-system', 'SAFE_DATA_HANDLING_v1.md');
const checkOnly = process.argv.includes('--check');

const requiredSiteFiles = ['index.html', 'app.js', 'styles.css', 'README.md'];

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

async function inspectFile(filePath) {
  const data = await readFile(filePath);
  return { bytes: data.length, sha256: sha256(data) };
}

async function readUtf8(filePath) {
  return readFile(filePath, 'utf8');
}

function candidateHeader(title) {
  return `# ${title}\n\n> **CANDIDATO INTERNO — NÃO É RELEASE FINAL.** Este arquivo é gerado apenas para staging e revisão. A promoção para o pacote final continua bloqueada pelos gates canônicos do Prompt Builder.\n\n`;
}

function section(title, sourcePath, content) {
  return `## ${title}\n\n_Fonte interna: \`${sourcePath}\`_\n\n${content.trim()}\n\n`;
}

const tempRoot = checkOnly
  ? await mkdtemp(path.join(os.tmpdir(), 'jpn-prompt-builder-staging-'))
  : null;
const out = checkOnly ? path.join(tempRoot, 'prompt-builder-offline') : persistentOut;

try {
  await rm(out, { recursive: true, force: true });
  await mkdir(path.join(out, 'product-site'), { recursive: true });
  await mkdir(path.join(out, 'dist', 'browser'), { recursive: true });
  await mkdir(path.join(out, 'customer-docs-candidate'), { recursive: true });

  for (const file of requiredSiteFiles) {
    await readFile(path.join(site, file));
  }
  await readFile(browserBundle);

  const sourceDocs = [
    accessInstructions,
    quickStart,
    localRecovery,
    localWorkspaces,
    workspaceManagement,
    sensitiveDataGuard,
    temporaryMode,
    safeDataHandling,
  ];
  for (const file of sourceDocs) {
    await readFile(file);
  }

  await cp(site, path.join(out, 'product-site'), { recursive: true });
  await cp(browserBundle, path.join(out, 'dist', 'browser', 'index.js'));
  await cp(accessInstructions, path.join(out, 'INSTRUCOES_DE_ACESSO.txt'));

  const accessText = await readUtf8(accessInstructions);
  const quickStartText = await readUtf8(quickStart);
  const localRecoveryText = await readUtf8(localRecovery);
  const localWorkspacesText = await readUtf8(localWorkspaces);
  const workspaceManagementText = await readUtf8(workspaceManagement);
  const sensitiveDataGuardText = await readUtf8(sensitiveDataGuard);
  const temporaryModeText = await readUtf8(temporaryMode);
  const safeDataHandlingText = await readUtf8(safeDataHandling);

  const candidateDocs = [
    {
      path: 'customer-docs-candidate/LEIA-ME.md',
      content:
        candidateHeader('JPN Prompt Builder — Leia-me') +
        section('Acesso local', 'docs/products/prompt-builder/INSTRUCOES_DE_ACESSO.txt', accessText) +
        '## Próximo passo\n\nDepois de abrir o Builder por HTTP local, siga `GUIA_RAPIDO.md`. Não use este staging como evidência de release final.\n',
    },
    {
      path: 'customer-docs-candidate/GUIA_RAPIDO.md',
      content:
        candidateHeader('JPN Prompt Builder — Guia rápido') +
        section('Guia canônico', 'docs/products/prompt-builder/PROMPT_BUILDER_QUICK_START_v1.md', quickStartText),
    },
    {
      path: 'customer-docs-candidate/BACKUP_E_EXPORTACAO.md',
      content:
        candidateHeader('JPN Prompt Builder — Backup e exportação') +
        section('Recuperação local', 'docs/products/prompt-builder/LOCAL_RECOVERY_v1.md', localRecoveryText) +
        section('Workspaces locais', 'docs/products/prompt-builder/LOCAL_WORKSPACES_v1.md', localWorkspacesText) +
        section('Gestão de workspaces', 'docs/products/prompt-builder/WORKSPACE_MANAGEMENT_v1.md', workspaceManagementText),
    },
    {
      path: 'customer-docs-candidate/PRIVACIDADE_E_LIMITES.md',
      content:
        candidateHeader('JPN Prompt Builder — Privacidade e limites') +
        section('Dados sensíveis', 'docs/products/prompt-builder/SENSITIVE_DATA_GUARD_v1.md', sensitiveDataGuardText) +
        section('Modo temporário', 'docs/products/prompt-builder/TEMPORARY_MODE_v1.md', temporaryModeText) +
        section('Tratamento seguro de dados', 'docs/product-system/SAFE_DATA_HANDLING_v1.md', safeDataHandlingText),
    },
  ];

  for (const doc of candidateDocs) {
    await writeFile(path.join(out, doc.path), doc.content.endsWith('\n') ? doc.content : `${doc.content}\n`, 'utf8');
  }

  const trackedFiles = [
    { source: path.join(site, 'index.html'), delivery: 'product-site/index.html', mode: 'copied' },
    { source: path.join(site, 'app.js'), delivery: 'product-site/app.js', mode: 'copied' },
    { source: path.join(site, 'styles.css'), delivery: 'product-site/styles.css', mode: 'copied' },
    { source: path.join(site, 'README.md'), delivery: 'product-site/README.md', mode: 'copied' },
    { source: browserBundle, delivery: 'dist/browser/index.js', mode: 'copied' },
    { source: accessInstructions, delivery: 'INSTRUCOES_DE_ACESSO.txt', mode: 'copied' },
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
    distribution_projection: {
      status: 'candidate-only',
      target_release: 'JPN_Prompt_Builder_Offline.zip',
      candidate_directory: 'customer-docs-candidate',
      final_slot_names: ['LEIA-ME.md', 'GUIA_RAPIDO.md', 'BACKUP_E_EXPORTACAO.md', 'PRIVACIDADE_E_LIMITES.md'],
      promotion_requires: ['qa-fisico-contextual-celular', 'ci-final', 'pacote-offline-final'],
    },
    files: [],
    generated_candidate_docs: [],
  };

  for (const entry of trackedFiles) {
    const sourceState = await inspectFile(entry.source);
    const stagedState = await inspectFile(path.join(out, entry.delivery));

    if (sourceState.sha256 !== stagedState.sha256 || sourceState.bytes !== stagedState.bytes) {
      throw new Error(`Integridade divergente no staging: ${entry.delivery}`);
    }

    manifest.files.push({
      path: entry.delivery,
      mode: entry.mode,
      bytes: stagedState.bytes,
      sha256: stagedState.sha256,
      source_sha256: sourceState.sha256,
      source_matches_staged: true,
    });
  }

  for (const doc of candidateDocs) {
    const state = await inspectFile(path.join(out, doc.path));
    manifest.generated_candidate_docs.push({
      path: doc.path,
      bytes: state.bytes,
      sha256: state.sha256,
      final_slot_candidate: path.basename(doc.path),
      final_slot_materialized: false,
    });
  }

  const stateDigestInput = [
    ...manifest.files.map((file) => `${file.path}:${file.sha256}:${file.bytes}`),
    ...manifest.generated_candidate_docs.map((file) => `${file.path}:${file.sha256}:${file.bytes}`),
  ]
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
  console.log(`Arquivos copiados e verificados: ${manifest.files.length}`);
  console.log(`Documentos candidatos gerados: ${manifest.generated_candidate_docs.length}`);
  console.log(`Source state digest: ${manifest.source_state_digest}`);
} finally {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
}
