import fs from 'node:fs';

const methodPath = 'docs/products/metodo-jpn/METODO_JPN_v1.md';
const quickPath = 'docs/products/metodo-jpn/METODO_JPN_QUICK_REFERENCE_v1.md';

const method = fs.readFileSync(methodPath, 'utf8');
const quick = fs.readFileSync(quickPath, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(quick.includes('# Método JPN — Referência Rápida v1'), 'Título canônico ausente na referência rápida.');
assert(quick.includes('candidate companion / editorial and visual QA pending'), 'Estado candidato da referência rápida ausente.');
assert(quick.includes('JPN Framework `0.3.0-draft`'), 'Base metodológica divergente na referência rápida.');
assert(quick.includes('`METODO_JPN_v1.md`'), 'Referência à fonte canônica ausente.');

for (const heading of [
  '## JPN em 30 segundos',
  '## Fluxo em 7 passos',
  '## Checklist J — Jornada',
  '## Checklist P — Precisão',
  '## Checklist N — Narrativa',
  '## Política de lacunas',
  '### Regra de parada',
  '## Modelo compacto para copiar',
  '## Antes de concluir',
  '## Limites desta referência',
]) {
  assert(quick.includes(heading), `Seção obrigatória ausente: ${heading}`);
}

for (const state of ['`confirmed`', '`inferred`', '`unknown`', '`conflicting`']) {
  assert(method.includes(state), `Estado de confiança ausente na fonte: ${state}`);
  assert(quick.includes(state), `Estado de confiança ausente na referência rápida: ${state}`);
}

const dimensions = [
  ['J — Jornada', 'Qual é a situação real?'],
  ['P — Precisão', 'O que exatamente precisa ser feito e como será verificado?'],
  ['N — Narrativa', 'Como deve ficar o resultado final e o que acontece depois?'],
];
for (const [dimension, question] of dimensions) {
  assert(method.includes(dimension), `Dimensão ausente no Método: ${dimension}`);
  assert(quick.includes(dimension), `Dimensão ausente na referência rápida: ${dimension}`);
  assert(quick.includes(question), `Pergunta canônica ausente para ${dimension}`);
}

for (let step = 1; step <= 7; step += 1) {
  assert(quick.includes(`${step}. **`), `Passo ${step} ausente do fluxo resumido.`);
}

const gapRules = [
  'continuar com uma suposição de baixo risco claramente sinalizada',
  'buscar a informação em uma fonte autorizada',
  'solicitar esclarecimento se a ausência impedir execução correta',
  'entregar uma parte útil sem fingir que a tarefa foi concluída integralmente',
];
for (const rule of gapRules) {
  assert(method.includes(rule), `Regra de lacuna ausente na fonte: ${rule}`);
  assert(quick.includes(rule), `Regra de lacuna ausente na referência rápida: ${rule}`);
}

for (const vague of ['“bonito”', '“completo”', '“profissional”', '“rápido”']) {
  assert(method.includes(vague), `Exemplo de precisão ausente na fonte: ${vague}`);
  assert(quick.includes(vague), `Exemplo de precisão ausente na referência rápida: ${vague}`);
}

for (const field of [
  'Contexto:',
  'Estado atual:',
  'Objetivo operacional:',
  'Critérios de aceitação:',
  'Estado final desejado:',
  'Próxima ação:',
]) {
  assert(quick.includes(field), `Campo mínimo ausente no modelo compacto: ${field}`);
}

for (const prohibited of [
  'publication_authorized: true',
  'release_ready: true',
  'visual_qa: approved',
  'garante respostas corretas',
  'elimina alucinações',
]) {
  assert(!quick.includes(prohibited), `Claim ou promoção indevida encontrada: ${prohibited}`);
}

console.log('Método JPN quick reference: PASS');
console.log('Dimensões: Jornada + Precisão + Narrativa');
console.log('Fluxo: 7 passos');
console.log('Estados de confiança: confirmed / inferred / unknown / conflicting');
console.log('Estado editorial preservado: candidate companion');
