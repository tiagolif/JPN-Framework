# JPN Prompt Pack — Workbook de Seleção e Adaptação v1

> Estado: `candidate companion / editorial and operational QA pending`
>
> Fonte canônica: `JPN_PROMPT_PACK_v1.md` + `PROMPT_INDEX.json`
>
> Objetivo: ajudar a escolher, adaptar, testar e registrar o uso de um dos 18 templates do Prompt Pack sem transformar a escolha em automação, autorização externa ou promessa de resultado.

## Princípio central

Use o menor template suficiente para a tarefa atual. Não encadeie vários prompts apenas porque eles estão disponíveis. Comece com uma necessidade concreta, preserve fatos confirmados, exponha lacunas e pare quando faltar autorização ou evidência material.

## Fluxo de uso

1. Classifique a tarefa.
2. Escolha um template candidato.
3. Faça o teste de aderência.
4. Preencha Jornada, Precisão e Narrativa.
5. Registre fatos, inferências, desconhecidos e conflitos.
6. Execute apenas dentro do escopo autorizado.
7. Revise a saída.
8. Decida: reutilizar, adaptar, trocar de template ou parar.

## Folha 1 — Classificação da tarefa

Preencha antes de escolher um template.

- **Objetivo real:**
- **Pessoa que usará a saída:**
- **Formato esperado:**
- **Prazo confirmado:**
- **Restrições confirmadas:**
- **O que não deve acontecer:**
- **Há ação externa envolvida?** sim / não
- **Há gasto, compra ou contratação?** sim / não
- **Há dado pessoal, credencial ou informação sensível?** sim / não
- **Há preço, estoque, desconto, condição comercial ou disponibilidade?** sim / não
- **Há decisão jurídica, médica, financeira, tributária, contábil ou especializada?** sim / não

Se alguma resposta exigir autorização, fonte ou especialista que não esteja disponível, registre a pendência antes de continuar.

## Folha 2 — Mapa de escolha dos 18 templates

| ID | Template | Sinal principal de uso |
|---|---|---|
| PP-01 | Pedido vago → plano executável | transformar solicitação ampla em objetivo, etapas e critérios |
| PP-02 | Pesquisa verificável | responder com fontes, datas, evidências e rastreabilidade |
| PP-03 | Comparador de alternativas | comparar opções usando critérios explícitos |
| PP-04 | Resumo com continuidade | resumir preservando decisões, contexto e pendências |
| PP-05 | Reescrita controlada | alterar texto sem inventar fatos ou perder requisitos |
| PP-06 | Follow-up responsável | retomar conversa sem urgência artificial |
| PP-07 | Atendimento → diagnóstico e próximo passo | entender necessidade ou causa antes de propor ação |
| PP-08 | Conteúdo social sem invenção comercial | criar conteúdo preservando condições confirmadas |
| PP-09 | Oferta sem condições inventadas | estruturar oferta sem presumir preço, estoque ou prazo |
| PP-10 | Ata operacional JPN | converter reunião em decisões e responsáveis rastreáveis |
| PP-11 | Notas → SOP | converter notas em processo repetível |
| PP-12 | Análise de dados com escopo explícito | analisar dados sem extrapolar período, cobertura ou causalidade |
| PP-13 | Debug estruturado | investigar problema técnico por hipótese e evidência |
| PP-14 | Feature → plano de implementação | decompor funcionalidade em escopo, riscos e aceite |
| PP-15 | Code review orientado a risco | revisar código priorizando impacto e regressão |
| PP-16 | Conhecimento operacional reutilizável | documentar conhecimento recorrente com contexto e limites |
| PP-17 | Decisão com trade-offs explícitos | decidir exibindo vantagens, custos, riscos e incertezas |
| PP-18 | Handoff JPN | transferir trabalho sem perder estado e pendências |

## Folha 3 — Teste de aderência

Para o template candidato, responda:

- [ ] Ele resolve o objetivo principal sem ampliar o escopo?
- [ ] A entrada mínima necessária está disponível?
- [ ] O formato de saída é compatível com a tarefa?
- [ ] Os riscos relevantes conseguem ser explicitados?
- [ ] A tarefa pode ser interrompida antes de qualquer ação externa não autorizada?
- [ ] Há um critério claro para dizer que a resposta ficou suficiente?

Se houver 2 ou mais respostas negativas, reavalie a escolha antes de executar.

## Folha 4 — Adaptação JPN

### Jornada

- **Objetivo:**
- **Ponto de partida:**
- **Etapas necessárias:**
- **Dependências:**
- **Próximo passo seguro:**

### Precisão

- **Fatos confirmados:**
- **Inferências permitidas:**
- **Desconhecidos:**
- **Conflitos:**
- **Fontes/evidências necessárias:**
- **Critérios de aceitação:**

### Narrativa

- **Público:**
- **Tom:**
- **Formato:**
- **Ordem da resposta:**
- **Nível de detalhe:**
- **Itens que precisam ficar visíveis:**

## Folha 5 — Política de confiança

Classifique informação relevante como:

- `confirmed`: explicitamente fornecida ou verificada;
- `inferred`: conclusão razoável, mas não confirmada diretamente;
- `unknown`: informação ainda ausente;
- `conflicting`: fontes ou entradas discordam materialmente.

Nunca transforme `inferred`, `unknown` ou `conflicting` em `confirmed` apenas para completar o prompt.

## Folha 6 — Registro do teste

- **Data do teste:**
- **Template:** PP-__
- **Cenário:** fictício / sanitizado / real autorizado
- **Objetivo:**
- **Entrada usada:**
- **Saída esperada:**
- **Resultado observado:**
- **Fato inventado?** sim / não
- **Escopo ampliado sem pedido?** sim / não
- **Pendência escondida?** sim / não
- **Exigiu ação externa?** sim / não
- **Exigiu validação humana?** sim / não
- **Próximo passo:** reutilizar / adaptar / trocar / parar

## Folha 7 — Diagnóstico de falha

Se o resultado não ficou bom, marque a causa dominante:

- [ ] template inadequado;
- [ ] objetivo mal definido;
- [ ] contexto insuficiente;
- [ ] fato tratado como certeza sem evidência;
- [ ] conflito não explicitado;
- [ ] restrição omitida;
- [ ] formato de saída inadequado;
- [ ] critério de aceitação ausente;
- [ ] narrativa inadequada ao público;
- [ ] tarefa exigia outro recurso além do Prompt Pack.

Corrija a causa antes de simplesmente aumentar o prompt.

## Folha 8 — Reutilização responsável

Um template adaptado pode virar referência interna quando:

- foi testado em mais de um cenário semelhante;
- o objetivo permaneceu estável;
- entradas e saídas estão claramente documentadas;
- fatos e inferências continuam distinguíveis;
- existe revisão humana adequada ao risco;
- existe condição de parada;
- não depende de preço, prazo, estoque, autorização ou dado que muda silenciosamente.

Reutilização não significa execução automática nem autorização para publicar, enviar, comprar, contratar ou alterar contas.

## Combinações mínimas sugeridas

Use combinações somente quando uma segunda etapa resolver um problema novo e explícito.

- `PP-01 → PP-03`: estruturar uma necessidade e depois comparar alternativas.
- `PP-02 → PP-17`: pesquisar e depois decidir com trade-offs.
- `PP-07 → PP-06`: diagnosticar atendimento e depois fazer follow-up.
- `PP-10 → PP-11`: registrar reunião e depois transformar decisões em processo.
- `PP-13 → PP-14 → PP-15`: investigar falha, planejar correção e revisar implementação.
- `PP-16 → PP-18`: documentar conhecimento e depois transferir continuidade.

Não trate essas combinações como fluxo obrigatório, pacote comercial ou promessa de desempenho.

## Regras de parada

Pare antes da próxima ação quando houver:

- preço, estoque, desconto, prazo, condição comercial ou disponibilidade não confirmados;
- publicação, envio externo, compra, contratação, exclusão ou alteração de conta sem autorização explícita;
- aceite de termos legais ou compromisso em nome de outra pessoa;
- credencial, segredo, dado financeiro real ou informação sensível desnecessária;
- conflito entre fontes que altere materialmente a conclusão;
- decisão jurídica, médica, financeira, tributária, contábil ou especializada sem base adequada;
- criação de conta que exija verificação de identidade;
- requisito técnico material sendo presumido como fato.

## Exercícios fictícios

### EX-PP-01 — Pedido vago

Entrada: “preciso organizar o atendimento da empresa”.

Objetivo: usar `PP-01` para transformar a solicitação em objetivo, escopo, perguntas essenciais, etapas e critério de conclusão, sem inventar software, orçamento ou prazo.

### EX-PP-02 — Pesquisa comparável

Entrada: “compare duas ferramentas para uma pequena empresa”.

Objetivo: usar `PP-02` para definir quais fatos precisam de fonte e `PP-03` para comparar somente após os critérios estarem explícitos.

### EX-PP-03 — Oferta incompleta

Entrada: “faça uma mensagem oferecendo este produto”, sem preço ou estoque confirmados.

Objetivo: usar `PP-09` mantendo preço, estoque e condição como pendências, sem preencher valores por suposição.

### EX-PP-04 — Processo recorrente

Entrada: notas fictícias de uma reunião semanal.

Objetivo: usar `PP-10`, depois `PP-11`, preservando decisões, responsáveis fictícios, pendências e condição de parada.

### EX-PP-05 — Continuidade

Entrada: resumo fictício de trabalho interrompido.

Objetivo: usar `PP-04` e `PP-18` para manter decisões, estado atual, riscos e próximos passos sem declarar como concluído o que ainda está pendente.

## Checklist final

- [ ] O template escolhido é o menor recurso suficiente?
- [ ] Jornada, Precisão e Narrativa estão explícitas?
- [ ] `confirmed`, `inferred`, `unknown` e `conflicting` foram respeitados?
- [ ] Nenhum preço, prazo, estoque, fonte, resultado ou condição foi inventado?
- [ ] A saída preserva pendências e conflitos relevantes?
- [ ] Nenhuma ação externa foi executada implicitamente?
- [ ] Existe condição clara de parada e próximo passo?

## Limites e estado

Este workbook é um material candidato de apoio. Ele não substitui `JPN_PROMPT_PACK_v1.md`, `PROMPT_INDEX.json`, QA humano ou revisão editorial/visual final. Não comprova eficácia, aumento de vendas, redução de custo, superioridade de modelo ou compatibilidade universal.

Os 18 templates continuam sendo a estrutura canônica do Prompt Pack. Revisão ortográfica fina, revisão visual/PDF, freeze, checksum final e evidência de CI do head definitivo permanecem pendentes até execução e evidência próprias.

O QA físico contextual do JPN Prompt Builder em celular continua pendente. `GF-QA-10` da Gestão Fácil continua pendente, e `REPOR` continua sendo apenas alerta operacional, nunca autorização automática de compra. O JPN Pro Kit permanece `EM PREPARAÇÃO`.