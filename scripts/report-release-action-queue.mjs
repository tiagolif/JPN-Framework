import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const portfolioPath = resolve(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const statusPath = resolve(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const planPath = resolve(root, 'docs/product-system/RELEASE_EXECUTION_PLAN_v1.json');
const outputPath = resolve(root, 'reports/product-readiness/RELEASE_ACTION_QUEUE.md');

const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const releaseStatus = JSON.parse(await readFile(statusPath, 'utf8'));
const plan = JSON.parse(await readFile(planPath, 'utf8'));

const productName = new Map(portfolio.products.map((product) => [product.id, product.canonical_name]));
const productOrder = new Map(portfolio.products.map((product, index) => [product.id, index]));
const dependencyStatus = new Map();
const dependencyOrder = new Map();

for (const product of releaseStatus.products) {
  product.dependencies.forEach((dependency, index) => {
    const key = `${product.id}::${dependency.id}`;
    dependencyStatus.set(key, dependency);
    dependencyOrder.set(key, index);
  });
}

const priorityRank = new Map([['P0', 0], ['P1', 1], ['P2', 2], ['P3', 3]]);
const statusRank = new Map([['in-progress', 0], ['pending', 1], ['blocked', 2], ['passed', 3], ['not-applicable', 4]]);
const modeLabels = {
  'autonomous-local': 'Autônoma local',
  'requires-human-inspection': 'Inspeção humana',
  'requires-external-environment': 'Ambiente externo',
  'requires-ci': 'CI',
  'requires-explicit-authorization': 'Autorização explícita',
};
const statusLabels = {
  pending: 'Pendente',
  'in-progress': 'Em andamento',
  passed: 'Aprovado',
  blocked: 'Bloqueado',
  'not-applicable': 'Não aplicável',
};
const isSatisfied = (status) => ['passed', 'not-applicable'].includes(status);

const rows = plan.items.map((item) => {
  const key = `${item.product_id}::${item.dependency_id}`;
  const status = dependencyStatus.get(key);
  if (!status) throw new Error(`Item do plano sem dependência correspondente: ${key}`);
  if (!productName.has(item.product_id)) throw new Error(`Produto desconhecido no plano: ${item.product_id}`);
  const blockedBy = item.blocked_by || [];
  const unsatisfiedPrerequisites = blockedBy.filter((prerequisite) => {
    const dependency = dependencyStatus.get(prerequisite);
    if (!dependency) throw new Error(`Pré-requisito desconhecido: ${prerequisite}`);
    return !isSatisfied(dependency.status);
  });
  return {
    ...item,
    status: status.status,
    evidence: status.evidence,
    key,
    unsatisfiedPrerequisites,
    runnableNow: !isSatisfied(status.status) && unsatisfiedPrerequisites.length === 0,
  };
});

rows.sort((a, b) =>
  Number(b.runnableNow) - Number(a.runnableNow)
  || (priorityRank.get(a.priority) ?? 99) - (priorityRank.get(b.priority) ?? 99)
  || (statusRank.get(a.status) ?? 99) - (statusRank.get(b.status) ?? 99)
  || (productOrder.get(a.product_id) ?? 99) - (productOrder.get(b.product_id) ?? 99)
  || (dependencyOrder.get(a.key) ?? 99) - (dependencyOrder.get(b.key) ?? 99),
);

const active = rows.filter((item) => !isSatisfied(item.status));
const runnable = active.filter((item) => item.runnableNow);
const blockedByPrerequisite = active.filter((item) => !item.runnableNow);
const noNewAuthorization = runnable.filter((item) => item.can_run_without_new_authorization);
const autonomousLocal = runnable.filter((item) => item.execution_mode === 'autonomous-local');
const modeCounts = Object.fromEntries(plan.allowed_execution_modes.map((mode) => [mode, 0]));
for (const item of runnable) modeCounts[item.execution_mode] += 1;

const tableRows = active.map((item, index) => {
  const evidence = item.evidence ? `\`${item.evidence}\`` : 'Ainda não registrada';
  const blockers = item.unsatisfiedPrerequisites.length
    ? item.unsatisfiedPrerequisites.map((dependency) => `\`${dependency}\``).join(', ')
    : '—';
  return `| ${index + 1} | ${item.priority} | ${productName.get(item.product_id)} | \`${item.dependency_id}\` | ${statusLabels[item.status] ?? item.status} | ${modeLabels[item.execution_mode] ?? item.execution_mode} | ${item.runnableNow ? 'Sim' : 'Não'} | ${blockers} | ${item.next_action} | ${evidence} |`;
});

const autonomousRows = autonomousLocal.length
  ? autonomousLocal.map((item) => `- **${productName.get(item.product_id)} / ${item.dependency_id}** — ${item.next_action}`)
  : ['- Nenhuma ação autônoma local está executável neste momento.'];

const report = `# JPN — Fila priorizada de ações de release\n\n> Relatório derivado mecanicamente de \`PRODUCT_PORTFOLIO_v1.json\`, \`PRODUCT_RELEASE_STATUS_v1.json\` e \`RELEASE_EXECUTION_PLAN_v1.json\`. Ele organiza trabalho; não aprova release, venda, anúncio ou publicação.\n\n## Resumo operacional\n\n- Itens ativos: **${active.length}**\n- Itens executáveis agora: **${runnable.length}**\n- Itens bloqueados por pré-requisito: **${blockedByPrerequisite.length}**\n- Itens executáveis sem nova autorização: **${noNewAuthorization.length}**\n- Ações autônomas locais executáveis: **${autonomousLocal.length}**\n- Inspeções humanas executáveis: **${modeCounts['requires-human-inspection']}**\n- Ações executáveis que exigem ambiente externo: **${modeCounts['requires-external-environment']}**\n- Ações executáveis que exigem CI real: **${modeCounts['requires-ci']}**\n- Ações executáveis que exigem autorização explícita: **${modeCounts['requires-explicit-authorization']}**\n\n## Próximas ações, em ordem\n\n| # | Prioridade | Produto | Dependência | Estado | Modo | Executável agora | Bloqueada por | Próxima ação | Evidência atual |\n| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${tableRows.join('\n')}\n\n## Ações autônomas locais executáveis\n\n${autonomousRows.join('\n')}\n\n## Regra de execução\n\n\`Sem nova autorização\` e \`executável agora\` são conceitos diferentes. Uma ação pode ser permitida pelas restrições do projeto e ainda estar bloqueada por dependências técnicas. Só é executável quando todos os itens de \`blocked_by\` estiverem em \`passed\` ou \`not-applicable\`. Itens de inspeção humana, ambiente externo e CI não podem ser promovidos por inferência ou por checks mecânicos.\n\n## Guardrails\n\n- Não preencher hashes finais antes do freeze real.\n- Não marcar revisão humana, GF-QA-10, QA de navegador/dispositivo ou CI como concluídos sem execução real.\n- Não usar dados financeiros reais, credenciais, criação de conta externa ou aceite legal.\n- Não publicar, anunciar, vender ou habilitar checkout com base neste relatório.\n`;

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = await readFile(outputPath, 'utf8');
  } catch {
    console.error(`Fila de ações ausente: ${outputPath}`);
    process.exit(1);
  }
  if (current !== report) {
    console.error('Fila de ações desatualizada. Execute: npm run report:release-action-queue');
    process.exit(1);
  }
  console.log(`Fila de release sincronizada: ${active.length} ativos; ${runnable.length} executáveis; ${autonomousLocal.length} autônomos locais executáveis.`);
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, report, 'utf8');
  console.log(`Fila de ações gerada em ${outputPath}`);
}
