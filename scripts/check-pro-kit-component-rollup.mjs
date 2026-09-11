import { readFileSync } from 'node:fs';

const statusPath = 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json';
const rollupPath = 'docs/products/pro-kit/COMPONENT_READINESS_ROLLUP_v1.json';

const releaseStatus = JSON.parse(readFileSync(statusPath, 'utf8'));
const rollup = JSON.parse(readFileSync(rollupPath, 'utf8'));

if (rollup.product !== 'JPN Pro Kit') {
  throw new Error(`Roll-up aponta para produto inesperado: ${rollup.product}`);
}
if (rollup.source_contract !== statusPath) {
  throw new Error(`Roll-up deve apontar para ${statusPath}`);
}
if (rollup.status !== 'component-readiness-rollup' || rollup.release_effect !== 'none') {
  throw new Error('Roll-up deve permanecer informativo, sem efeito de release.');
}

const excludedIds = new Set(['jpn-pro-kit']);
const canonicalComponents = releaseStatus.products.filter((product) => !excludedIds.has(product.id));
const canonicalIds = canonicalComponents.map((product) => product.id);
const rollupIds = rollup.components.map((product) => product.id);

if (new Set(rollupIds).size !== rollupIds.length) {
  throw new Error('Roll-up contém componentes duplicados.');
}
if (JSON.stringify(rollupIds) !== JSON.stringify(canonicalIds)) {
  throw new Error(`Ordem/conjunto de componentes diverge do contrato canônico. Esperado: ${canonicalIds.join(', ')}`);
}

let dependencyCount = 0;
let passed = 0;
let pending = 0;
let inProgress = 0;
let blocked = 0;
let notApplicable = 0;

for (const canonical of canonicalComponents) {
  const snapshot = rollup.components.find((component) => component.id === canonical.id);
  const canonicalDependencyIds = canonical.dependencies.map((dependency) => dependency.id);
  const snapshotDependencyIds = snapshot.dependencies.map((dependency) => dependency.id);

  if (new Set(snapshotDependencyIds).size !== snapshotDependencyIds.length) {
    throw new Error(`${canonical.id}: roll-up contém dependências duplicadas.`);
  }
  if (JSON.stringify(snapshotDependencyIds) !== JSON.stringify(canonicalDependencyIds)) {
    throw new Error(`${canonical.id}: dependências do roll-up divergentes do contrato canônico.`);
  }

  for (const canonicalDependency of canonical.dependencies) {
    const snapshotDependency = snapshot.dependencies.find((dependency) => dependency.id === canonicalDependency.id);
    if (snapshotDependency.status !== canonicalDependency.status) {
      throw new Error(`${canonical.id}/${canonicalDependency.id}: status divergente (${snapshotDependency.status} != ${canonicalDependency.status}).`);
    }

    dependencyCount += 1;
    switch (canonicalDependency.status) {
      case 'passed': passed += 1; break;
      case 'pending': pending += 1; break;
      case 'in-progress': inProgress += 1; break;
      case 'blocked': blocked += 1; break;
      case 'not-applicable': notApplicable += 1; break;
      default: throw new Error(`${canonical.id}/${canonicalDependency.id}: status não reconhecido: ${canonicalDependency.status}`);
    }
  }
}

const allComponentsReleaseReady = canonicalComponents.every((component) =>
  component.dependencies.every((dependency) => ['passed', 'not-applicable'].includes(dependency.status))
);

const expectedSummary = {
  component_count: canonicalComponents.length,
  dependency_count: dependencyCount,
  passed,
  in_progress: inProgress,
  pending,
  blocked,
  all_components_release_ready: allComponentsReleaseReady
};

for (const [key, expected] of Object.entries(expectedSummary)) {
  if (rollup.summary?.[key] !== expected) {
    throw new Error(`Resumo do roll-up divergente em ${key}: ${rollup.summary?.[key]} != ${expected}`);
  }
}

const proKit = releaseStatus.products.find((product) => product.id === 'jpn-pro-kit');
if (!proKit) {
  throw new Error('Contrato canônico não contém jpn-pro-kit.');
}

if (!allComponentsReleaseReady) {
  const prematurelyPassed = proKit.dependencies.filter((dependency) =>
    ['artefatos-congelados', 'hashes-finais'].includes(dependency.id) && dependency.status === 'passed'
  );
  if (prematurelyPassed.length) {
    throw new Error(`Pro Kit promoveu gate final antes dos componentes: ${prematurelyPassed.map((item) => item.id).join(', ')}`);
  }
}

const requiredGuardrailFragments = [
  'não aprova nenhuma dependência',
  'não pode ser considerado pronto',
  'não autoriza publicação',
  'Hashes finais continuam proibidos'
];
const guardrailText = (rollup.guardrails || []).join('\n');
for (const fragment of requiredGuardrailFragments) {
  if (!guardrailText.includes(fragment)) {
    throw new Error(`Roll-up sem guardrail obrigatório: ${fragment}`);
  }
}

console.log(`PASS: roll-up do Pro Kit alinhado ao contrato (${canonicalComponents.length} componentes, ${dependencyCount} dependências; ${passed} passed, ${inProgress} in-progress, ${pending} pending, ${blocked} blocked, ${notApplicable} not-applicable).`);
