# JPN Prompt Builder — handoff de QA humano v1

Estado: **preparado para execução humana · nenhuma aprovação inferida**

## Objetivo

Unificar em um único pacote operacional os testes que já eram explicitamente humanos no Prompt Builder: o QA contextual em celular real e o QA físico/assistivo. O pacote transforma requisitos dispersos em itens registráveis, sem tentar substituir evidência física por checker estático.

## Fontes canônicas

- `CONTEXT_AWARE_MOBILE_QA_v1.md`: define os casos `PB-CTX-01..06` e mantém o resultado como `pending human mobile inspection`.
- `ACCESSIBILITY_BASELINE_v1.md`: define a baseline estática e lista oito validações que exigem teclado, leitor de tela, zoom/reflow, estados dinâmicos, importação, celular real e entendimento humano.
- `PRODUCT_RELEASE_STATUS_v1.json`: mantém `qa-fisico-contextual-celular` em `pending`.

## Escopo consolidado

`HUMAN_QA_SCOPE_v1.json` contém 14 verificações:

- 6 verificações móveis/contextuais `PB-HQA-M01..M06`;
- 8 verificações físico/assistivas `PB-HQA-A01..A08`.

Todos os itens começam obrigatoriamente em `PENDING`. Um checker verde apenas comprova que o pacote está estruturalmente coerente com as fontes e com o contrato de release.

## Gerador

Execute:

```bash
node scripts/build-prompt-builder-human-qa-handoff.mjs --check
```

para validar o escopo sem gerar artefatos.

Execute:

```bash
node scripts/build-prompt-builder-human-qa-handoff.mjs
```

para gerar em `dist/prompt-builder-human-qa/`:

- `HUMAN_QA_PACKET.md` — roteiro preenchível de revisão;
- `human-qa-state.json` — estado estruturado inicial com 14 pendências.

## Evidência esperada

Cada item só pode sair de `PENDING` quando houver evidência correspondente ao teste real. O registro deve conter, no mínimo, resultado, evidência, revisor, data e observações suficientes para reproduzir o contexto do teste.

Para a trilha móvel, a evidência deve identificar o aparelho/navegador ou contexto físico equivalente e o caso `PB-CTX-*` executado. Para a trilha assistiva, a evidência deve identificar a combinação realmente usada quando aplicável, como navegador + leitor de tela, navegação por teclado ou zoom/reflow.

## Regra de promoção

O script não altera `PRODUCT_RELEASE_STATUS_v1.json`. Mesmo que todos os itens sejam preenchidos posteriormente, a promoção de `qa-fisico-contextual-celular` exige revisão deliberada das evidências e atualização separada do contrato canônico.

Não usar ausência de erro mecânico, build verde, inspeção estática do HTML ou existência deste pacote como prova de acessibilidade, compatibilidade assistiva ou experiência móvel aprovada.

## Limites e guardrails

Esta etapa não congela o pacote offline final, não aprova `ci-final`, não autoriza release/publicação e não cria claims de conformidade WCAG. Nenhum gasto, anúncio, checkout, criação de conta, uso de dados financeiros, credencial ou aceite legal é necessário ou autorizado por este fluxo.
