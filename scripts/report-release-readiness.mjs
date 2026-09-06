import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const gatesPath = path.join(root, 'docs/products/pro-kit/RELEASE_GATES.json');
const manifestPath = path.join(root, 'docs/products/pro-kit/MANIFEST.template.json');
const outDir = path.join(root, 'dist/release-readiness');

const exists = async (relativePath) => {
  if (!relativePath) return false;
  try {
    return (await stat(path.join(root, relativePath))).isFile();
  } catch {
    return false;
  }
};

const gates = JSON.parse(await readFile(gatesPath, 'utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const artifactStatusCounts = manifest.files.reduce((acc, file) => {
  acc[file.status] = (acc[file.status] ?? 0) + 1;
  return acc;
}, {});

const gateRecords = [];
for (const gate of gates.gates) {
  const evidencePresent = await exists(gate.evidence);
  gateRecords.push({ ...gate, evidence_present: evidencePresent });
}

const blocking = gateRecords.filter((gate) => gate.blocking);
const passed = blocking.filter((gate) => gate.status === 'passed');
const open = blocking.filter((gate) => gate.status !== 'passed');
const missingEvidence = gateRecords.filter((gate) => gate.evidence && !gate.evidence_present);

const report = {
  product: gates.product,
  version: gates.version,
  status: open.length === 0 ? 'ready-for-final-freeze-review' : 'not-ready-for-release',
  generated_at: new Date().toISOString(),
  summary: {
    blocking_gates_total: blocking.length,
    blocking_gates_passed: passed.length,
    blocking_gates_open: open.length,
    evidence_missing: missingEvidence.length,
    manifest_items_total: manifest.files.length,
    manifest_status_counts: artifactStatusCounts,
  },
  open_blockers: open.map(({ id, label, status, evidence, evidence_present }) => ({
    id,
    label,
    status,
    evidence,
    evidence_present,
  })),
  gates: gateRecords,
  guardrails: gates.guardrails,
};

await mkdir(outDir, { recursive: true });
await writeFile(
  path.join(outDir, 'RELEASE_READINESS.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

const lines = [
  '# JPN Pro Kit — Release readiness',
  '',
  `Status: **${report.status}**`,
  '',
  `Gates bloqueantes: ${passed.length}/${blocking.length} concluídos.`,
  `Bloqueios abertos: ${open.length}.`,
  `Evidências ausentes: ${missingEvidence.length}.`,
  '',
  '## Bloqueios abertos',
  '',
  ...(open.length
    ? open.map((gate) => `- ${gate.id}: ${gate.label} — \`${gate.status}\``)
    : ['- Nenhum.']),
  '',
  '## Estado dos artefatos do manifesto',
  '',
  ...Object.entries(artifactStatusCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([status, count]) => `- ${status}: ${count}`),
  '',
  '## Guardrails',
  '',
  ...gates.guardrails.map((item) => `- ${item}`),
  '',
  '> Relatório gerado localmente. Não é autorização de publicação nem manifesto final.',
  '',
];

await writeFile(path.join(outDir, 'RELEASE_READINESS.md'), lines.join('\n'), 'utf8');

console.log(`Release readiness: ${report.status}`);
console.log(`${passed.length}/${blocking.length} gates bloqueantes concluídos; ${open.length} abertos.`);

if (missingEvidence.length > 0) {
  console.error('Há gates com evidência declarada ausente no checkout atual:');
  for (const gate of missingEvidence) console.error(`- ${gate.id}: ${gate.evidence}`);
  process.exitCode = 1;
}
