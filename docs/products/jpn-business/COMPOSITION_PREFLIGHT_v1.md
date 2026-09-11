# JPN Business — Preflight de composição v1

## Objetivo

Adicionar uma camada automática antes da diagramação/PDF candidato do JPN Business. O preflight verifica se a fonte editorial está estruturalmente pronta para ser composta, sem confundir esse resultado com aprovação visual, editorial humana, PDF final ou release.

## O que o gate verifica

O script `scripts/check-jpn-business-composition-preflight.mjs` valida:

1. presença das seções obrigatórias da `COMPOSITION_SPEC_v1.md`;
2. exatamente 12 playbooks canônicos no `BUSINESS_INDEX.json`;
3. exatamente 18 templates canônicos no índice do JPN Prompt Pack;
4. presença única dos cabeçalhos `JB-01` a `JB-12` em `JPN_BUSINESS_v1.md`;
5. presença, em cada playbook, dos campos editoriais obrigatórios: processo, resultado, responsável, entradas, restrições, passos, pontos de decisão, saída, validação, continuidade, riscos e bloco JPN;
6. referências `PP-*` válidas e existentes no Prompt Pack;
7. ausência de padrões comerciais/claims bloqueados, incluindo ROI garantido, garantia de vendas, alegação de eliminação de alucinações, claims absolutos de 100% e valores monetários em real;
8. preservação explícita do estado `in-progress` da composição até a inspeção humana completa.

## Integração

O preflight foi encadeado em `scripts/check-jpn-business-links.mjs`. Assim, ele participa do mesmo gate de consistência JPN Business ↔ Prompt Pack já usado pelo build principal, sem criar uma segunda trilha de verdade.

## Estado que este preflight pode comprovar

Quando passa, o resultado significa apenas:

`READY_FOR_COMPOSITION_PREP`

Isto é: a fonte editorial e seus vínculos possuem estrutura suficiente para preparar um candidato diagramado.

## Estado que este preflight não pode comprovar

Ele **não** aprova:

- `diagramacao-final`;
- revisão editorial humana;
- legibilidade real do PDF;
- paginação, margens ou hierarquia visual;
- ausência de overflow/cortes em render final;
- compatibilidade de leitores de PDF;
- `pdf-final`;
- freeze;
- manifesto/hashes finais;
- release ou publicação.

Esses itens continuam sujeitos aos gates humanos e de freeze definidos no contrato canônico de release.

## Relação com o pacote de revisão humana

O `HUMAN_REVIEW_PACKET.md` continua sendo a fila operacional para a inspeção humana. Este preflight reduz o risco de enviar ao revisor um candidato com falha estrutural óbvia, mas não substitui a revisão página a página exigida pela `COMPOSITION_SPEC_v1.md`.

## Guardrails

- não adicionar preço, checkout ou CTA transacional para contornar o estado de preparação;
- não registrar dados financeiros reais, credenciais ou dados pessoais desnecessários;
- não converter ausência de erro automático em claim de eficácia;
- não alterar dependências canônicas para `passed` sem a evidência explicitamente exigida;
- não publicar o material como oferta ativa a partir deste preflight.
