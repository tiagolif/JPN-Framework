# JPN — Matriz de comparação de produtos v1

**Estado:** candidate companion / commercial QA pending  
**Uso:** interno; não publicado; sem preço, checkout, coleta de dados ou promessa de resultado.

## Objetivo

Oferecer uma comparação lado a lado dos seis produtos JPN para reduzir sobreposição de posicionamento e ajudar a escolher o menor escopo que resolva a necessidade atual.

Esta matriz não substitui diagnóstico, revisão humana, documentação canônica de cada produto nem validações de release.

## Regra principal

> Escolha o menor produto que resolva a necessidade atual.

O **JPN Pro Kit não é a recomendação automática** por ser mais abrangente. Ele permanece **EM PREPARAÇÃO** enquanto os gates finais não forem concluídos.

## Matriz

| Produto | Problema principal | Forma de uso | Entregável central | Melhor quando | Não usar como atalho para | Estado/limite relevante |
|---|---|---|---|---|---|---|
| Método JPN | Pedidos à IA mal estruturados | Método de raciocínio e revisão | Estrutura Jornada · Precisão · Narrativa | Aprender a organizar contexto, objetivo, restrições e critérios | Automatizar execução ou substituir validação especializada | Revisão editorial/visual final ainda pendente |
| JPN Prompt Builder | Ideia solta que precisa virar prompt guiado | Ferramenta local guiada | Prompt JPN revisável | Conduzir preenchimento e manter lacunas visíveis | Alegar compreensão semântica universal ou dispensar QA humano | QA físico contextual em celular ainda pendente |
| JPN Prompt Pack | Tarefas recorrentes sem ponto de partida consistente | Biblioteca de templates | 18 templates PP-01..PP-18 | Reutilizar estruturas já preparadas e adaptar ao contexto | Tratar template como resposta pronta sem revisão | Revisão editorial/visual final ainda pendente |
| JPN Business | Processos de negócio pouco estruturados | Playbooks operacionais | 12 playbooks JB-01..JB-12 | Organizar entradas, passos, decisões, saídas, validação e continuidade | Executar ações externas irreversíveis ou assumir condições comerciais | PDF/QA visual final ainda pendente |
| JPN Gestão Fácil | Rotina de pequena empresa dispersa | Planilha operacional | XLSX com 8 abas, fórmulas e dashboard | Acompanhar cadastro, vendas, estoque, tarefas e financeiro operacional | Contabilidade, conciliação bancária ou autorização automática de compra | GF-QA-10 multiplataforma ainda pendente |
| JPN Pro Kit | Necessidade real de reunir vários componentes | Pacote integrado | Conjunto de produtos e materiais | Quando múltiplos componentes são necessários e seus gates estiverem concluídos | Vender abrangência quando um produto individual basta | **EM PREPARAÇÃO**; sem preço, checkout, reserva ou promessa comercial |

## Diferenças que não podem ser apagadas

### Método JPN × Prompt Builder

- **Método JPN** ensina e documenta a estrutura.
- **Prompt Builder** operacionaliza um fluxo guiado.
- Um não deve ser descrito como substituto integral do outro.

### Prompt Builder × Prompt Pack

- **Builder** parte da ideia/contexto do usuário e conduz a estruturação.
- **Prompt Pack** parte de templates recorrentes já preparados.
- O Pack não deve ser apresentado como ferramenta dinâmica; o Builder não deve ser apresentado como biblioteca de 18 templates.

### Prompt Pack × JPN Business

- **Prompt Pack** organiza prompts reutilizáveis.
- **Business** organiza processos em playbooks mais amplos, podendo referenciar templates do Pack.
- Um template não equivale a um processo completo.

### JPN Business × Gestão Fácil

- **Business** define como o trabalho deve acontecer.
- **Gestão Fácil** ajuda a acompanhar parte da rotina operacional em planilha.
- A planilha não executa playbooks automaticamente e não substitui contabilidade.

### Produtos individuais × Pro Kit

- O Pro Kit só faz sentido quando existe necessidade real de vários componentes.
- Abrangência, por si só, não é justificativa comercial.
- Enquanto os gates finais estiverem pendentes, o Pro Kit deve permanecer como **EM PREPARAÇÃO**.

## Combinações de trabalho permitidas

Estas relações descrevem fluxo de uso, não bundles, descontos ou ofertas:

1. **Método JPN → Prompt Builder** — aprender a estrutura e depois aplicá-la em fluxo guiado.
2. **Método JPN → Prompt Pack** — compreender os campos e reutilizar templates com critério.
3. **Prompt Pack → JPN Business** — usar templates dentro de processos mais amplos quando houver vínculo canônico.
4. **JPN Business → Gestão Fácil** — estruturar o processo e acompanhar parte da execução em planilha quando fizer sentido.

## Guardrails comerciais

- Não incluir preço até existir decisão comercial autorizada.
- Não incluir checkout, formulário, captura de lead, analytics ou URL externa nesta superfície.
- Não prometer resultado, ROI, lucro, economia, produtividade garantida ou compatibilidade não validada.
- Não promover GF-QA-10, QA móvel, PDF final, freeze ou release para `passed` sem evidência correspondente.
- Não apresentar `REPOR` na Gestão Fácil como autorização automática de compra.
- Não sugerir o Pro Kit apenas por ser o produto mais amplo.

## Regra de parada

Interromper a recomendação e retornar à necessidade do usuário quando:

- não estiver claro qual problema precisa ser resolvido primeiro;
- houver dependência de validação ainda pendente;
- a decisão depender de condição comercial, técnica ou legal não confirmada;
- a comparação estiver sendo usada para induzir compra por abrangência em vez de adequação.

## Próxima evidência necessária

Antes de qualquer uso público desta matriz: revisão editorial humana, inspeção visual desktop/mobile da página derivada, navegação por teclado e confirmação de que estados de QA/release continuam sincronizados com as fontes canônicas.
