import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const matrixPath = path.join(root, 'docs/products/pro-kit/READINESS_MATRIX_v1.md');
const gatesPath = path.join(root, 'docs/products/pro-kit/RELEASE_GATES.json');

const matrix = fs.readFileSync(matrixPath, 'utf8');
const gates = JSON.parse(fs.readFileSync(gatesPath, 'utf8'));

const fail = (message) => {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
};

const requireText = (text, label) => {
  if (!matrix.includes(text)) fail(`Matriz sem ${label}: ${text}`);
};

requireText('# JPN Pro Kit v1 — Matriz Operacional de Prontidão', 'título canônico');
requireText('candidate companion / release QA pending', 'estado candidato explícito');
requireText('RELEASE_GATES.json', 'referência à fonte canônica de gates');
requireText('não constitui autorização para publicar', 'guardrail de publicação');
requireText('teste em aparelho móvel real', 'QA humano do Prompt Builder');
requireText('GF-QA-10', 'compatibilidade cruzada da Gestão Fácil');
requireText('inspeção visual página a página', 'QA visual humano');
requireText('SHA-256', 'freeze e integridade');
requireText('CI estiver verde no mesmo head', 'CI do head final');
requireText('Regra de parada', 'regra de parada');

const pendingBlocking = gates.gates.filter((gate) => gate.blocking && gate.status !== 'passed');
for (const gate of pendingBlocking) {
  requireText(`\`${gate.id}\``, `gate bloqueador pendente ${gate.id}`);
}

const passedPromptBuilder = gates.gates.find((gate) => gate.id === 'prompt-builder-release-decision');
if (!passedPromptBuilder || passedPromptBuilder.status !== 'passed') {
  fail('RELEASE_GATES.json não preserva prompt-builder-release-decision como passed.');
}
requireText('não comprova QA móvel final nem freeze do bundle', 'limite do gate do Prompt Builder');

const forbiddenClaims = [
  'todos os gates estão aprovados',
  'release autorizado',
  'publicação autorizada',
  'GF-QA-10 aprovado',
  'QA móvel aprovado',
  'PDFs finais aprovados'
];
for (const claim of forbiddenClaims) {
  if (matrix.toLowerCase().includes(claim.toLowerCase())) {
    fail(`Matriz contém promoção indevida de estado: ${claim}`);
  }
}

if (!process.exitCode) {
  console.log(`✅ Matriz do Pro Kit validada: ${pendingBlocking.length} gates bloqueadores pendentes preservados.`);
}
