import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const portfolioPath = resolve(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const statusPath = resolve(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const outputPath = resolve(root, 'reports/product-readiness/PORTFOLIO_READINESS.md');

const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
const releaseStatus = JSON.parse(await readFile(statusPath, 'utf8'));

const statusLabels = {
  pending: 'Pendente',
  'in-progress': 'Em andamento',
  passed: 'Aprovado com evidência',
  blocked: 'Bloqueado',
  'not-applicable': 'Não aplicável',
};

const statusByProduct = new Map(releaseStatus.products.map((product) => [product.id, product]));
const totals = Object.fromEntries(releaseStatus.allowed_statuses.map((status) => [status, 0]));
let dependencyCount = 0;

const productRows = [];
const detailSections = [];

for (const product of portfolio.products) {
  const statusProduct = statusByProduct.get(product.id);
  if (!statusProduct) {
    throw new Error(`Produto sem status de release: ${product.id}`);
  }

  const localCounts = Object.fromEntries(releaseStatus.allowed_statuses.map((status) => [status, 0]));
  for (const dependency of statusProduct.dependencies) {
    dependencyCount += 1;
    totals[dependency.status] += 1;
    localCounts[dependency.status] += 1;
  }

  const applicable = statusProduct.dependencies.filter((item) => item.status !== 'not-applicable');
  const passed = applicable.filter((item) => item.status === 'passed');
  const ready = applicable.length > 0 && passed.length === applicable.length;
  const readiness = applicable.length === 0 ? 100 : Math.round((passed.length / applicable.length) * 100);

  productRows.push(
    `| ${product.canonical_name} | ${statusProduct.dependencies.length} | ${localCounts.passed} | ${localCounts['in-progress']} | ${localCounts.pending} | ${localCounts.blocked} | ${readiness}% | ${ready ? 'Sim' : 'Não'} |`,
  );

  const dependencyLines = statusProduct.dependencies.map((dependency) => {
    const evidence = dependency.evidence ? ` Evidência: \`${dependency.evidence}\`.` : '';
    return `- **${dependency.id}** — ${statusLabels[dependency.status] ?? dependency.status}. ${dependency.note}${evidence}`;
  });

  detailSections.push(`## ${product.canonical_name}\n\n${dependencyLines.join('\n')}`);
}

const globalApplicable = dependencyCount - totals['not-applicable'];
const globalReadiness = globalApplicable === 0 ? 100 : Math.round((totals.passed / globalApplicable) * 100);
const allReady = globalApplicable > 0 && totals.passed === globalApplicable;

const report = `# JPN — Prontidão agregada do portfólio\n\n> Relatório derivado mecanicamente de \`PRODUCT_PORTFOLIO_v1.json\` e \`PRODUCT_RELEASE_STATUS_v1.json\`. Não é autorização de publicação, venda ou anúncio.\n\n## Resumo\n\n- Produtos canônicos: **${portfolio.products.length}**\n- Dependências registradas: **${dependencyCount}**\n- Aprovadas com evidência: **${totals.passed}**\n- Em andamento: **${totals['in-progress']}**\n- Pendentes: **${totals.pending}**\n- Bloqueadas: **${totals.blocked}**\n- Não aplicáveis: **${totals['not-applicable']}**\n- Prontidão agregada por dependências aplicáveis: **${globalReadiness}%**\n- Portfólio pronto para release segundo este contrato: **${allReady ? 'Sim' : 'Não'}**\n\n## Visão por produto\n\n| Produto | Dependências | Aprovadas | Em andamento | Pendentes | Bloqueadas | Prontidão | Pronto |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |\n${productRows.join('\n')}\n\n${detailSections.join('\n\n')}\n\n## Leitura correta\n\nA porcentagem mede somente dependências explicitamente registradas e aprovadas com evidência. Ela não mede qualidade comercial, eficácia do Método JPN, adequação jurídica, aceitação de mercado ou desempenho financeiro. Revisões humanas, visuais e de compatibilidade continuam obrigatórias quando o contrato assim determina.\n`;

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = await readFile(outputPath, 'utf8');
  } catch {
    console.error(`Relatório ausente: ${outputPath}`);
    process.exit(1);
  }

  if (current !== report) {
    console.error('Relatório de prontidão desatualizado. Execute: npm run report:product-readiness');
    process.exit(1);
  }

  console.log(`Relatório de prontidão sincronizado: ${portfolio.products.length} produtos, ${dependencyCount} dependências, ${totals.passed} aprovadas.`);
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, report, 'utf8');
  console.log(`Relatório gerado em ${outputPath}`);
}
