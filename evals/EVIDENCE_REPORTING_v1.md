# JPN — Protocolo de relatório de evidências v1

## Objetivo

Transformar um arquivo `*.score.json` produzido pelo scorer oficial em um relatório legível, auditável e conservador, sem promover automaticamente diferenças observadas a claims comerciais.

## Fluxo

1. executar uma rodada real mantendo modelo e parâmetros equivalentes entre baseline e JPN;
2. preservar as respostas brutas;
3. concluir a avaliação humana cega;
4. executar `npm run eval:score -- <resultados.json>`;
5. executar `npm run eval:report -- <resultados.score.json>`;
6. revisar manualmente limitações, anotações e contexto antes de qualquer uso externo.

## Estados

### `incomplete-round`

É aplicado quando faltam pares baseline/JPN ou notas de utilidade humana cega. O relatório pode ser usado somente como diagnóstico interno.

### `complete-for-this-round`

É aplicado quando todos os casos presentes estão pareados e possuem nota humana. Esse estado significa apenas que a rodada está completa segundo o contrato atual. Não significa eficácia geral comprovada.

## Linguagem permitida

O relatório pode usar formulações como:

- “nesta rodada, foi observada diferença de X pontos percentuais”;
- “no dataset e configuração registrados, JPN apresentou menor contagem de retrabalho”;
- “não houve diferença observada nesta métrica”.

## Linguagem proibida sem evidência adicional

Não converter uma rodada isolada em frases como:

- “JPN é melhor que prompts comuns”;
- “JPN reduz alucinações” como afirmação geral;
- “JPN aumenta vendas/ROI/produtividade”;
- “JPN elimina erros”;
- “resultado comprovado” sem definir população, método e replicação.

## Requisitos para futura evidência mais forte

Antes de considerar claims externos quantitativos, exigir no mínimo:

- múltiplas rodadas independentes;
- diversidade maior de tarefas e domínios;
- modelos/configurações documentados;
- avaliação cega reproduzível;
- resultados negativos e neutros preservados;
- definição prévia da métrica usada no claim;
- revisão separada entre evidência técnica e copy comercial.

## Relação com os produtos JPN

Método JPN, Prompt Pack, JPN Business, Prompt Builder e Pro Kit podem citar a existência do protocolo de avaliação. Até haver evidência suficiente, não devem transformar o protocolo ou uma rodada isolada em promessa de resultado.

## Guardrail

O gerador de relatório não chama modelos, APIs, serviços pagos, contas externas ou dados financeiros. Ele apenas lê um arquivo de score local e produz Markdown.