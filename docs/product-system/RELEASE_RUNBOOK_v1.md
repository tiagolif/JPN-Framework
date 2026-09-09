# JPN — Release Runbook v1

Status: **interno / não autoriza publicação**

Este runbook transforma o estado formal de release em uma sequência operacional reproduzível. Ele não substitui `PRODUCT_RELEASE_STATUS_v1.json` nem `RELEASE_EXECUTION_PLAN_v1.json`; apenas define ordem, comandos, critérios de parada e evidências mínimas.

## Regras de execução

1. Nunca promover uma dependência para `passed` sem a evidência exigida no contrato.
2. Nunca tratar candidato interno, staging, preview, relatório ou hash intermediário como artefato final.
3. Revisões humanas continuam humanas; gates mecânicos só comprovam o que conseguem verificar.
4. QA em navegador, planilha ou suíte externa exige execução real no ambiente indicado.
5. CI precisa estar associado ao SHA que será congelado.
6. Freeze vem antes dos hashes finais. Após calcular hashes finais, qualquer alteração de binário invalida o manifesto correspondente.
7. Nenhuma etapa deste runbook autoriza preço, checkout, venda, anúncio, publicação, coleta de dados financeiros, criação de conta externa ou aceite legal.

## Fase 0 — Consistência local

Objetivo: garantir que contratos, produtos, páginas, fila operacional e gates conhecidos continuam coerentes antes de gerar candidatos.

Comando principal:

```bash
npm run build
```

O build inclui `npm run check:release-action-queue`, que confirma que o snapshot versionado em `reports/product-readiness/RELEASE_ACTION_QUEUE.md` ainda corresponde ao portfólio, ao status formal e ao plano de execução. Esse gate não executa as ações da fila nem promove qualquer dependência.

O build também inclui `npm run check:prompt-builder-context-regressions`. Esse gate protege regressões determinísticas descobertas durante o teste real do Prompt Builder, incluindo preservação de contexto confirmado, restrições informadas e adaptação da Narrativa ao tipo de tarefa. Ele não comprova compreensão semântica universal e não substitui QA real em navegador/dispositivo.

Critério de parada: qualquer erro interrompe o fluxo. Não avançar para freeze enquanto o build estiver vermelho ou a fila registrada estiver desatualizada.

Evidência mínima: saída do build sem falhas no mesmo estado de código que será usado para produzir candidatos.

## Fase 1 — Candidatos editoriais

Objetivo: gerar staging imprimível e PDFs candidatos sem promovê-los como finais.

```bash
npm run build:editorial-print
npm run check:editorial-print-staging
npm run export:editorial-pdfs
npm run review:editorial-pdfs
npm run check:editorial-pdf-review
```

Documentos canônicos cobertos pela revisão PDF:

- Método JPN;
- JPN Prompt Pack;
- JPN Business;
- manual da JPN Gestão Fácil;
- Leia Primeiro do JPN Pro Kit.

Critério de parada: ausência de motor de PDF/renderização, hash divergente, página faltante, preview extra ou falha de integridade.

O comando `npm run check:editorial-pdf-review` aponta para `scripts/check-editorial-pdf-review.mjs` e confirma correspondência técnica PDF → manifesto → páginas renderizadas → galeria. O alias npm é parte do contrato operacional para evitar divergência entre documentação e execução. Esse gate **não aprova visualmente** clipping, margens, tipografia, acentos, links, legibilidade ou paginação.

## Fase 2 — Inspeção editorial e visual

Objetivo: revisar manualmente o estado exato identificado pelos hashes/digests do candidato.

Checklist mínimo por documento:

- leitura editorial completa;
- ortografia e acentuação;
- hierarquia de títulos;
- ausência de texto cortado ou sobreposto;
- margens e quebras coerentes;
- tabelas e listas legíveis;
- links e referências coerentes;
- páginas vazias somente quando intencionais;
- confirmação do hash/digest do candidato revisado.

Critério de parada: qualquer correção altera o candidato e exige regeneração, novo hash e nova inspeção.

## Fase 3 — JPN Prompt Builder

Objetivo: validar regras contextuais e o bundle offline antes do congelamento.

```bash
npm run check:prompt-builder-context-regressions
npm run check:prompt-builder-staging
npm run stage:prompt-builder
```

O gate de regressão contextual deve passar antes do staging. Ele cobre casos determinísticos `PB-CTX-*` derivados de cenários de vendas, análise, automação, desenvolvimento, conteúdo e estratégia. Em especial, o caso real de atendimento do guarda-roupa impede que contexto já fornecido seja rebaixado para `Estado atual: Não informado` e impede que restrições digitadas sejam perdidas.

Depois, executar QA real em navegador/dispositivo sobre o mesmo bundle candidato. Conferir abertura por servidor HTTP local, criação e edição de prompts, presets, workspaces, recuperação, persistência, clipboard, teclado virtual, orientação de tela e comportamento offline planejado.

Critério de parada: erro funcional, regressão contextual, divergência entre fonte e staging, falha de navegador/dispositivo ou ausência de evidência vinculada ao mesmo bundle candidato.

Não marcar `pacote-offline-final` como `passed` apenas porque os gates determinísticos ou o staging foram executados. A inspeção móvel real continua obrigatória.

## Fase 4 — JPN Gestão Fácil

Objetivo: executar GF-QA-10 sobre **o mesmo XLSX candidato** usando somente dados fictícios.

Ambientes exigidos:

- Microsoft Excel;
- LibreOffice Calc;
- Google Sheets.

Verificar abertura, fórmulas, formatação, filtros, validações, gráficos e comportamento esperado nas três suítes.

Critério de parada: qualquer divergência material exige correção e reinício do GF-QA-10 para o novo binário.

Somente após GF-QA-10 aprovado o XLSX pode ser candidato a `arquivo-final-validado`.

## Fase 5 — JPN Pro Kit

Objetivo: consolidar somente dependências já aprovadas.

```bash
npm run check:pro-kit
npm run check:pro-kit-manifest
npm run stage:pro-kit
npm run check:pro-kit-staging
```

Critério de parada: qualquer dependência individual ainda pendente, arquivo ausente, hash intermediário tratado como final ou divergência no manifesto.

O Pro Kit não pode antecipar o freeze dos produtos que contém.

## Fase 6 — Freeze e hashes finais

Pré-condições obrigatórias:

- revisões editoriais/visuais aplicáveis concluídas;
- GF-QA-10 aprovado para Gestão Fácil;
- QA real do Prompt Builder concluído;
- dependências do Pro Kit prontas;
- build local verde.

Sequência:

1. selecionar os binários aprovados;
2. congelar o conjunto;
3. não editar os binários congelados;
4. calcular SHA-256 dos artefatos finais;
5. registrar os hashes no manifesto correspondente;
6. verificar reprodução dos hashes antes de qualquer promoção de status.

Critério de parada: qualquer alteração após o hash exige novo freeze e novos hashes.

## Fase 7 — CI do SHA definitivo

Objetivo: exigir CI real associado ao SHA que representa o conjunto congelado.

Evidência mínima:

- SHA identificado;
- execução verificável de CI para esse SHA;
- conclusão verde.

Sem CI verde no SHA definitivo, dependências `ci-final` continuam pendentes.

## Fase 8 — Atualização de status e fila

Somente depois da evidência real, atualizar `PRODUCT_RELEASE_STATUS_v1.json` de forma granular. Cada `passed` deve apontar para evidência verificável correspondente.

Depois da alteração de status:

```bash
npm run check:product-release-status
npm run check:release-execution-plan
npm run report:release-action-queue
npm run check:release-action-queue
npm run check:product-readiness-report
npm run report:release-readiness
```

`report:release-action-queue` regenera o snapshot operacional a partir das fontes canônicas; `check:release-action-queue` garante que o arquivo versionado é exatamente o resultado esperado para aquele estado. Regenerar a fila não aprova nenhuma dependência e não substitui a evidência declarada no plano.

Não promover em bloco por inferência. Uma dependência aprovada não aprova automaticamente as demais.

## O que permanece fora deste runbook

Este documento não autoriza nem executa:

- publicação pública;
- anúncio pago ou orgânico;
- venda, checkout ou cobrança;
- definição de preço;
- aceite de termos legais;
- criação de contas que exijam identidade;
- uso de dados financeiros reais;
- uso de credenciais de terceiros.

Qualquer uma dessas ações exige autorização explícita separada.
