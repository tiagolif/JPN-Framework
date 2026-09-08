import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';

const WORKBOOK_PATH = 'deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx';
const QA_EVIDENCE_PATH = 'docs/products/gestao-facil/QA_EXECUTION_v0.1.md';
const EXPECTED_SHA256 = '46b6fff3b366b2ac3467f443643c12e6aa8ba9958b8b54e0797ec91176c9dded';
const MIN_BYTES = 1024;

function fail(message) {
  console.error(`Gestão Fácil binary integrity: FAIL — ${message}`);
  process.exitCode = 1;
}

const workbook = await readFile(WORKBOOK_PATH);
const metadata = await stat(WORKBOOK_PATH);
const qaEvidence = await readFile(QA_EVIDENCE_PATH, 'utf8');
const actualSha256 = createHash('sha256').update(workbook).digest('hex');

if (metadata.size < MIN_BYTES) {
  fail(`arquivo inesperadamente pequeno (${metadata.size} bytes)`);
}

if (workbook[0] !== 0x50 || workbook[1] !== 0x4b) {
  fail('assinatura ZIP/OOXML ausente; o arquivo não começa com PK');
}

if (actualSha256 !== EXPECTED_SHA256) {
  fail(`SHA-256 divergente. esperado=${EXPECTED_SHA256} atual=${actualSha256}`);
}

const evidenceHashMatch = qaEvidence.match(/SHA-256 local do binário testado:\s*`([a-f0-9]{64})`/i);
if (!evidenceHashMatch) {
  fail('QA_EXECUTION não registra SHA-256 do binário testado');
} else if (evidenceHashMatch[1].toLowerCase() !== EXPECTED_SHA256) {
  fail(`QA_EXECUTION referencia outro binário (${evidenceHashMatch[1]})`);
}

for (const id of ['GF-QA-01', 'GF-QA-02', 'GF-QA-03', 'GF-QA-04', 'GF-QA-05', 'GF-QA-06', 'GF-QA-07', 'GF-QA-08', 'GF-QA-09']) {
  const row = qaEvidence.match(new RegExp(`\\| ${id} \\| ([^|]+) \\|`, 'i'));
  if (!row || !row[1].trim().startsWith('PASS')) {
    fail(`${id} não está registrado como PASS em QA_EXECUTION`);
  }
}

const qa10 = qaEvidence.match(/\| GF-QA-10 \| ([^|]+) \|/i);
if (!qa10 || qa10[1].trim() !== 'PENDENTE') {
  fail('GF-QA-10 deve continuar explicitamente PENDENTE até compatibilidade cruzada real');
}

if (process.exitCode) process.exit(process.exitCode);

console.log('Gestão Fácil binary integrity: PASS');
console.log(`artifact=${WORKBOOK_PATH}`);
console.log(`bytes=${metadata.size}`);
console.log(`sha256=${actualSha256}`);
console.log('qa_local=GF-QA-01..09 PASS');
console.log('qa_cross_app=GF-QA-10 PENDENTE');
