const form = document.querySelector('#jpn-form');
const result = document.querySelector('#result');
const status = document.querySelector('#status');
const copyButton = document.querySelector('#copy');
const clearButton = document.querySelector('#clear');

const fieldMap = [
  ['contexto','Contexto'],['estadoAtual','Estado atual'],['recursos','Recursos disponíveis'],['restricoesJ','Restrições conhecidas'],['incertezas','Incertezas e conflitos'],['confianca','Confiança relevante'],
  ['objetivo','Objetivo operacional'],['inclui','Inclui'],['naoInclui','Não inclui'],['entradas','Entradas'],['saida','Saída esperada'],['restricoesP','Restrições'],['criterios','Critérios de aceitação'],['riscos','Riscos'],['validacao','Validação'],
  ['estadoFinal','Estado final desejado'],['sequencia','Sequência de entrega'],['formato','Formato'],['detalhe','Nível de detalhe'],['proxima','Próxima ação'],['continuidade','Continuidade a preservar']
];

const sections = [
  ['## J — Jornada', fieldMap.slice(0,6)],
  ['## P — Precisão', fieldMap.slice(6,15)],
  ['## N — Narrativa', fieldMap.slice(15)]
];

function values(){ return Object.fromEntries(new FormData(form).entries()); }
function clean(value){ return String(value ?? '').trim(); }

function buildDraft(data){
  const lines = ['# JPN — Jornada · Precisão · Narrativa',''];
  for(const [heading, fields] of sections){
    lines.push(heading);
    for(const [key,label] of fields) lines.push(`${label}: ${clean(data[key]) || '[não informado]'}`);
    lines.push('');
  }
  lines.push('## Antes de concluir');
  lines.push('- Confirmar fatos e manter inferências sinalizadas.');
  lines.push('- Validar a saída contra os critérios de aceitação.');
  lines.push('- Preservar restrições, riscos e lacunas relevantes.');
  lines.push('- Parar ou escalar antes de ação externa irreversível, gasto, dado sensível ou decisão especializada sem base suficiente.');
  return lines.join('\n');
}

function markCriticalGaps(data){
  const critical = ['contexto','objetivo','saida','criterios','validacao','estadoFinal','formato'];
  let gaps = 0;
  for(const name of critical){
    const field = form.elements.namedItem(name);
    const empty = !clean(data[name]);
    field?.classList.toggle('is-empty', empty);
    if(empty) gaps++;
  }
  return gaps;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = values();
  result.textContent = buildDraft(data);
  const gaps = markCriticalGaps(data);
  status.textContent = gaps ? `Rascunho gerado com ${gaps} campo(s) crítico(s) ainda vazio(s).` : 'Rascunho gerado sem lacunas críticas básicas.';
  result.focus();
});

copyButton.addEventListener('click', async () => {
  if(!result.textContent.startsWith('# JPN')) { status.textContent = 'Gere o rascunho antes de copiar.'; return; }
  try { await navigator.clipboard.writeText(result.textContent); status.textContent = 'Rascunho copiado.'; }
  catch { status.textContent = 'Não foi possível copiar automaticamente. Selecione o texto manualmente.'; }
});

clearButton.addEventListener('click', () => {
  form.reset();
  form.querySelectorAll('.is-empty').forEach((el) => el.classList.remove('is-empty'));
  result.textContent = 'Preencha o canvas e gere o rascunho.';
  status.textContent = 'Canvas limpo.';
});
