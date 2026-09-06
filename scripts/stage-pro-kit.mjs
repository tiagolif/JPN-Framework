import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const templatePath = path.join(root, 'docs/products/pro-kit/MANIFEST.template.json');
const outDir = path.join(root, 'dist/pro-kit-staging');

const sha256 = async (file) => {
  const data = await readFile(file);
  return createHash('sha256').update(data).digest('hex');
};

const existsAsFile = async (file) => {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
};

const template = JSON.parse(await readFile(templatePath, 'utf8'));
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const report = {
  product: template.product,
  commercial_version: template.commercial_version,
  status: 'internal-staging-only',
  generated_at: new Date().toISOString(),
  files: [],
};

for (const item of template.files) {
  const sourcePath = path.join(root, item.source);
  const sourcePresent = await existsAsFile(sourcePath);
  const record = {
    delivery_path: item.path,
    source: item.source,
    declared_status: item.status,
    source_present: sourcePresent,
    staged: false,
    source_sha256: null,
  };

  if (sourcePresent) {
    record.source_sha256 = await sha256(sourcePath);

    // Only stage a file when the source itself is already a distributable binary/data file.
    // Markdown sources remain evidence only until a reviewed final PDF exists.
    const ext = path.extname(sourcePath).toLowerCase();
    const directlyStageable = ['.xlsx', '.json', '.txt'].includes(ext) && !item.status.startsWith('pending-final-artifact');

    if (directlyStageable) {
      const destination = path.join(outDir, item.path);
      await mkdir(path.dirname(destination), { recursive: true });
      await cp(sourcePath, destination);
      record.staged = true;
      record.staged_sha256 = await sha256(destination);
    }
  }

  report.files.push(record);
}

report.summary = {
  total_manifest_items: report.files.length,
  sources_present: report.files.filter((f) => f.source_present).length,
  staged_files: report.files.filter((f) => f.staged).length,
  pending_final_artifacts: report.files.filter((f) => f.declared_status === 'pending-final-artifact').length,
  pending_release_decisions: report.files.filter((f) => f.declared_status === 'pending-release-decision').length,
};

await writeFile(
  path.join(outDir, 'STAGING_REPORT.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

console.log(`JPN Pro Kit staging criado em ${path.relative(root, outDir)}`);
console.log(JSON.stringify(report.summary, null, 2));

if (report.files.some((f) => f.source && !f.source_present && !f.source.endsWith('/'))) {
  console.error('Há fontes de arquivo declaradas no manifesto que não existem no checkout atual.');
  process.exitCode = 1;
}
