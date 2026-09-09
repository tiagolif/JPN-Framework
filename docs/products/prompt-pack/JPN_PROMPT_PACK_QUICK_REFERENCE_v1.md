# JPN Prompt Pack — Referência Rápida Operacional v1

> Estado: `candidate companion / editorial and visual QA pending`
>
> Fonte canônica: `JPN_PROMPT_PACK_v1.md` + `PROMPT_INDEX.json`
>
> Esta referência reduz o tempo de escolha e aplicação dos templates. Ela não substitui o conteúdo completo, os exemplos, o QA editorial ou a revisão humana.

## Como usar em 60 segundos

1. Identifique o tipo de tarefa real.
2. Escolha o template mais próximo no mapa abaixo.
3. Preencha somente fatos confirmados.
4. Marque inferências, lacunas e conflitos em vez de escondê-los.
5. Defina restrições e critérios de aceitação antes de executar.
6. Revise a saída e registre o próximo passo.

## Mapa dos 18 templates

| ID | Template | Use quando... |
|---|---|---|
| PP-01 | Pedido vago → plano executável | a solicitação ainda está ampla e precisa virar etapas, critérios e próximos passos |
| PP-02 | Pesquisa verificável | a resposta depende de fontes, datas, evidências e rastreabilidade |
| PP-03 | Comparador de alternativas | é preciso comparar opções com critérios explícitos e trade-offs |
| PP-04 | Resumo com continuidade | o objetivo é resumir sem perder decisões, pendências e contexto útil |
| PP-05 | Reescrita controlada | um texto precisa mudar de tom, formato ou tamanho sem perder fatos importantes |
| PP-06 | Follow-up responsável | é preciso retomar uma conversa sem inventar urgência ou pressionar indevidamente |
| PP-07 | Atendimento → diagnóstico e próximo passo | o atendimento precisa descobrir causa, necessidade ou informação faltante antes de avançar |
| PP-08 | Conteúdo social sem invenção comercial | é preciso criar conteúdo de marketing preservando fatos e condições confirmadas |
| PP-09 | Oferta sem condições inventadas | a comunicação comercial envolve produto ou proposta, mas preço, estoque ou condição não podem ser presumidos |
| PP-10 | Ata operacional JPN | uma reunião precisa virar decisões, responsáveis, prazos e pendências rastreáveis |
| PP-11 | Notas → SOP | notas soltas precisam virar um processo repetível com etapas, exceções e validação |
| PP-12 | Análise de dados com escopo explícito | dados precisam ser analisados sem extrapolar cobertura, período, métrica ou causalidade |
| PP-13 | Debug estruturado | um problema técnico precisa ser investigado por sintomas, hipóteses, testes e evidências |
| PP-14 | Feature → plano de implementação | uma funcionalidade precisa virar escopo, dependências, riscos, aceite e sequência de implementação |
| PP-15 | Code review orientado a risco | código precisa ser revisado priorizando impacto, regressão, segurança e manutenção |
| PP-16 | Conhecimento operacional reutilizável | conhecimento recorrente precisa ser registrado para consulta futura sem perder contexto e limites |
| PP-17 | Decisão com trade-offs explícitos | há uma decisão relevante e as vantagens, custos, riscos e incertezas precisam ficar visíveis |
| PP-18 | Handoff JPN | trabalho ou responsabilidade precisa passar para outra pessoa ou agente sem perda de estado e pendências |

## Roteamento por área

### Estruturação e decisão
- Pedido ainda vago: `PP-01`
- Comparar alternativas: `PP-03`
- Decidir com trade-offs: `PP-17`

### Pesquisa, documentação e continuidade
- Pesquisa com fontes: `PP-02`
- Resumo que preserve continuidade: `PP-04`
- Conhecimento reutilizável: `PP-16`
- Handoff entre pessoas/agentes: `PP-18`

### Comunicação, vendas e atendimento
- Reescrever conteúdo existente: `PP-05`
- Fazer follow-up: `PP-06`
- Diagnosticar no atendimento: `PP-07`
- Criar conteúdo social: `PP-08`
- Estruturar oferta sem inventar condição: `PP-09`

### Operações
- Registrar reunião: `PP-10`
- Transformar notas em SOP: `PP-11`

### Dados e tecnologia
- Analisar dados: `PP-12`
- Diagnosticar bug: `PP-13`
- Planejar feature: `PP-14`
- Revisar código: `PP-15`

## Combinações úteis

- Ideia vaga → decisão: `PP-01` → `PP-03` ou `PP-17`
- Pesquisa → decisão documentada: `PP-02` → `PP-17` → `PP-04`
- Lead → atendimento → follow-up → oferta: `PP-07` → `PP-06` → `PP-09`
- Reunião → processo → handoff: `PP-10` → `PP-11` → `PP-18`
- Bug → implementação → revisão: `PP-13` → `PP-14` → `PP-15`
- Conteúdo → revisão controlada: `PP-08` → `PP-05`
- Conhecimento → continuidade: `PP-16` → `PP-18`

## Regra de parada

Pare e peça confirmação quando a próxima etapa depender materialmente de:

- preço, estoque, desconto, prazo, condição comercial ou disponibilidade não confirmados;
- dado pessoal, credencial, segredo, informação financeira ou conteúdo sensível que não seja necessário para a tarefa;
- ação externa irreversível, publicação, envio, compra, exclusão, aceite legal ou mudança de conta sem autorização explícita;
- conflito entre fontes que altere a conclusão;
- decisão jurídica, médica, financeira ou especializada sem base suficiente;
- requisito, arquitetura, dado ou comportamento técnico que esteja sendo apenas presumido.

## Checklist antes de executar qualquer template

- [ ] O objetivo está explícito?
- [ ] O contexto confirmado foi separado de inferências?
- [ ] As lacunas que realmente importam estão visíveis?
- [ ] Restrições e limites foram definidos?
- [ ] Critérios de aceitação estão claros?
- [ ] A saída esperada e o formato foram definidos?
- [ ] Não há preço, dado, prazo, fonte, resultado ou condição inventados?
- [ ] A próxima ação está clara e é reversível/autorizada quando necessário?

## Checklist depois da resposta

- [ ] A resposta atende ao objetivo sem ampliar o escopo silenciosamente?
- [ ] Fatos, inferências, conflitos e desconhecidos continuam distinguíveis?
- [ ] As pendências relevantes foram preservadas?
- [ ] Há algo que exige validação humana ou fonte externa antes de uso?
- [ ] O próximo passo está suficientemente claro para continuidade ou handoff?

## Limites desta referência

Esta referência não comprova superioridade de modelo, não garante resultado, não substitui o `JPN_PROMPT_PACK_v1.md`, não autoriza publicação ou venda e não promove o produto para release final.

Revisão ortográfica fina, revisão visual/PDF, formatos finais, freeze, checksum final e evidência de CI do head definitivo continuam pendentes até execução e evidência próprias.
