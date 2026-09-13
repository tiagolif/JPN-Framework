import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const workflowPath = path.join(root, '.github/workflows/ci.yml');
const docPath = path.join(root, 'docs/product-system/STACKED_PR_CI_v1.md');
const packagePath = path.join(root, 'package.json');
const workflow = await readFile(workflowPath, 'utf8');
const doc = await readFile(docPath, 'utf8');
const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
const errors = [];

const requireText = (text, fragment, label) => {
  if (!text.includes(fragment)) errors.push(`${label}: trecho obrigatório ausente: ${fragment}`);
};
const requirePattern = (text, pattern, label, description) => {
  if (!pattern.test(text)) errors.push(`${label}: trecho obrigatório ausente: ${description}`);
};

requireText(workflow, 'pull_request:', 'workflow');
requireText(workflow, 'branches: [main]', 'workflow');
requireText(workflow, 'permissions:\n  contents: read', 'workflow');
requireText(workflow, 'cancel-in-progress: true', 'workflow');
requireText(workflow, 'node-version: 22', 'workflow');
requireText(workflow, "python-version: '3.12'", 'workflow');
requireText(workflow, 'npm run typecheck', 'workflow');
requireText(workflow, 'npm test', 'workflow');
requireText(workflow, 'npx tsc -p tsconfig.json', 'workflow');
requireText(workflow, 'git diff --exit-code', 'workflow');

for (const phase of [
  'Compile SDK and browser bundle',
  'Prompt Builder gates',
  'Core - product consistency',
  'Core - Metodo cross-product',
  'Core - Business links',
  'Core - Prompt Pack QA',
  'Core - Prompt Pack selection workbook',
  'Core - Business print candidate',
  'Core - editorial hygiene',
  'Core - terminology',
  'Core - product portfolio',
  'Core - deliverable catalog',
  'Core - product release status',
  'Release and Pro Kit gates',
  'Visual and editorial gates',
  'Commercial gates',
  'Gestão Fácil gates',
  'Generated review artifacts',
]) {
  requireText(workflow, `- name: ${phase}`, 'workflow');
}

const buildScript = packageJson?.scripts?.build ?? '';
const buildRunCommands = [...buildScript.matchAll(/npm run ([\w:-]+)/g)].map((match) => `npm run ${match[1]}`);
if (buildRunCommands.length === 0) {
  errors.push('package.json: script build sem comandos npm run detectáveis.');
}
for (const command of buildRunCommands) {
  requireText(workflow, command, 'workflow coverage');
}

const pullRequestBlock = workflow.match(/\n  pull_request:\s*\n([\s\S]*?)(?=\n[a-zA-Z][^\n]*:|\npermissions:)/)?.[1] ?? '';
if (/branches\s*:/.test(pullRequestBlock)) {
  errors.push('workflow: pull_request não pode limitar branches; PRs empilhados precisam de cobertura.');
}

const pushBlock = workflow.match(/\n  push:\s*\n([\s\S]*?)(?=\n  pull_request:)/)?.[1] ?? '';
if (!/branches:\s*\[main\]/.test(pushBlock)) {
  errors.push('workflow: push deve continuar restrito ao branch main.');
}

for (const forbidden of ['workflow_dispatch:', 'schedule:', 'deployment:', 'pages:', 'id-token: write', 'contents: write']) {
  if (workflow.includes(forbidden)) errors.push(`workflow: configuração fora do escopo detectada: ${forbidden}`);
}

requirePattern(doc, /\*{0,2}não\*{0,2}\s+substitui/i, 'documentação', 'não substitui');
for (const fragment of [
  'QA físico/contextual',
  'Excel, LibreOffice Calc e Google Sheets',
  'evidência de desenvolvimento',
  'não publica site, anúncio ou artefato comercial',
]) {
  requireText(doc, fragment, 'documentação');
}

if (errors.length > 0) {
  console.error('Stacked PR CI check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Stacked PR CI check OK: ${buildRunCommands.length} comandos do build cobertos em fases diagnosticáveis, sem promover gates humanos, externos ou de release.`);
