const $=id=>document.getElementById(id);
const clean=value=>{const v=(value??'').trim();return v||undefined};
const unique=values=>[...new Set((values??[]).map(v=>v.trim()).filter(Boolean))];

function createJpnDraftFromText(rawInput,hints={}){
  const input=rawInput.trim();
  if(!input) throw new Error('rawInput must be a non-empty string');

  const objetivoOperacional=clean(hints.objetivoOperacional)??'Estruturar e executar a solicitação fornecida, preservando o contexto e sinalizando lacunas relevantes.';
  const inclui=unique(hints.inclui);
  const naoInclui=unique(hints.naoInclui);
  const saidas=unique(hints.saidas);
  const inferredFields=[];
  const unresolvedFields=[];

  if(!clean(hints.objetivoOperacional)) inferredFields.push('/precisao/objetivo');
  if(inclui.length===0) unresolvedFields.push('/precisao/escopo/inclui');
  if(naoInclui.length===0) unresolvedFields.push('/precisao/escopo/nao_inclui');
  if(saidas.length===0) unresolvedFields.push('/precisao/saidas');
  if(!clean(hints.formatoDaResposta)) unresolvedFields.push('/narrativa/formato_da_resposta');

  const incertezas=[
    ...(inclui.length===0?['Escopo positivo ainda não foi confirmado.']:[]),
    ...(naoInclui.length===0?['Limites explícitos do escopo ainda não foram confirmados.']:[]),
    ...(saidas.length===0?['Saídas esperadas ainda não foram confirmadas.']:[]),
    ...(!clean(hints.formatoDaResposta)?['Formato final da resposta ainda não foi confirmado.']:[]),
  ];

  return {
    state:{
      version:'0.3.0-draft',
      jornada:{
        contexto:input,
        objetivo_de_negocio:clean(hints.objetivoDeNegocio)??null,
        estado_atual:'Solicitação bruta recebida. O estado foi inicializado como rascunho e requer revisão dos campos não confirmados.',
        incertezas,
        itens_de_contexto:[{value:input,confidence_state:'confirmed',source:'raw_input'}]
      },
      precisao:{
        objetivo:objetivoOperacional,
        escopo:{
          inclui:inclui.length?inclui:['Interpretar a solicitação fornecida.'],
          nao_inclui:naoInclui.length?naoInclui:['Inventar fatos, fontes ou requisitos não fornecidos.']
        },
        entradas:unique(hints.entradas),
        saidas:saidas.length?saidas:['Resultado principal alinhado à solicitação, com lacunas relevantes explicitadas.'],
        restricoes:['Não transformar inferências em fatos confirmados.','Não preencher silenciosamente informações ausentes.',...unique(hints.restricoes)],
        criterios_de_aceitacao:unique(hints.criteriosDeAceitacao),
        riscos:unique(hints.riscos),
        validacao:unique(hints.validacao)
      },
      narrativa:{
        estado_final_desejado:'Solicitação transformada em um estado JPN revisável, com contexto preservado e lacunas explicitadas antes da execução final.',
        formato_da_resposta:clean(hints.formatoDaResposta)??null,
        nivel_de_detalhe:clean(hints.nivelDeDetalhe)??null,
        proxima_acao:clean(hints.proximaAcao)??'Revisar os campos não confirmados antes de tratar o rascunho como especificação final.'
      }
    },
    inferredFields,
    unresolvedFields
  };
}

function assessJpnReadiness(input){
  const gaps=[]; let score=0;
  score+=15;
  if(input.jornada.objetivo_de_negocio) score+=10; else gaps.push('Objetivo de negócio não informado');
  if((input.jornada.incertezas?.length??0)>0) score+=10; else gaps.push('Nenhuma incerteza registrada');
  score+=15;
  if((input.precisao.criterios_de_aceitacao?.length??0)>0) score+=15; else gaps.push('Faltam critérios de aceitação verificáveis');
  if((input.precisao.validacao?.length??0)>0) score+=10; else gaps.push('Falta estratégia de validação');
  if((input.precisao.riscos?.length??0)>0) score+=10; else gaps.push('Riscos ainda não foram mapeados');
  score+=10;
  if((input.narrativa.sequencia_de_entrega?.length??0)>0||input.narrativa.proxima_acao) score+=5; else gaps.push('Falta sequência de entrega ou próxima ação');
  score=Math.max(0,Math.min(100,score));
  return {score,ready:score>=70&&gaps.length<=3,gaps};
}

const bullets=items=>(items??[]).map(item=>`- ${item}`).join('\n');
function buildPrompt(state){
  return `# JPN ${state.version}\n\nUse o estado estruturado abaixo como contrato de contexto e execução.\nNão invente fatos ausentes. Diferencie evidência, inferência e incerteza.\n\n## J — Jornada\nContexto: ${state.jornada.contexto}\nObjetivo de negócio: ${state.jornada.objetivo_de_negocio??'não confirmado'}\nEstado atual: ${state.jornada.estado_atual}\nIncertezas:\n${bullets(state.jornada.incertezas)||'- nenhuma registrada'}\n\n## P — Precisão\nObjetivo operacional: ${state.precisao.objetivo}\nEscopo — inclui:\n${bullets(state.precisao.escopo.inclui)}\nEscopo — não inclui:\n${bullets(state.precisao.escopo.nao_inclui)}\nSaídas esperadas:\n${bullets(state.precisao.saidas)}\nRestrições:\n${bullets(state.precisao.restricoes)}\n\n## N — Narrativa\nEstado final desejado: ${state.narrativa.estado_final_desejado}\nFormato da resposta: ${state.narrativa.formato_da_resposta??'não confirmado'}\nNível de detalhe: ${state.narrativa.nivel_de_detalhe??'não confirmado'}\nPróxima ação: ${state.narrativa.proxima_acao??'não definida'}\n\n## Regras de execução\n- Preserve fatos e decisões confirmadas.\n- Não transforme inferências em fatos.\n- Respeite o escopo e as restrições.\n- Quando houver conflito de contexto, sinalize-o em vez de escolher silenciosamente.\n- Antes de tratar este rascunho como especificação final, revise os campos ainda não confirmados.`;
}

let lastDraft=null;
function build(){
  const idea=clean($('idea').value), type=$('type').value, restriction=clean($('restrictions').value);
  if(!idea){$('status').textContent='Escreva sua ideia';$('status').className='status warn';$('score').textContent='0%';$('gaps').textContent='';return}

  const result=createJpnDraftFromText(idea,{
    formatoDaResposta:type,
    naoInclui:restriction?[restriction]:undefined,
    nivelDeDetalhe:'Suficiente para uso imediato, sem conteúdo irrelevante.'
  });
  lastDraft=result;
  const readiness=assessJpnReadiness(result.state);

  $('output').textContent=buildPrompt(result.state);
  $('score').textContent=readiness.score+'%';
  $('status').textContent=result.unresolvedFields.length?`Revisar ${result.unresolvedFields.length} campo(s)`:(readiness.ready?'Estrutura utilizável':'Revisão recomendada');
  $('status').className='status '+(result.unresolvedFields.length===0&&readiness.ready?'good':'warn');
  $('gaps').innerHTML=[
    ...result.unresolvedFields.map(path=>`Não confirmado: <code>${path}</code>`),
    ...result.inferredFields.map(path=>`Default operacional: <code>${path}</code>`)
  ].join('<br>');
}

$('generate').addEventListener('click',build);
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('output').textContent);$('copy').textContent='Copiado';setTimeout(()=>$('copy').textContent='Copiar',1300)}catch(e){}});
$('download').addEventListener('click',()=>{const text=$('output').textContent;if(!text||text.startsWith('Seu prompt'))return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.download='prompt-jpn.txt';a.click();URL.revokeObjectURL(a.href)});
$('downloadJson').addEventListener('click',()=>{if(!lastDraft)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(lastDraft,null,2)],{type:'application/json'}));a.download='rascunho-jpn.json';a.click();URL.revokeObjectURL(a.href)});
