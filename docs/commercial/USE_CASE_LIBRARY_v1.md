# JPN — Biblioteca de Casos de Uso v1

**Estado:** candidate companion / commercial QA pending  
**Escopo:** orientação interna de uso; não publicada; sem preço, checkout, promessa comercial ou coleta de dados.

## Objetivo

Traduzir o ecossistema JPN em situações concretas, mostrando qual é o menor recurso suficiente para começar, quais dados precisam estar confirmados e quando interromper o fluxo antes de avançar.

A biblioteca não substitui as fontes canônicas dos produtos. Ela funciona como ponte entre problema real → recurso JPN → próximo passo seguro.

## Regra principal

**Comece pelo menor recurso que resolva a necessidade atual.**

Não percorra todos os produtos por padrão. Só avance quando surgir uma necessidade adicional real.

## Casos de uso

### UC-01 — Transformar uma ideia vaga em tarefa clara

**Situação:** “Preciso criar uma campanha, mas ainda não sei como estruturar o pedido.”  
**Comece por:** Método JPN.  
**Entrada mínima:** objetivo, público/contexto conhecido, restrições conhecidas e saída desejada.  
**Saída esperada:** especificação mais clara de Jornada, Precisão e Narrativa.  
**Próximo passo opcional:** JPN Prompt Builder se for útil montar o rascunho de forma guiada.  
**Pare se:** fatos centrais, condição comercial ou restrição material estiverem desconhecidos ou conflitantes.

### UC-02 — Montar um prompt guiado a partir de contexto real

**Situação:** atendimento, análise, automação, código, conteúdo ou estratégia com informações já fornecidas.  
**Comece por:** JPN Prompt Builder.  
**Entrada mínima:** ideia/tarefa, tipo de uso e restrições que não podem ser perdidas.  
**Saída esperada:** rascunho JPN estruturado, preservando contexto e pendências explícitas.  
**Limite atual:** QA físico contextual em celular ainda pendente; a camada contextual é candidata e não representa compreensão semântica universal.  
**Pare se:** o estado estrutural não for válido ou se uma lacuna material estiver sendo convertida em fato.

### UC-03 — Responder melhor a um cliente sem inventar condições

**Situação:** cliente pergunta por produto, disponibilidade, condição, prazo ou alternativa.  
**Comece por:** Método JPN ou template adequado do JPN Prompt Pack.  
**Entrada mínima:** pedido do cliente + fatos comerciais confirmados.  
**Saída esperada:** mensagem clara, orientada ao próximo passo, distinguindo o que é confirmado do que precisa ser consultado.  
**Próximo passo opcional:** JPN Business quando esse atendimento precisar virar processo repetível.  
**Pare se:** preço, estoque, prazo, política, desconto ou forma de pagamento não estiverem confirmados.

### UC-04 — Repetir uma tarefa sem recomeçar do zero

**Situação:** a mesma categoria de tarefa aparece com frequência.  
**Comece por:** JPN Prompt Pack.  
**Entrada mínima:** escolha do template PP-* mais próximo + adaptação dos fatos, restrições e critérios do caso atual.  
**Saída esperada:** estrutura reutilizável com menos retrabalho.  
**Pare se:** o template estiver forçando dados que não existem ou se a tarefa exigir uma decisão especializada sem base suficiente.

### UC-05 — Transformar uma rotina em processo operacional

**Situação:** lead → proposta, solicitação → handoff, reunião → registro, conteúdo → revisão, ou outra rotina com várias etapas.  
**Comece por:** JPN Business.  
**Entrada mínima:** objetivo do processo, responsáveis/papéis quando conhecidos, entradas, decisões, saídas e critérios de conclusão.  
**Saída esperada:** playbook revisável com passos, validação, riscos, continuidade e regra de parada.  
**Próximo passo opcional:** Gestão Fácil quando houver necessidade real de acompanhar registros da operação.  
**Pare se:** a execução exigir gasto, publicação, compromisso externo, aceite legal ou dado sensível não autorizado.

### UC-06 — Organizar uma pequena operação em planilha

**Situação:** acompanhar clientes, oportunidades/vendas, tarefas, estoque e registros financeiros operacionais.  
**Comece por:** JPN Gestão Fácil.  
**Entrada mínima:** estrutura operacional da empresa e dados não sensíveis necessários ao acompanhamento.  
**Saída esperada:** registros organizados e indicadores operacionais do modelo.  
**Limite atual:** GF-QA-10 multiplataforma permanece pendente no mesmo XLSX candidato.  
**Importante:** `REPOR` é alerta operacional; não é autorização automática de compra. A planilha não substitui contabilidade, conciliação bancária nem validação profissional.  
**Pare se:** o uso exigir credenciais, dados bancários sensíveis, decisão contábil/fiscal ou compra automática.

### UC-07 — Preparar conteúdo para redes sociais sem publicar

**Situação:** transformar uma ideia em post, roteiro, legenda ou briefing visual.  
**Comece por:** Método JPN ou Prompt Pack; use o sistema de artes apenas como fonte interna de design.  
**Entrada mínima:** objetivo, público, formato, mensagem central, fatos confirmados e restrições de marca.  
**Saída esperada:** copy/briefing candidato e, quando aplicável, fonte visual editável.  
**Pare se:** houver claim de resultado não comprovado, preço/condição não confirmados ou se o próximo passo for publicação/anúncio sem autorização.

### UC-08 — Criar uma automação interna de baixo risco

**Situação:** descrever um fluxo de automação, integração ou procedimento técnico sem executar ação externa.  
**Comece por:** Prompt Builder ou Prompt Pack; evolua para Business se virar processo recorrente.  
**Entrada mínima:** gatilho, entradas, transformações, saída, exceções e limites.  
**Saída esperada:** especificação ou prompt técnico revisável.  
**Pare se:** a automação puder gastar dinheiro, publicar, enviar mensagens, apagar dados, alterar produção ou exigir credenciais sem autorização.

### UC-09 — Documentar uma reunião ou decisão

**Situação:** transformar notas soltas em registro acionável.  
**Comece por:** Prompt Pack.  
**Entrada mínima:** notas/fatos da reunião e decisões explicitamente confirmadas.  
**Saída esperada:** resumo, decisões, responsáveis quando confirmados, pendências e próximos passos.  
**Próximo passo opcional:** JPN Business para incorporar o resultado a uma base operacional.  
**Pare se:** responsabilidade, prazo ou decisão estiver sendo inferida sem confirmação.

### UC-10 — Preparar uma proposta ou material comercial interno

**Situação:** organizar argumentos, benefícios, limites e próximos passos antes de uma conversa comercial.  
**Comece por:** Método JPN + Prompt Pack.  
**Entrada mínima:** produto correto, público, fatos verificáveis, limites reais e condição comercial confirmada quando aplicável.  
**Saída esperada:** material candidato coerente com o estado real do produto.  
**Pare se:** o texto introduzir garantia de resultado, urgência artificial, desconto inexistente, depoimento inventado ou estado de QA/release que não existe.

### UC-11 — Decidir qual produto JPN usar

**Situação:** existe um problema, mas ainda não está claro qual recurso é suficiente.  
**Comece por:** seletor/comparação interna do ecossistema.  
**Roteamento:**
- estruturar pensamento/tarefa → Método JPN;
- montar rascunho guiado → Prompt Builder;
- reutilizar estrutura pronta → Prompt Pack;
- operacionalizar rotina → JPN Business;
- acompanhar registros da pequena operação → Gestão Fácil;
- considerar conjunto integrado → Pro Kit somente quando houver necessidade real dos componentes e seus gates estiverem liberados.

**Pare se:** a escolha estiver sendo guiada apenas pela abrangência do produto. O JPN Pro Kit não é recomendação automática por ser mais completo.

### UC-12 — Combinar produtos sem criar bundle comercial

**Situação:** uma necessidade evoluiu e outro recurso passou a ser útil.  
**Rotas possíveis:**
- Método JPN → Prompt Builder;
- Método JPN → Prompt Pack;
- Prompt Pack → JPN Business;
- JPN Business → Gestão Fácil.

Essas são **rotas de trabalho, não bundles, descontos ou ofertas**.

## Checklist antes de usar qualquer caso

1. O problema real está descrito sem inventar contexto?
2. Os fatos materiais estão confirmados?
3. Está claro o que é inferência, desconhecido ou conflito?
4. O menor recurso suficiente foi escolhido?
5. O estado atual de QA/release do produto foi preservado?
6. A próxima ação continua reversível e interna?
7. Nenhum gasto, publicação, anúncio, aceite legal ou dado sensível foi autorizado implicitamente?

## Regra de parada

Interrompa e registre a pendência quando:

- houver fato material ausente ou conflitante;
- a próxima etapa exigir gasto, anúncio, publicação, checkout, criação de conta ou compromisso externo;
- houver necessidade de credencial, dado financeiro real ou informação sensível desnecessária;
- o produto depender de QA ainda pendente para a afirmação pretendida;
- uma decisão especializada exigir validação profissional;
- a saída estiver transformando suposição em fato ou prometendo resultado não comprovado.

## Estado dos componentes citado nesta versão

- JPN Prompt Builder: QA físico contextual em celular pendente.
- JPN Gestão Fácil: GF-QA-10 multiplataforma pendente.
- JPN Pro Kit: `EM PREPARAÇÃO`; não é recomendação automática por abrangência.
- Materiais comerciais desta superfície: internos, não publicados e sem autorização transacional.
