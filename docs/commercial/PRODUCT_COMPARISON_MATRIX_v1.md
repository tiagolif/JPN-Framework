# JPN — Matriz de comparação de produtos v1

**Estado:** candidate companion / commercial QA pending  
**Uso:** interno; não publicado; sem preço, checkout, coleta de dados ou promessa de resultado.

## Objetivo

Oferecer uma comparação lado a lado dos seis produtos JPN para reduzir sobreposição de posicionamento e ajudar a escolher o menor escopo que resolva a necessidade atual.

Esta matriz não substitui diagnóstico, revisão humana, documentação canônica de cada produto nem validações de release. A fonte estruturada desta comparação é `PRODUCT_COMPARISON_MATRIX_v1.json` e as sequências entre produtos devem seguir `PRODUCT_USAGE_ROUTES_v1.json`.

## Regra principal

> Escolha o menor produto que resolva a necessidade atual e pare quando a necessidade estiver resolvida.

O **JPN Pro Kit não é a recomendação automática** por ser mais abrangente. Ele permanece condicionado ao encerramento de seus gates finais.

## Matriz

| Produto | Melhor para | Comece quando | Evite quando | Saída principal |
|---|---|---|---|---|
| Método JPN | aprender a estruturar pedidos para IA | a necessidade ainda está ambígua ou é preciso aprender o raciocínio | a tarefa já está clara e um modelo pronto resolve | pedido estruturado + critérios de revisão |
| JPN Prompt Pack | executar a partir de modelos reutilizáveis | o objetivo já está claro e falta um ponto de partida | é preciso primeiro entender o problema ou desenhar um processo | prompt adaptado |
| JPN Prompt Builder | montar prompts com estrutura consistente | há valor em padronizar campos e montagem, inclusive entre pessoas | a necessidade é aprendizagem ou gestão operacional | prompt montado localmente |
| JPN Business | padronizar atividades empresariais recorrentes | uma atividade precisa virar processo repetível | a necessidade é apenas um prompt pontual ou só registrar controles | playbook + rotina + prompts de apoio |
| JPN Gestão Fácil | organizar controles operacionais básicos | clientes, vendas, tarefas ou estoque precisam de acompanhamento simples | a necessidade exige ERP, contabilidade, fiscal, banco ou integrações avançadas | visão gerencial básica + alertas |
| JPN Pro Kit | reunir componentes finais do ecossistema | somente após os artefatos componentes e gates finais estarem concluídos | houver dependências abertas ou um produto isolado já for suficiente | pacote integrado de entrega |

## Diferenças que não podem se perder

### Método JPN × Prompt Pack

- **Método JPN** ensina a estruturar o pedido.
- **Prompt Pack** oferece modelos para acelerar a execução.
- Quem já sabe exatamente o que precisa pode começar pelo Pack; quem ainda precisa organizar contexto, objetivo e restrições tende a começar pelo Método.

### Prompt Pack × Prompt Builder

- **Prompt Pack** parte de templates recorrentes já preparados.
- **Prompt Builder** conduz a montagem por campos explícitos e ajuda a manter consistência.
- O Pack não exige o Builder para funcionar, e o Builder não deve ser apresentado como biblioteca de templates.

### JPN Business × Gestão Fácil

- **JPN Business** organiza como executar um processo.
- **Gestão Fácil** organiza como registrar e acompanhar parte da operação.
- Um playbook pode funcionar sem planilha; a planilha pode ser suficiente sem playbook adicional.

### Produtos individuais × Pro Kit

- O Pro Kit só faz sentido quando existe necessidade real de vários componentes.
- Abrangência, por si só, não é justificativa comercial.
- Enquanto os gates finais estiverem pendentes, a rota do Pro Kit permanece apenas arquitetural.

## Rotas canônicas de trabalho

Estas relações descrevem fluxo de uso, não bundles, descontos ou ofertas:

1. **Aprender:** Método JPN → Prompt Pack → Prompt Builder.
2. **Executar:** Prompt Pack → Prompt Builder.
3. **Operar:** JPN Business → Prompt Pack → Prompt Builder → Gestão Fácil.
4. **Gerir:** Gestão Fácil → JPN Business.
5. **Conjunto:** JPN Pro Kit, apenas quando seus gates finais estiverem concluídos; enquanto isso, a rota é arquitetural.

Em qualquer rota, pare assim que o produto atual já resolver a necessidade.

## Guardrails comerciais

- Não incluir preço até existir decisão comercial autorizada.
- Não incluir checkout, formulário, captura de lead, analytics ou URL externa nesta superfície.
- Não prometer resultado, ROI, lucro, economia, produtividade garantida ou compatibilidade não validada.
- Não promover GF-QA-10, QA móvel, PDF final, freeze ou release para `passed` sem evidência correspondente.
- Não apresentar `REPOR` na Gestão Fácil como autorização automática de compra.
- Gestão Fácil não substitui contabilidade, banco, fiscal, ERP ou auditoria.
- Não sugerir o Pro Kit apenas por ser o produto mais amplo.

## Regra de parada

Interromper a recomendação e retornar à necessidade do usuário quando:

- não estiver claro qual problema precisa ser resolvido primeiro;
- houver dependência de validação ainda pendente;
- a decisão depender de condição comercial, técnica ou legal não confirmada;
- a comparação estiver sendo usada para induzir compra por abrangência em vez de adequação.

## Próxima evidência necessária

Antes de qualquer uso público desta matriz: revisão editorial humana, inspeção visual da superfície derivada, navegação por teclado quando aplicável e confirmação de que estados de QA/release continuam sincronizados com as fontes canônicas.
