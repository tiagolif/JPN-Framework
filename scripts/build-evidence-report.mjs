import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Uso: npm run eval:report -- <arquivo.score.json>');
  process.exit(1);
}

const absoluteInput = path.resolve(inputPath);
const score = JSON.parse(fs.readFileSync(absoluteInput, 'utf8'));

if (score.schema_version !== '1.0' || !score.aggregates?.baseline || !score.aggregates?.jpn) {
  throw new Error('Relatório de score incompatível. Execute primeiro npm run eval:score.');
}

const baseline = score.aggregates.baseline;
const jpn = score.aggregates.jpn;
const rows = Array.isArray(score.rows) ? score.rows : [];
const pairedCases = Number(score.paired_cases ?? 0);
const allRowsHaveUtility = rows.length > 0 && rows.every((row) => Number.isInteger(row.human_utility));
const completePairs = baseline.n === jpn.n && baseline.n === pairedCases && pairedCases > 0;
const evidenceStatus = completePairs && allRowsHaveUtility ? 'complete-for-this-round' : 'incomplete-round';

function pct(value) {
  return value == null ? 'n/a' : `${(value * 100).toFixed(1)}%`;
}

function num(value) {
  return value == null ? 'n/a' : Number(value).toFixed(2);
}

function delta(a, b, digits = 3) {
  if (a == null || b == null) return null;
  return Number((b - a).toFixed(digits));
}

const deltas = {
  requirement_coverage: delta(baseline.requirement_coverage_mean, jpn.requirement_coverage_mean),
  acceptance_coverage: delta(baseline.acceptance_coverage_mean, jpn.acceptance_coverage_mean),
  hallucination_count: delta(baseline.hallucination_count_total, jpn.hallucination_count_total, 0),
  rework_count: delta(baseline.rework_count_total, jpn.rework_count_total, 0),
  human_utility: delta(baseline.human_utility_mean, jpn.human_utility_mean),
};

function direction(metric, value) {
  if (value == null || value === 0) return 'sem diferença observada';
  const lowerIsBetter = metric === 'hallucination_count' || metric === 'rework_count';
  const favorsJpn = lowerIsBetter ? value < 0 : value > 0;
  return favorsJpn ? 'diferença observada a favor de JPN' : 'diferença observada a favor do baseline';
}

const generatedAt = new Date().toISOString();
const source = path.relative(process.cwd(), absoluteInput);
const md = `# Relatório de evidências JPN — rodada experimental\n\n` +
`**Status:** \`${evidenceStatus}\`  \n` +
`**Fonte:** \`${source}\`  \n` +
`**Casos pareados:** ${pairedCases}  \n` +
`**Gerado em:** ${generatedAt}\n\n` +
`## Regra de leitura\n\n` +
`Este documento resume uma rodada registrada no protocolo JPN. Ele descreve diferenças observadas e **não prova causalidade, superioridade geral, ROI, aumento de vendas, redução garantida de erros ou qualquer outro resultado comercial**. Uma única rodada não deve ser convertida em claim publicitário.\n\n` +
`## Agregados\n\n` +
`| Métrica | Baseline | JPN | Delta JPN-baseline | Leitura |\n` +
`| --- | ---: | ---: | ---: | --- |\n` +
`| Cumprimento de requisitos | ${pct(baseline.requirement_coverage_mean)} | ${pct(jpn.requirement_coverage_mean)} | ${deltas.requirement_coverage == null ? 'n/a' : `${(deltas.requirement_coverage * 100).toFixed(1)} pp`} | ${direction('requirement_coverage', deltas.requirement_coverage)} |\n` +
`| Critérios de aceitação | ${pct(baseline.acceptance_coverage_mean)} | ${pct(jpn.acceptance_coverage_mean)} | ${deltas.acceptance_coverage == null ? 'n/a' : `${(deltas.acceptance_coverage * 100).toFixed(1)} pp`} | ${direction('acceptance_coverage', deltas.acceptance_coverage)} |\n` +
`| Alucinações factuais | ${baseline.hallucination_count_total} | ${jpn.hallucination_count_total} | ${deltas.hallucination_count ?? 'n/a'} | ${direction('hallucination_count', deltas.hallucination_count)} |\n` +
`| Retrabalho | ${baseline.rework_count_total} | ${jpn.rework_count_total} | ${deltas.rework_count ?? 'n/a'} | ${direction('rework_count', deltas.rework_count)} |\n` +
`| Utilidade humana cega | ${num(baseline.human_utility_mean)} | ${num(jpn.human_utility_mean)} | ${deltas.human_utility ?? 'n/a'} | ${direction('human_utility', deltas.human_utility)} |\n\n` +
`## Completude da rodada\n\n` +
`- pares completos baseline/JPN: **${completePairs ? 'sim' : 'não'}**;\n` +
`- todas as respostas com nota humana cega: **${allRowsHaveUtility ? 'sim' : 'não'}**;\n` +
`- status desta rodada: **${evidenceStatus}**.\n\n` +
`Se o status for \`incomplete-round\`, o documento serve apenas como diagnóstico interno. Mesmo com \`complete-for-this-round\`, a conclusão permanece limitada ao dataset, modelo, parâmetros e avaliadores registrados nesta rodada.\n\n` +
`## Limitações obrigatórias\n\n` +
`1. O dataset inicial é pequeno e sintético.\n` +
`2. O resultado pode variar por modelo, versão, temperatura, contexto e domínio.\n` +
`3. A avaliação humana pode conter variabilidade entre avaliadores.\n` +
`4. Contagens de alucinação e retrabalho dependem do protocolo de anotação.\n` +
`5. Não há base nesta rodada para inferir impacto financeiro ou comercial.\n\n` +
`## Uso permitido\n\n` +
`Pode ser usado para documentação interna, evolução do Método JPN, desenho de novos testes e registro transparente de resultados positivos, neutros ou negativos. Não deve ser usado isoladamente como prova comercial.\n`;

const outputPath = absoluteInput.replace(/\.score\.json$/i, '.evidence.md');
if (outputPath === absoluteInput) {
  throw new Error('O arquivo de entrada deve terminar com .score.json');
}

fs.writeFileSync(outputPath, md);
console.log(md);
console.log(`\nRelatório salvo em ${outputPath}`);
