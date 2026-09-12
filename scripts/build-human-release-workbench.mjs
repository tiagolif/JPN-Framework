import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PLAN_PATH = path.join(ROOT, 'docs/product-system/RELEASE_EXECUTION_PLAN_v1.json');
const STATUS_PATH = path.join(ROOT, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const OUT_DIR = path.join(ROOT, 'dist/release-human-workbench');
const OUT_MD = path.join(OUT_DIR, 'HUMAN_RELEASE_WORKBENCH.md');
const OUT_JSON = path.join(OUT_DIR, 'human-release-workbench.json');
const CHECK_ONLY = process.argv.includes('--check');

const terminalStatuses = new Set(['passed', 'not-applicable']);
const humanModes = new Set(['requires-human-inspection', 'requires-external-environment']);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function key(productId, dependencyId) {
  return `${productId}::${dependencyId}`;
}

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

const plan = readJson(PLAN_PATH);
const status = readJson(STATUS_PATH);

invariant(plan.publication_authorized === false, 'publication_authorized deve permanecer false.');
invariant(Array.isArray(plan.items) && plan.items.length > 0, 'Plano de execução sem itens.');
invariant(Array.isArray(status.products) && status.products.length > 0, 'Contrato de release sem produtos.');

const statusMap = new Map();
for (const product of status.products) {
  for (const dep of product.dependencies ?? []) {
    statusMap.set(key(product.id, dep.id), dep);
  }
}

const planKeys = new Set(plan.items.map((item) => key(item.product_id, item.dependency_id)));
for (const item of plan.items) {
  invariant(statusMap.has(key(item.product_id, item.dependency_id)), `Dependência ausente no contrato: ${key(item.product_id, item.dependency_id)}`);
  for (const blocker of item.blocked_by ?? []) {
    invariant(planKeys.has(blocker), `blocked_by aponta para item inexistente: ${blocker}`);
  }
}

function blockerState(blocker) {
  const dep = statusMap.get(blocker);
  invariant(dep, `Dependência bloqueadora ausente no contrato: ${blocker}`);
  return dep.status;
}

const rows = plan.items.map((item) => {
  const id = key(item.product_id, item.dependency_id);
  const dep = statusMap.get(id);
  const blockers = item.blocked_by ?? [];
  const blockersSatisfied = blockers.every((blocker) => terminalStatuses.has(blockerState(blocker)));
  const complete = terminalStatuses.has(dep.status);
  const runnableNow = !complete && blockersSatisfied;
  return {
    id,
    product_id: item.product_id,
    dependency_id: item.dependency_id,
    status: dep.status,
    priority: item.priority,
    execution_mode: item.execution_mode,
    blocked_by: blockers,
    runnable_now: runnableNow,
    can_run_without_new_authorization: item.can_run_without_new_authorization === true,
    next_action: item.next_action,
    completion_evidence: item.completion_evidence,
    current_evidence: dep.evidence ?? null,
    note: dep.note ?? null,
  };
});

const activeHuman = rows.filter((row) => row.runnable_now && row.can_run_without_new_authorization && humanModes.has(row.execution_mode));
const blocked = rows.filter((row) => !terminalStatuses.has(row.status) && !row.runnable_now);
const autonomous = rows.filter((row) => row.runnable_now && row.can_run_without_new_authorization && row.execution_mode === 'autonomous-local');

invariant(autonomous.length === 0, 'Existem ações autonomous-local executáveis; o workbench humano não deve ocultá-las.');
invariant(activeHuman.length > 0, 'Nenhum gate humano/externo executável encontrado.');
invariant(activeHuman.every((row) => row.blocked_by.length === 0 || row.blocked_by.every((b) => terminalStatuses.has(blockerState(b)))), 'Workbench contém item ainda bloqueado.');
invariant(activeHuman.every((row) => !terminalStatuses.has(row.status)), 'Workbench contém item já concluído.');

const payload = {
  version: '1.0.0',
  source_plan: 'docs/product-system/RELEASE_EXECUTION_PLAN_v1.json',
  source_status: 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json',
  generated_state: 'human-workbench-ready-no-release-promotion',
  publication_authorized: false,
  summary: {
    active_human_or_external_gates: activeHuman.length,
    blocked_gates: blocked.length,
    autonomous_local_runnable: autonomous.length,
  },
  active_gates: activeHuman,
  guardrails: [
    'O workbench apenas organiza gates já permitidos e executáveis; não aprova nenhum deles.',
    'Resultado humano, visual ou de compatibilidade exige evidência real produzida no ambiente indicado.',
    'Nenhum item autoriza publicação, anúncio, checkout, venda, gasto, uso de dados financeiros reais, criação de conta ou aceite legal.',
    'Qualquer alteração no artefato revisado invalida evidência vinculada ao artefato anterior.',
  ],
};

function renderMarkdown(data) {
  const grouped = new Map();
  for (const gate of data.active_gates) {
    if (!grouped.has(gate.product_id)) grouped.set(gate.product_id, []);
    grouped.get(gate.product_id).push(gate);
  }

  const lines = [
    '# JPN — Human Release Workbench',
    '',
    '> Pacote derivado automaticamente do contrato canônico. Ele organiza o trabalho humano/externo que pode ser executado agora, mas não promove nenhum status de release.',
    '',
    `- Gates humanos/externos executáveis agora: **${data.summary.active_human_or_external_gates}**`,
    `- Gates ainda bloqueados por pré-requisito: **${data.summary.blocked_gates}**`,
    `- Ações autônomas locais executáveis agora: **${data.summary.autonomous_local_runnable}**`,
    '- Publicação autorizada: **não**',
    '',
  ];

  for (const [productId, gates] of grouped) {
    lines.push(`## ${productId}`, '');
    for (const gate of gates) {
      lines.push(
        `### ${gate.dependency_id} · ${gate.priority}`,
        '',
        `**Estado atual:** ${gate.status}`,
        '',
        `**Modo:** ${gate.execution_mode}`,
        '',
        `**Próxima ação:** ${gate.next_action}`,
        '',
        `**Evidência mínima para concluir:** ${gate.completion_evidence}`,
        '',
        `**Evidência atual:** ${gate.current_evidence ?? 'nenhuma evidência de conclusão registrada'}`,
        '',
        `**Nota canônica:** ${gate.note ?? '—'}`,
        '',
        '- [ ] Executado no artefato/ambiente correto',
        '- [ ] Evidência anexada ou versionada',
        '- [ ] Resultado revisado sem inferência automática',
        '- [ ] Se o artefato mudou após a revisão, a evidência foi invalidada e refeita',
        '',
      );
    }
  }

  lines.push(
    '## Guardrails',
    '',
    ...data.guardrails.map((rule) => `- ${rule}`),
    '',
    '## Regra de atualização',
    '',
    'Este arquivo é regenerável. O estado de verdade continua sendo `PRODUCT_RELEASE_STATUS_v1.json`; este workbench não deve ser editado para promover gates.',
    '',
  );

  return lines.join('\n');
}

if (CHECK_ONLY) {
  console.log(`Human release workbench check: OK (${activeHuman.length} gates executáveis; ${blocked.length} bloqueados).`);
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(OUT_MD, renderMarkdown(payload));
console.log(`Workbench gerado em ${path.relative(ROOT, OUT_MD)} e ${path.relative(ROOT, OUT_JSON)}.`);
