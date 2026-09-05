const $=id=>document.getElementById(id);
const esc=s=>(s||'').trim();
function build(){
  const idea=esc($('idea').value), type=$('type').value, restrictions=esc($('restrictions').value);
  if(!idea){$('status').textContent='Escreva sua ideia';$('status').className='status warn';$('score').textContent='0%';return}
  let score=55;
  if(idea.length>60) score+=10;
  if(restrictions) score+=15;
  if(/\b(prazo|dias|semana|mês|hoje|amanhã)\b/i.test(idea)) score+=5;
  if(/\b(público|cliente|empresa|loja|equipe|produto|serviço)\b/i.test(idea)) score+=5;
  if(/\b(resultado|vendas|leads|conversão|reduzir|aumentar|criar|organizar)\b/i.test(idea)) score+=5;
  score=Math.min(95,score);
  const no=restrictions||'Não inventar fatos, preços, fontes, políticas, resultados ou depoimentos ausentes.';
  const prompt=`# JPN - Jornada · Precisão · Narrativa\n\nUse a estrutura abaixo como contrato de contexto e execução. Não transforme inferências em fatos. Quando uma informação essencial estiver ausente, identifique a lacuna explicitamente.\n\n## J - Jornada\nContexto fornecido pelo usuário: ${idea}\nObjetivo de negócio: inferir apenas se estiver claramente implícito; caso contrário, marcar como desconhecido.\nEstado atual: solicitação inicial recebida; detalhes operacionais podem estar incompletos.\nIncertezas: público, recursos, prazo, dados disponíveis e critérios específicos devem ser confirmados quando mudarem materialmente a execução.\nRestrições conhecidas: ${no}\n\n## P - Precisão\nObjetivo operacional: produzir ${type.toLowerCase()} diretamente utilizável, aderente à intenção do usuário.\nEscopo - inclui: interpretar contexto; estruturar execução; produzir a saída principal; sinalizar lacunas relevantes.\nEscopo - não inclui: inventar dados ausentes; ultrapassar restrições; apresentar suposição como fato.\nSaídas esperadas: resultado principal; lacunas/suposições relevantes; próxima ação recomendada.\nCritérios de aceitação: aderência ao objetivo; clareza; utilidade prática; respeito às restrições; fatos separados de inferências.\nRiscos: contexto insuficiente; resposta genérica; criação de informação não fornecida.\nValidação: antes de concluir, revisar a saída contra objetivo, escopo, restrições e critérios de aceitação.\n\n## N - Narrativa\nEstado final desejado: o usuário recebe um resultado acionável e entende qualquer lacuna importante que permaneça.\nSequência de entrega: 1) interpretar contexto; 2) executar; 3) validar; 4) entregar; 5) indicar próxima ação.\nFormato: ${type}.\nNível de detalhe: suficiente para uso imediato, sem preencher espaço com conteúdo irrelevante.\nPróxima ação: aplicar o resultado ou solicitar somente o dado essencial que realmente impedir uma execução correta.\n\n## Regras finais\n- Preserve decisões e fatos confirmados.\n- Não silencie conflitos de contexto.\n- Não trate inferência como fato.\n- Respeite escopo negativo e critérios de aceitação.\n- Se puder executar com segurança apesar de uma lacuna não essencial, faça a melhor entrega possível e sinalize a suposição.`;
  $('output').textContent=prompt;
  $('score').textContent=score+'%';
  $('status').textContent=score>=75?'Estrutura utilizável':'Revisão recomendada';
  $('status').className='status '+(score>=75?'good':'warn');
}
$('generate').addEventListener('click',build);
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('output').textContent);$('copy').textContent='Copiado';setTimeout(()=>$('copy').textContent='Copiar',1300)}catch(e){}});
$('download').addEventListener('click',()=>{const text=$('output').textContent;if(!text||text.startsWith('Seu prompt'))return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.download='prompt-jpn.txt';a.click();URL.revokeObjectURL(a.href)});
