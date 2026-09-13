const templates = [
  { id: 'PP-01', name: 'Pedido vago → plano executável', category: 'estruturação', signal: 'Transformar solicitação ampla em objetivo, etapas e critérios.', keywords: ['organizar','plano','planejar','pedido','escopo','etapas','objetivo','estruturar'] },
  { id: 'PP-02', name: 'Pesquisa verificável', category: 'pesquisa', signal: 'Pesquisar com fontes, datas, evidências e rastreabilidade.', keywords: ['pesquisa','pesquisar','fonte','fontes','evidência','verificar','notícia','atual'] },
  { id: 'PP-03', name: 'Comparador de alternativas', category: 'decisão', signal: 'Comparar opções usando critérios explícitos.', keywords: ['comparar','comparação','alternativa','opção','opções','melhor','escolher'] },
  { id: 'PP-04', name: 'Resumo com continuidade', category: 'documentação', signal: 'Resumir preservando decisões, contexto e pendências.', keywords: ['resumir','resumo','continuidade','contexto','pendência','histórico'] },
  { id: 'PP-05', name: 'Reescrita controlada', category: 'comunicação', signal: 'Alterar texto sem inventar fatos ou perder requisitos.', keywords: ['reescrever','revisar texto','mensagem','email','texto','copy','corrigir'] },
  { id: 'PP-06', name: 'Follow-up responsável', category: 'vendas', signal: 'Retomar conversa sem urgência artificial.', keywords: ['follow-up','followup','retomar','cliente','contato','responder','retorno'] },
  { id: 'PP-07', name: 'Atendimento → diagnóstico e próximo passo', category: 'suporte', signal: 'Entender necessidade ou causa antes de propor ação.', keywords: ['atendimento','suporte','problema','diagnóstico','cliente','ajuda','causa'] },
  { id: 'PP-08', name: 'Conteúdo social sem invenção comercial', category: 'marketing', signal: 'Criar conteúdo preservando condições confirmadas.', keywords: ['post','social','instagram','facebook','conteúdo','marketing','legenda','campanha'] },
  { id: 'PP-09', name: 'Oferta sem condições inventadas', category: 'vendas', signal: 'Estruturar oferta sem presumir preço, estoque ou prazo.', keywords: ['oferta','venda','preço','estoque','desconto','produto','condição','promoção'] },
  { id: 'PP-10', name: 'Ata operacional JPN', category: 'operações', signal: 'Converter reunião em decisões e responsáveis rastreáveis.', keywords: ['reunião','ata','decisão','responsável','responsáveis','pauta'] },
  { id: 'PP-11', name: 'Notas → SOP', category: 'operações', signal: 'Converter notas em processo repetível.', keywords: ['processo','sop','procedimento','passo a passo','notas','rotina','padronizar'] },
  { id: 'PP-12', name: 'Análise de dados com escopo explícito', category: 'dados', signal: 'Analisar dados sem extrapolar período, cobertura ou causalidade.', keywords: ['dados','planilha','análise','analisar','métrica','métricas','relatório','tabela'] },
  { id: 'PP-13', name: 'Debug estruturado', category: 'tecnologia', signal: 'Investigar problema técnico por hipótese e evidência.', keywords: ['bug','erro','debug','falha','quebrou','código','log','logs'] },
  { id: 'PP-14', name: 'Feature → plano de implementação', category: 'tecnologia', signal: 'Decompor funcionalidade em escopo, riscos e aceite.', keywords: ['feature','funcionalidade','implementar','implementação','desenvolver','app','sistema'] },
  { id: 'PP-15', name: 'Code review orientado a risco', category: 'tecnologia', signal: 'Revisar código priorizando impacto e regressão.', keywords: ['code review','revisar código','pull request','pr','regressão','commit'] },
  { id: 'PP-16', name: 'Conhecimento operacional reutilizável', category: 'documentação', signal: 'Documentar conhecimento recorrente com contexto e limites.', keywords: ['documentar','documentação','conhecimento','manual','guia','recorrente'] },
  { id: 'PP-17', name: 'Decisão com trade-offs explícitos', category: 'decisão', signal: 'Decidir exibindo vantagens, custos, riscos e incertezas.', keywords: ['decidir','decisão','trade-off','tradeoffs','risco','vantagem','custo','priorizar'] },
  { id: 'PP-18', name: 'Handoff JPN', category: 'continuidade', signal: 'Transferir trabalho sem perder estado e pendências.', keywords: ['handoff','transferir','continuar','continuidade','estado atual','próximos passos'] }
];

const categorySelect = document.querySelector('#category');
const goalInput = document.querySelector('#goal');
const resultsEl = document.querySelector('#results');
const summaryEl = document.querySelector('#result-summary');
const stopAlert = document.querySelector('#stop-alert');
const riskIds = ['external-action','spend','sensitive','commercial','specialized'];

[...new Set(templates.map((item) => item.category))]
  .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  .forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category[0].toUpperCase() + category.slice(1);
    categorySelect.append(option);
  });

function normalize(value) {
  return value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function scoreTemplate(template, query, selectedCategory) {
  let score = 0;
  if (selectedCategory && template.category === selectedCategory) score += 5;
  const normalizedQuery = normalize(query);
  for (const keyword of template.keywords) {
    if (normalizedQuery.includes(normalize(keyword))) score += keyword.includes(' ') ? 4 : 2;
  }
  if (normalizedQuery.includes(normalize(template.category))) score += 2;
  return score;
}

function activeRisks() {
  return riskIds.filter((id) => document.querySelector(`#${id}`).checked);
}

function updateStopAlert() {
  const risks = activeRisks();
  if (!risks.length) {
    stopAlert.hidden = true;
    stopAlert.textContent = '';
    return;
  }
  const messages = {
    'external-action': 'A seleção do template não autoriza publicar, enviar, comprar, excluir ou alterar contas.',
    spend: 'Pare antes de qualquer gasto, compra ou contratação sem autorização explícita.',
    sensitive: 'Não cole credenciais, segredos ou dados sensíveis desnecessários no prompt.',
    commercial: 'Preço, estoque, desconto, prazo e condição comercial precisam continuar como pendências até serem confirmados.',
    specialized: 'Decisões especializadas exigem base e revisão adequadas; o template não substitui profissional habilitado.'
  };
  stopAlert.hidden = false;
  stopAlert.innerHTML = `<strong>Condição de parada:</strong><ul>${risks.map((id) => `<li>${messages[id]}</li>`).join('')}</ul>`;
}

function renderRecommendations() {
  const query = goalInput.value.trim();
  const selectedCategory = categorySelect.value;
  updateStopAlert();

  if (!query && !selectedCategory) {
    resultsEl.innerHTML = '';
    summaryEl.textContent = 'Preencha o objetivo ou escolha uma categoria para começar.';
    return;
  }

  const ranked = templates
    .map((template) => ({ ...template, score: scoreTemplate(template, query, selectedCategory) }))
    .filter((template) => !selectedCategory || template.category === selectedCategory || template.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const positive = ranked.filter((template) => template.score > 0);
  const candidates = (positive.length ? positive : ranked).slice(0, 3);

  summaryEl.textContent = positive.length
    ? `${candidates.length} candidato(s) priorizado(s). Escolha o primeiro que resolva o objetivo sem ampliar o escopo.`
    : 'Não houve correspondência forte pelo texto. Revise os candidatos da categoria e confirme a aderência manualmente.';

  resultsEl.innerHTML = candidates.map((template, index) => `
    <article class="card">
      <div class="card-top">
        <h3>${template.id} · ${template.name}</h3>
        <span class="badge">${template.category}</span>
      </div>
      <p><strong>${index === 0 ? 'Primeiro candidato:' : 'Alternativa:'}</strong> ${template.signal}</p>
      <p>Teste de aderência: confirme objetivo, entrada mínima, formato esperado, riscos, condição de parada e critério de suficiência antes de usar.</p>
    </article>`).join('');
}

document.querySelector('#recommend').addEventListener('click', renderRecommendations);
document.querySelector('#clear').addEventListener('click', () => {
  goalInput.value = '';
  categorySelect.value = '';
  for (const id of riskIds) document.querySelector(`#${id}`).checked = false;
  stopAlert.hidden = true;
  stopAlert.textContent = '';
  resultsEl.innerHTML = '';
  summaryEl.textContent = 'Preencha o objetivo ou escolha uma categoria para começar.';
  goalInput.focus();
});

goalInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') renderRecommendations();
});
