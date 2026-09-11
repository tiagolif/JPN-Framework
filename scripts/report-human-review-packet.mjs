import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const statusPath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const planPath = path.join(root, 'docs/product-system/RELEASE_EXECUTION_PLAN_v1.json');
const portfolioPath = path.join(root, 'docs/product-system/PRODUCT_PORTFOLIO_v1.json');
const outputPath = path.join(root, 'reports/product-readiness/HUMAN_REVIEW_PACKET.md');
const checkOnly = process.argv.includes('--check');

const status = JSON.parse(await readFile(statusPath, 'utf8'));
const plan = JSON.parse(await readFile(planPath, 'utf8'));
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));

const statusByProduct = new Map(status.products.map((product) => [product.id, product]));
const productById = new Map(portfolio.products.map((product) => [product.id, product]));

const activeHumanItems = plan.items
  .filter((item) => item.execution_mode === 'requires-human-inspection')
  .map((item) => {
    const productStatus = statusByProduct.get(item.product_id);
    const dependency = productStatus?.dependencies?.find((entry) => entry.id === item.dependency_id);
    const product = productById.get(item.product_id);
    return { ...item, dependency, product };
  })
  .filter((item) => item.dependency && !['passed', 'not-applicable'].includes(item.dependency.status))
  .sort((a, b) => {
    const priority = String(a.priority).localeCompare(String(b.priority));
    if (priority !== 0) return priority;
    return String(a.product?.canonical_name ?? a.product_id).localeCompare(String(b.product?.canonical_name ?? b.product_id), 'pt-BR');
  });

const errors = [];
for (const item of activeHumanItems) {
  if (!item.product) errors.push(`${item.product_id}/${item.dependency_id}: produto ausente do portfólio.`);
  if (!item.completion_evidence?.trim()) errors.push(`${item.product_id}/${item.dependency_id}: completion_evidence ausente.`);
  if (!item.next_action?.trim()) errors.push(`${item.product_id}/${item.dependency_id}: next_action ausente.`);
}

if (errors.length > 0) {
  console.error('Falha ao gerar pacote de revisão humana:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const lines = [
  '# JPN — Pacote de revisão humana',
  '',
  '> Documento derivado mecanicamente de `PRODUCT_PORTFOLIO_v1.json`, `PRODUCT_RELEASE_STATUS_v1.json` e `RELEASE_EXECUTION_PLAN_v1.json`. Ele prepara inspeções humanas; não substitui a inspeção e não aprova release.',
  '',
  '## Resumo',
  '',
  `- Inspeções humanas abertas: **${activeHumanItems.length}**`,
  `- P0: **${activeHumanItems.filter((item) => item.priority === 'P0').length}**`,
  `- P1: **${activeHumanItems.filter((item) => item.priority === 'P1').length}**`,
  '- Publicação autorizada: **não**',
  '- Promoção automática para `passed`: **proibida**',
  '',
  '## Ordem de revisão',
  '',
];

activeHumanItems.forEach((item, index) => {
  const productName = item.product?.canonical_name ?? item.product_id;
  lines.push(`### ${index + 1}. ${productName} — \`${item.dependency_id}\` (${item.priority})`);
  lines.push('');
  lines.push(`- **Estado atual:** ${item.dependency.status}`);
  lines.push(`- **Ação humana:** ${item.next_action}`);
  lines.push(`- **Evidência exigida:** ${item.completion_evidence}`);
  lines.push(`- **Evidência registrada hoje:** ${item.dependency.evidence ?? 'nenhuma'}`);
  lines.push('');
  lines.push('Checklist do revisor:');
  lines.push('');
  lines.push('- [ ] Identifiquei exatamente o artefato/versão revisado.');
  lines.push('- [ ] Revisei o artefato completo, não apenas uma amostra.');
  lines.push('- [ ] Registrei problemas encontrados e as correções necessárias.');
  lines.push('- [ ] Reexecutei a inspeção após correções relevantes, quando aplicável.');
  lines.push('- [ ] Produzi exatamente a evidência exigida acima.');
  lines.push('- [ ] Não alterei o status canônico para `passed` sem anexar essa evidência.');
  lines.push('');
  lines.push('Registro do revisor:');
  lines.push('');
  lines.push('- Artefato/hash revisado: `____________________________`');
  lines.push('- Resultado: `APROVADO / REPROVADO / AJUSTES NECESSÁRIOS`');
  lines.push('- Evidência versionada: `____________________________`');
  lines.push('- Observações: `____________________________`');
  lines.push('');
});

lines.push('## Guardrails');
lines.push('');
lines.push('- Este pacote não autoriza venda, anúncio, checkout, publicação ou coleta de dados.');
lines.push('- Revisão humana não pode ser substituída por ausência de erro em script, build ou render automatizado.');
lines.push('- Um item só pode ser promovido para `passed` quando a evidência exigida existir e estiver vinculada ao artefato efetivamente revisado.');
lines.push('- Não registrar dados financeiros reais, credenciais, dados sensíveis desnecessários ou aceite legal durante a revisão.');
lines.push('');

const expected = `${lines.join('\n')}\n`;

if (checkOnly) {
  let current = '';
  try {
    current = await readFile(outputPath, 'utf8');
  } catch {
    console.error('HUMAN_REVIEW_PACKET.md ausente. Execute o gerador sem --check.');
    process.exit(1);
  }
  if (current !== expected) {
    console.error('HUMAN_REVIEW_PACKET.md está desatualizado. Execute o gerador novamente.');
    process.exit(1);
  }
  console.log(`Human review packet OK: ${activeHumanItems.length} inspeções abertas.`);
  process.exit(0);
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, expected, 'utf8');
console.log(`Pacote de revisão humana gerado: ${activeHumanItems.length} inspeções abertas.`);
