# JPN Framework — Comece aqui

> Documento interno de orientação de uso. Não é página de venda, não autoriza publicação e não altera estado de release.

## Para que este guia existe

O ecossistema JPN tem seis produtos com papéis diferentes. Este guia reduz duas fontes de confusão: usar um produto maior do que a necessidade pede e misturar estado de desenvolvimento com disponibilidade comercial.

A regra principal é simples:

**comece pelo menor produto suficiente para resolver a necessidade atual.**

## Escolha rápida

| Se você precisa… | Comece por | Papel |
| --- | --- | --- |
| aprender a estruturar pedidos melhores para IA | **Método JPN** | fundamento metodológico |
| partir de modelos reutilizáveis | **JPN Prompt Pack** | biblioteca aplicada de prompts |
| montar, revisar e reutilizar prompts de forma guiada | **JPN Prompt Builder** | ferramenta local de estruturação |
| aplicar rotinas e playbooks em pequena empresa | **JPN Business** | aplicação empresarial |
| organizar clientes, vendas, tarefas, estoque e controle gerencial | **JPN Gestão Fácil** | planilha operacional |
| receber o conjunto integrado | **JPN Pro Kit** | pacote do ecossistema, somente após freeze/validação dos componentes |

## As cinco rotas de uso

### 1. Aprender → aplicar → estruturar

**Método JPN → Prompt Pack → Prompt Builder**

Use quando a pessoa ainda precisa aprender a lógica JPN e depois transformar esse raciocínio em execução repetível.

Pare no Método se ele já resolver a necessidade. O Prompt Pack e o Builder são continuações possíveis, não etapas obrigatórias.

### 2. Executar com ponto de partida pronto

**Prompt Pack → Prompt Builder**

Use quando o problema já está claro e um template ajuda a começar mais rápido. O Builder só entra quando houver ganho real em organizar, revisar ou reutilizar o prompt.

### 3. Operar uma rotina empresarial

**JPN Business → Prompt Pack → Prompt Builder → Gestão Fácil**

Use quando uma pequena empresa precisa sair de uma necessidade recorrente para uma rotina operacional. O Business orienta o playbook; o Prompt Pack e o Builder apoiam a execução; a Gestão Fácil pode acompanhar a rotina quando fizer sentido.

Essa sequência é modular. Não existe obrigação de usar todos os produtos.

### 4. Organizar a gestão

**Gestão Fácil → JPN Business**

Use quando a necessidade principal é organização operacional. A planilha pode ser suficiente sozinha. O Business entra apenas quando a empresa precisar formalizar um processo em playbook.

A Gestão Fácil é um controle gerencial básico. Não substitui contabilidade, banco, obrigações fiscais ou auditoria.

### 5. Usar o conjunto integrado

**JPN Pro Kit**

O Pro Kit representa a entrega integrada do ecossistema, mas não deve ser tratado como release final enquanto seus componentes ainda tiverem bloqueios canônicos.

No estado atual do projeto, esta rota é apenas arquitetural. Ela não é uma oferta pública e não autoriza venda, anúncio, checkout ou publicação.

## Como decidir sem sobrecarregar o usuário

Faça três perguntas internas:

1. A pessoa precisa **aprender**, **executar**, **operar** ou **organizar**?
2. Qual é o menor artefato capaz de resolver isso agora?
3. Há algum motivo concreto para adicionar outro produto?

Se a resposta da terceira pergunta for “não”, pare no produto atual.

## Fronteiras entre os produtos

### Método JPN vs. Prompt Pack

O Método ensina a estrutura. O Prompt Pack oferece pontos de partida já organizados. O Pack não substitui a compreensão do método quando a situação exige adaptação profunda.

### Prompt Pack vs. Prompt Builder

O Pack é conteúdo reutilizável. O Builder é ferramenta. Não use o Builder apenas porque ele existe; use quando houver necessidade de montagem guiada, revisão ou reutilização estruturada.

### JPN Business vs. Gestão Fácil

O Business organiza **como executar processos**. A Gestão Fácil ajuda a **acompanhar a operação**. Nenhum dos dois é sistema contábil ou fiscal.

### Pro Kit vs. produtos individuais

O Pro Kit é o conjunto. Ele não deve ser o ponto de partida automático. Um produto individual continua sendo preferível quando resolve sozinho a necessidade.

## Estado de desenvolvimento não é disponibilidade

Os contratos canônicos continuam em:

- `docs/product-system/PRODUCT_PORTFOLIO_v1.json`
- `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json`

Enquanto uma dependência estiver `pending`, `in-progress` ou `blocked`, ela continua aberta. A ausência de erro mecânico não transforma revisão humana, QA físico ou compatibilidade em `passed`.

Este documento não modifica esses estados.

## Guardrails

- sem preço, checkout, desconto ou escassez;
- sem promessa de ROI, vendas ou desempenho;
- sem publicação automática;
- sem inferir aprovação humana;
- sem criar bundle comercial a partir das rotas;
- sem exigir dados financeiros reais;
- sem registrar senhas, tokens ou credenciais em materiais de exemplo.

## Fonte estruturada

As rotas deste guia são espelhadas em `PRODUCT_USAGE_ROUTES_v1.json` para permitir validação automatizada e uso por futuras superfícies internas sem duplicar lógica editorial.
