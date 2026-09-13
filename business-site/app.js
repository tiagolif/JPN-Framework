const playbooks = [
  {id:'JB-01',name:'Entrada e triagem de novo lead',category:'comercial',links:['PP-06','PP-07'],keywords:['lead','novo cliente','entrada','triagem','contato','primeiro atendimento']},
  {id:'JB-02',name:'Follow-up comercial responsável',category:'comercial',links:['PP-06'],keywords:['follow-up','follow up','retorno','acompanhar','sem resposta','cliente parou']},
  {id:'JB-03',name:'Qualificação sem inventar necessidade',category:'comercial',links:['PP-07'],keywords:['qualificar','qualificação','necessidade','perfil','aderência','descoberta']},
  {id:'JB-04',name:'Preparação de proposta sem definir condição não autorizada',category:'comercial',links:['PP-03','PP-09'],keywords:['proposta','orçamento','condição','preço','prazo','desconto','oferta']},
  {id:'JB-05',name:'Atendimento e resolução de solicitação',category:'atendimento',links:['PP-07'],keywords:['atendimento','solicitação','pedido','resolver','suporte','cliente']},
  {id:'JB-06',name:'Escalonamento e handoff interno',category:'operacoes',links:['PP-18'],keywords:['escalar','escalonamento','handoff','encaminhar','transferir','responsável','interno']},
  {id:'JB-07',name:'Planejamento de conteúdo comercial',category:'marketing',links:['PP-08','PP-09'],keywords:['conteúdo','post','copy','calendário','social','marketing','campanha editorial']},
  {id:'JB-08',name:'Planejamento de campanha sem publicação automática',category:'marketing',links:['PP-08','PP-09'],keywords:['campanha','anúncio','mídia','lançamento','planejar campanha','publicação']},
  {id:'JB-09',name:'Criação e manutenção de SOP',category:'operacoes',links:['PP-11'],keywords:['sop','procedimento','processo','rotina','instrução','padronizar']},
  {id:'JB-10',name:'Reunião com decisão e plano de ação',category:'gestao',links:['PP-10','PP-17'],keywords:['reunião','decisão','plano de ação','responsável','prazo','ata']},
  {id:'JB-11',name:'Base de conhecimento operacional',category:'conhecimento',links:['PP-16'],keywords:['base de conhecimento','documentação','faq','conhecimento','manual','referência']},
  {id:'JB-12',name:'Revisão semanal operacional',category:'gestao',links:['PP-04','PP-10','PP-17'],keywords:['revisão semanal','semana','indicadores','pendências','prioridades','retrospectiva']}
];

const goal = document.querySelector('#goal');
const category = document.querySelector('#category');
const results = document.querySelector('#results');
const summary = document.querySelector('#result-summary');
const stopAlert = document.querySelector('#stop-alert');
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

[...new Set(playbooks.map((p) => p.category))].sort().forEach((item) => {
  const option = document.createElement('option'); option.value = item; option.textContent = item; category.append(option);
});

function scorePlaybook(playbook, text, selectedCategory) {
  let score = selectedCategory && playbook.category === selectedCategory ? 5 : 0;
  const source = normalize(text);
  for (const keyword of playbook.keywords) if (source.includes(normalize(keyword))) score += 3;
  for (const word of normalize(playbook.name).split(/\s+/).filter((w) => w.length > 4)) if (source.includes(word)) score += 1;
  return score;
}

function render() {
  const text = goal.value.trim();
  const selectedCategory = category.value;
  if (!text && !selectedCategory) { summary.textContent = 'Descreva a situação ou escolha uma área para começar.'; results.replaceChildren(); return; }
  const ranked = playbooks.map((p) => ({...p,score:scorePlaybook(p,text,selectedCategory)})).filter((p) => !selectedCategory || p.category === selectedCategory || p.score > 0).sort((a,b) => b.score-a.score || a.id.localeCompare(b.id)).slice(0,3);
  summary.textContent = ranked.length ? `Mostrando ${ranked.length} candidato(s). Confirme a aderência antes de usar.` : 'Nenhum candidato forte encontrado. Reformule a situação ou consulte o índice completo.';
  results.replaceChildren(...ranked.map((p) => {
    const card = document.createElement('article'); card.className='card';
    card.innerHTML = `<div class="card-top"><h3>${p.id} · ${p.name}</h3><span class="badge">${p.category}</span></div><p><strong>Apoio Prompt Pack:</strong> ${p.links.join(', ')}</p><p>Use somente se este playbook cobrir a situação sem ampliar o escopo.</p>`;
    return card;
  }));
}

function updateStopAlert() {
  const flags = [
    ['external-action','Há ação externa envolvida: pare antes de publicar, enviar ou alterar algo sem autorização.'],
    ['spend','Há gasto ou condição comercial: confirme autorização e fatos materiais antes de prosseguir.'],
    ['sensitive','Há dado sensível ou segredo: reduza o contexto e não cole credenciais nesta ferramenta.'],
    ['specialized','Há decisão especializada: use apoio profissional adequado antes de agir.']
  ].filter(([id]) => document.getElementById(id).checked).map(([,message]) => message);
  stopAlert.hidden = flags.length === 0;
  stopAlert.textContent = flags.join(' ');
}

document.querySelector('#recommend').addEventListener('click', () => { updateStopAlert(); render(); });
document.querySelector('#clear').addEventListener('click', () => {
  goal.value=''; category.value=''; ['external-action','spend','sensitive','specialized'].forEach((id)=>document.getElementById(id).checked=false); stopAlert.hidden=true; results.replaceChildren(); summary.textContent='Descreva a situação ou escolha uma área para começar.';
});
