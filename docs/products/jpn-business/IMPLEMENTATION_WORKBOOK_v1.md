# JPN Business — Implementation Workbook v1

Status: **candidate companion / operational QA pending**

Este workbook transforma os 12 playbooks do JPN Business em uma implantação pequena, controlada e verificável. Ele não substitui o documento principal `JPN_BUSINESS_v1.md`, não cria automações externas, não publica conteúdo, não define preço, não autoriza compra e não declara resultado comercial.

## 1. Regra de implantação

Use **um processo real por vez**. Antes de adotar um playbook:

1. confirme o problema e o responsável;
2. escolha o menor playbook que resolva a etapa atual;
3. execute primeiro com dados fictícios ou sanitizados quando houver risco;
4. revise a saída antes de qualquer ação externa;
5. registre o que funcionou, o que falhou e o próximo ajuste;
6. só amplie a rotina quando houver evidência suficiente.

**Regra de parada:** se faltar contexto, autorização, dado essencial ou responsável claro, interrompa a execução e registre a lacuna. Não complete lacunas por suposição.

## 2. Mapa dos 12 playbooks

| ID | Processo | Categoria | Quando testar |
|---|---|---|---|
| JB-01 | Entrada e triagem de novo lead | Comercial | quando contatos chegam sem padrão de registro |
| JB-02 | Follow-up comercial responsável | Comercial | quando retornos ficam esquecidos ou inconsistentes |
| JB-03 | Qualificação sem inventar necessidade | Comercial | quando é preciso entender contexto antes de ofertar |
| JB-04 | Preparação de proposta sem definir condição não autorizada | Comercial | quando uma proposta precisa ser estruturada sem inventar preço, prazo ou condição |
| JB-05 | Atendimento e resolução de solicitação | Atendimento | quando pedidos de clientes precisam de triagem e resposta consistente |
| JB-06 | Escalonamento e handoff interno | Operações | quando uma solicitação passa de uma pessoa ou área para outra |
| JB-07 | Planejamento de conteúdo comercial | Marketing | quando a equipe precisa organizar temas e peças sem publicar automaticamente |
| JB-08 | Planejamento de campanha sem publicação automática | Marketing | quando uma campanha precisa ser preparada e revisada antes de qualquer veiculação |
| JB-09 | Criação e manutenção de SOP | Operações | quando uma tarefa recorrente precisa virar procedimento |
| JB-10 | Reunião com decisão e plano de ação | Gestão | quando reuniões terminam sem decisão, dono ou próximo passo |
| JB-11 | Base de conhecimento operacional | Conhecimento | quando respostas e procedimentos ficam dispersos |
| JB-12 | Revisão semanal operacional | Gestão | quando a pequena empresa precisa revisar pendências e prioridades com cadência |

## 3. Diagnóstico inicial de 15 minutos

Preencha sem dados sensíveis.

- Processo que mais gera retrabalho: ______________________________
- Resultado esperado da rotina, sem promessa numérica: ______________________________
- Responsável pela revisão humana: ______________________________
- Frequência atual: diária / semanal / sob demanda / inexistente
- Onde as informações estão hoje: ______________________________
- Maior risco de erro: ______________________________
- Ação externa que exige aprovação antes de executar: ______________________________

### Escolha inicial

Marque apenas uma frente:

- [ ] novos leads — JB-01
- [ ] follow-up — JB-02
- [ ] qualificação — JB-03
- [ ] proposta — JB-04
- [ ] atendimento — JB-05
- [ ] handoff — JB-06
- [ ] conteúdo — JB-07
- [ ] campanha — JB-08
- [ ] procedimento — JB-09
- [ ] reunião — JB-10
- [ ] conhecimento — JB-11
- [ ] revisão semanal — JB-12

## 4. Ciclo de implantação em 7 movimentos

Os movimentos podem ser executados em dias diferentes; “7” representa a sequência, não uma promessa de implantação em sete dias.

### Movimento 1 — Delimitar

Defina um processo, uma entrada e uma saída.

- Entrada: ______________________________
- Saída esperada: ______________________________
- O que fica fora do escopo: ______________________________

### Movimento 2 — Preparar contexto

Liste apenas o contexto necessário.

- fatos confirmados: ______________________________
- regras internas aplicáveis: ______________________________
- restrições: ______________________________
- dados que não devem ser usados: ______________________________

### Movimento 3 — Executar em modo seguro

Use exemplo fictício/sanitizado antes de aplicar em caso real quando houver risco operacional, reputacional, financeiro ou de privacidade.

- cenário de teste: ______________________________
- playbook usado: ______________________________
- Prompt Pack relacionado: ______________________________

### Movimento 4 — Revisar

- a saída inventou informação? sim / não
- há ação externa embutida? sim / não
- precisa de autorização humana? sim / não
- o tom e o formato estão adequados? sim / não
- existe informação faltante? sim / não

### Movimento 5 — Ajustar

- contexto a acrescentar: ______________________________
- regra a reforçar: ______________________________
- trecho a simplificar: ______________________________
- risco a bloquear: ______________________________

### Movimento 6 — Documentar

Registre a versão mínima da rotina:

- responsável: ______________________________
- gatilho de início: ______________________________
- passos: ______________________________
- revisão obrigatória: ______________________________
- condição de parada: ______________________________

### Movimento 7 — Decidir próximo passo

Escolha uma opção:

- [ ] manter como teste manual
- [ ] repetir mais uma vez com outro exemplo fictício
- [ ] liberar uso interno com revisão humana
- [ ] transformar em SOP com JB-09
- [ ] registrar conhecimento recorrente com JB-11
- [ ] incluir na revisão semanal com JB-12
- [ ] parar e corrigir antes de continuar

## 5. Fichas rápidas por playbook

### JB-01 — Entrada e triagem de novo lead

**Entrada mínima:** origem do contato, pedido declarado e canal.

**Saída mínima:** registro estruturado + próximo passo sugerido.

**Não fazer:** presumir orçamento, urgência, perfil ou intenção que o contato não informou.

**Ligação com Prompt Pack:** PP-06, PP-07.

### JB-02 — Follow-up comercial responsável

**Entrada mínima:** última interação, pendência e prazo conhecido.

**Saída mínima:** mensagem de retorno revisável + motivo do contato.

**Não fazer:** criar urgência artificial, insistência automática ou promessa.

**Ligação com Prompt Pack:** PP-06.

### JB-03 — Qualificação sem inventar necessidade

**Entrada mínima:** contexto declarado e lacunas relevantes.

**Saída mínima:** perguntas objetivas para compreender a necessidade.

**Não fazer:** conduzir a pessoa a uma necessidade que ela não demonstrou.

**Ligação com Prompt Pack:** PP-07.

### JB-04 — Preparação de proposta sem definir condição não autorizada

**Entrada mínima:** escopo confirmado, itens conhecidos e condições fornecidas por fonte autorizada.

**Saída mínima:** estrutura de proposta com lacunas destacadas.

**Não fazer:** inventar preço, desconto, prazo, condição, estoque ou disponibilidade.

**Ligação com Prompt Pack:** PP-03, PP-09.

### JB-05 — Atendimento e resolução de solicitação

**Entrada mínima:** pedido do cliente, histórico relevante e política aplicável.

**Saída mínima:** entendimento da solicitação + resposta ou encaminhamento.

**Não fazer:** afirmar resolução que ainda depende de outra área.

**Ligação com Prompt Pack:** PP-07.

### JB-06 — Escalonamento e handoff interno

**Entrada mínima:** situação, ações já tentadas, pendência e responsável de destino.

**Saída mínima:** handoff curto, rastreável e sem perda de contexto.

**Não fazer:** repassar credenciais, dados financeiros ou informação sensível desnecessária.

**Ligação com Prompt Pack:** PP-18.

### JB-07 — Planejamento de conteúdo comercial

**Entrada mínima:** objetivo editorial, público e fatos permitidos.

**Saída mínima:** pauta/roteiro candidato para revisão.

**Não fazer:** publicar, agendar ou declarar resultado esperado como fato.

**Ligação com Prompt Pack:** PP-08, PP-09.

### JB-08 — Planejamento de campanha sem publicação automática

**Entrada mínima:** objetivo, canais considerados, materiais disponíveis e restrições.

**Saída mínima:** plano candidato com checklist de aprovação.

**Não fazer:** comprar mídia, publicar anúncio, aceitar termos de plataforma ou definir orçamento financeiro real.

**Ligação com Prompt Pack:** PP-08, PP-09.

### JB-09 — Criação e manutenção de SOP

**Entrada mínima:** processo observado, responsáveis, entradas, saídas e exceções.

**Saída mínima:** procedimento versionado e revisável.

**Não fazer:** documentar suposição como regra oficial.

**Ligação com Prompt Pack:** PP-11.

### JB-10 — Reunião com decisão e plano de ação

**Entrada mínima:** notas da reunião ou pauta confirmada.

**Saída mínima:** decisões, responsáveis, prazos informados e pendências.

**Não fazer:** atribuir decisão, responsável ou prazo que não foi acordado.

**Ligação com Prompt Pack:** PP-10, PP-17.

### JB-11 — Base de conhecimento operacional

**Entrada mínima:** conteúdo validado e fonte interna identificável.

**Saída mínima:** entrada de conhecimento curta, categorizada e revisável.

**Não fazer:** incluir segredos, credenciais, dados financeiros reais ou informação sem origem confiável.

**Ligação com Prompt Pack:** PP-16.

### JB-12 — Revisão semanal operacional

**Entrada mínima:** pendências, decisões, riscos e ações da semana.

**Saída mínima:** prioridades, responsáveis e itens que permanecem bloqueados.

**Não fazer:** transformar alerta em autorização automática de compra, publicação ou gasto.

**Ligação com Prompt Pack:** PP-04, PP-10, PP-17.

## 6. Registro de teste

Use uma linha por execução.

| Data | Playbook | Cenário | Resultado revisado | Falha encontrada | Ajuste | Próximo passo |
|---|---|---|---|---|---|---|
| ____ | JB-__ | fictício/sanitizado | ____ | ____ | ____ | ____ |
| ____ | JB-__ | fictício/sanitizado | ____ | ____ | ____ | ____ |
| ____ | JB-__ | fictício/sanitizado | ____ | ____ | ____ | ____ |

## 7. Critério mínimo para uso interno recorrente

Antes de repetir um playbook em rotina interna, confirme:

- [ ] processo e responsável definidos;
- [ ] entrada mínima conhecida;
- [ ] condição de parada documentada;
- [ ] revisão humana definida quando necessária;
- [ ] nenhuma credencial ou dado financeiro real no material de teste;
- [ ] nenhuma ação externa automática não autorizada;
- [ ] nenhuma promessa de resultado incorporada ao processo;
- [ ] pelo menos um teste fictício/sanitizado revisado;
- [ ] falhas relevantes registradas e corrigidas;
- [ ] próximo passo explícito.

## 8. Integração com outros produtos JPN

O workbook não obriga o uso de todo o ecossistema.

- **Método JPN:** use quando o problema é estruturar melhor a instrução antes de operacionalizar.
- **JPN Prompt Builder:** use quando vale montar e reutilizar contexto de forma guiada; o QA físico contextual em celular permanece pendente no estado atual do produto.
- **JPN Prompt Pack:** use os templates relacionados quando eles reduzirem trabalho sem substituir contexto específico.
- **JPN Gestão Fácil:** use para acompanhamento operacional quando fizer sentido; GF-QA-10 permanece pendente e `REPOR` é alerta, não autorização de compra.
- **JPN Pro Kit:** permanece `EM PREPARAÇÃO` e não deve ser escolhido automaticamente por ser mais abrangente.

## 9. Estado e limites

Este material é um **candidato de implementação interna**. Ele pode apoiar treinamento, QA e implantação controlada, mas não representa:

- publicação;
- oferta comercial ativa;
- autorização de venda;
- autorização de gasto;
- automação externa;
- aceite de termos legais;
- compatibilidade final aprovada;
- garantia de resultado.

A validação humana dos fluxos reais continua necessária antes de tratar qualquer rotina como operacionalmente aprovada.
