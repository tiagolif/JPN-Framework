# Higiene Editorial dos Produtos Centrais v1

## Escopo

Este gate cobre somente os três documentos centrais do ecossistema JPN:

- Método JPN;
- JPN Prompt Pack;
- JPN Business.

Ele existe para impedir regressões objetivas antes da revisão humana final e da diagramação.

## O que é validado automaticamente

O comando `npm run check:core-editorial-hygiene` verifica:

1. ausência de tabulações em texto editorial;
2. ausência de espaços finais acidentais;
3. ausência de blocos com espaçamento anômalo;
4. ausência de placeholders editoriais bloqueados como `TBD`, `TODO`, `FIXME`, `[preencher]`, `[inserir]` e `<placeholder>`;
5. ausência de títulos H1/H2 literalmente duplicados dentro do mesmo produto;
6. ausência de parágrafos longos literalmente duplicados dentro do mesmo produto;
7. presença dos termos canônicos Jornada, Precisão e Narrativa em todos os três produtos.

## O que o gate não valida

Este comando não substitui revisão humana. Ele não decide:

- se uma frase soa natural;
- se uma explicação está longa demais;
- se exemplos fictícios ficaram repetitivos em significado sem serem literalmente iguais;
- se a hierarquia visual do PDF está adequada;
- se a promessa comercial está persuasiva;
- se um argumento metodológico está empiricamente comprovado.

## Regra editorial

Automação deve bloquear apenas problemas objetivos e reproduzíveis. Questões de estilo, clareza e tom continuam dependendo de revisão editorial consciente.

## Relação com os demais gates

Este gate complementa, sem substituir:

- `check:product-consistency`;
- `check:jpn-business-links`;
- `check:commercial-copy`;
- `check:editorial-release`;
- revisão humana dos PDFs candidatos.

## Critério de aprovação

A aprovação deste gate significa apenas que os três documentos passaram pelas verificações mecânicas acima. Não significa que estejam diagramados, publicados, comercialmente aprovados ou validados por benchmark de eficácia.
