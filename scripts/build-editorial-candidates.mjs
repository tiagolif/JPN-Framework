import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const contractPath = path.join(root, 'docs/product-system/EDITORIAL_COMPOSITION_CANDIDATES_v1.json');
const contract = JSON.parse(await readFile(contractPath, 'utf8'));
const outputRoot = path.join(root, contract.output_root);

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const generatedAt = new Date().toISOString();
const manifest = {
  version: contract.version,
  purpose: 'Manifesto técnico de candidatos editoriais gerados para revisão humana.',
  publication_authorized: false,
  release_ready: false,
  generated_at: generatedAt,
  candidates: [],
};

await mkdir(outputRoot, { recursive: true });

for (const product of contract.products ?? []) {
  const sections = [];
  const sourceFiles = [];
  const sourceSha256 = {};

  sections.push(`# ${product.title} — candidato editorial interno`);
  sections.push('');
  sections.push(`> **${contract.candidate_header.status}**`);
  for (const notice of contract.candidate_header.required_notices ?? []) sections.push(`> - ${notice}`);
  sections.push('');
  sections.push('## Proveniência da composição');
  sections.push('');

  for (const source of product.sources ?? []) {
    const absolute = path.join(root, source);
    const content = await readFile(absolute, 'utf8');
    sourceFiles.push(source);
    sourceSha256[source] = sha256(content);
    sections.push(`- \`${source}\` — SHA-256 \`${sourceSha256[source]}\``);
  }

  sections.push('');
  sections.push('---');
  sections.push('');

  for (const source of product.sources ?? []) {
    const content = await readFile(path.join(root, source), 'utf8');
    sections.push(`<!-- BEGIN SOURCE: ${source} -->`);
    sections.push(content.trimEnd());
    sections.push(`<!-- END SOURCE: ${source} -->`);
    sections.push('');
    sections.push('---');
    sections.push('');
  }

  sections.push('## Estado deste candidato');
  sections.push('');
  sections.push('- `release_ready: false`');
  sections.push(`- artefato final bloqueado: \`${product.blocked_final_artifact}\``);
  sections.push('- revisão editorial humana: pendente');
  sections.push('- QA visual / revisão página a página: pendentes quando aplicáveis');
  sections.push('- publicação/distribuição como release: não autorizada');
  sections.push('');

  const candidate = `${sections.join('\n').trimEnd()}\n`;
  const outputPath = path.join(outputRoot, product.output_file);
  await writeFile(outputPath, candidate, 'utf8');

  manifest.candidates.push({
    product_id: product.product_id,
    output_file: path.posix.join(contract.output_root, product.output_file),
    generated_at: generatedAt,
    source_files: sourceFiles,
    source_sha256: sourceSha256,
    candidate_sha256: sha256(candidate),
    release_ready: false,
  });
}

await writeFile(path.join(outputRoot, 'EDITORIAL_CANDIDATES_MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Candidatos editoriais gerados: ${manifest.candidates.length} em ${contract.output_root}.`);
