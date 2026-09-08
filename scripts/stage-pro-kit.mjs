import { createHash } from 'node:crypto';
import { cp, mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const templatePath = path.join(root, 'docs/products/pro-kit/MANIFEST.template.json');
const checkOnly = process.argv.includes('--check');
const persistentOutDir = path.join(root, 'dist/pro-kit-staging');
const tempRoot = checkOnly ? await mkdtemp(path.join(os.tmpdir(), 'jpn-pro-kit-stage-')) : null;
const outDir = checkOnly ? path.join(tempRoot, 'pro-kit-staging') : persistentOutDir;

const sha256Buffer = (data) => createHash('sha256').update(data).digest('hex');
const sha256 = async (file) => sha256Buffer(await readFile(file));

const existsAsFile = async (file) => {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
};

const normalizeRelativePath = (value, label) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} deve ser um caminho relativo não vazio.`);
  }
  const normalized = path.posix.normalize(value.replaceAll('\\', '/'));
  if (path.posix.isAbsolute(normalized) || normalized === '..' || normalized.startsWith('../')) {
    throw new Error(`${label} inseguro: ${value}`);
  }
  return normalized;
};

const directlyStageable = (sourcePath, status) => {
  const ext = path.extname(sourcePath).toLowerCase();
  return ['.xlsx', '.json', '.txt'].includes(ext) && !status.startsWith('pending-final-artifact');
};

const canonicalDigest = (value) => sha256Buffer(Buffer.from(JSON.stringify(value)));

const templateBytes = await readFile(templatePath);
const template = JSON.parse(templateBytes.toString('utf8'));

if (!Array.isArray(template.files) || template.files.length === 0) {
  throw new Error('MANIFEST.template.json não contém arquivos de entrega.');
}

if (template.files.some((item) => item.sha256 !== null)) {
  throw new Error('O manifesto de staging deve continuar sem hashes finais preenchidos.');
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const report = {
  product: template.product,
  commercial_version: template.commercial_version,
  build_contract_version: 1,
  status: 'internal-staging-only',
  generated_at: new Date().toISOString(),
  template_sha256: sha256Buffer(templateBytes),
  release_ready: false,
  final_manifest: false,
  publication_authorized: false,
  files: [],
};

const deliveryPaths = new Set();

try {
  for (const item of template.files) {
    const deliveryPath = normalizeRelativePath(item.path, 'delivery_path');
    const sourceRelativePath = normalizeRelativePath(item.source, 'source');

    if (deliveryPaths.has(deliveryPath)) {
      throw new Error(`delivery_path duplicado no manifesto: ${deliveryPath}`);
    }
    deliveryPaths.add(deliveryPath);

    const sourcePath = path.join(root, sourceRelativePath);
    const sourcePresent = await existsAsFile(sourcePath);
    const record = {
      delivery_path: deliveryPath,
      source: sourceRelativePath,
      declared_status: item.status,
      source_present: sourcePresent,
      stageable: false,
      staged: false,
      source_sha256: null,
      staged_sha256: null,
      staged_bytes: 0,
      copy_verified: false,
    };

    if (sourcePresent) {
      record.source_sha256 = await sha256(sourcePath);
      record.stageable = directlyStageable(sourcePath, item.status);

      if (record.stageable) {
        const destination = path.join(outDir, deliveryPath);
        await mkdir(path.dirname(destination), { recursive: true });
        await cp(sourcePath, destination);
        record.staged = true;
        record.staged_sha256 = await sha256(destination);
        record.staged_bytes = (await stat(destination)).size;
        record.copy_verified = record.source_sha256 === record.staged_sha256;

        if (!record.copy_verified) {
          throw new Error(`Falha de integridade ao copiar ${sourceRelativePath} para ${deliveryPath}.`);
        }
      }
    }

    report.files.push(record);
  }

  const digestPayload = report.files
    .map((record) => ({
      delivery_path: record.delivery_path,
      source: record.source,
      declared_status: record.declared_status,
      source_present: record.source_present,
      source_sha256: record.source_sha256,
      stageable: record.stageable,
      staged: record.staged,
      staged_sha256: record.staged_sha256,
      staged_bytes: record.staged_bytes,
      copy_verified: record.copy_verified,
    }))
    .sort((a, b) => a.delivery_path.localeCompare(b.delivery_path));

  report.source_state_digest = canonicalDigest(digestPayload);
  report.summary = {
    total_manifest_items: report.files.length,
    sources_present: report.files.filter((f) => f.source_present).length,
    stageable_files: report.files.filter((f) => f.stageable).length,
    staged_files: report.files.filter((f) => f.staged).length,
    verified_copies: report.files.filter((f) => f.copy_verified).length,
    staged_bytes: report.files.reduce((total, f) => total + f.staged_bytes, 0),
    pending_final_artifacts: report.files.filter((f) => f.declared_status === 'pending-final-artifact').length,
    pending_release_decisions: report.files.filter((f) => f.declared_status === 'pending-release-decision').length,
  };

  const missingSources = report.files.filter((f) => !f.source_present);
  if (missingSources.length > 0) {
    throw new Error(`Há ${missingSources.length} fonte(s) declarada(s) ausente(s) no checkout atual.`);
  }

  if (report.summary.stageable_files !== report.summary.staged_files) {
    throw new Error('Nem todos os arquivos diretamente stageable foram copiados.');
  }

  if (report.summary.staged_files !== report.summary.verified_copies) {
    throw new Error('Nem todas as cópias staged passaram pela verificação SHA-256.');
  }

  await writeFile(
    path.join(outDir, 'STAGING_REPORT.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  );

  if (checkOnly) {
    console.log('Preflight do staging do JPN Pro Kit concluído com integridade de cópia verificada.');
  } else {
    console.log(`JPN Pro Kit staging criado em ${path.relative(root, outDir)}`);
  }
  console.log(JSON.stringify(report.summary, null, 2));
} finally {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
}
