# JPN — Fila priorizada de ações de release v1

## Objetivo

Transformar o contrato de status e o plano de execução em uma fila operacional determinística, permitindo identificar o próximo trabalho útil sem confundir prioridade com aprovação, nem ação disponível com pré-requisito satisfeito.

## Fontes canônicas

A fila é derivada exclusivamente de:

- `docs/product-system/PRODUCT_PORTFOLIO_v1.json`;
- `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json`;
- `docs/product-system/RELEASE_EXECUTION_PLAN_v1.json`.

O relatório gerado é `reports/product-readiness/RELEASE_ACTION_QUEUE.md`.

## Como gerar

```bash
node scripts/report-release-action-queue.mjs
```

Para verificar se a versão registrada continua sincronizada com as fontes:

```bash
node scripts/report-release-action-queue.mjs --check
```

## Ordenação

Os itens ativos são ordenados por:

1. prioridade (`P0` antes de `P1`, depois `P2`/`P3` se existirem);
2. estado, colocando `in-progress` antes de `pending`;
3. ordem canônica dos produtos no portfólio;
4. ordem das dependências no contrato de release.

Itens `passed` e `not-applicable` não aparecem na fila ativa.

## Leitura correta

`can_run_without_new_authorization: true` significa somente que a ação não exige uma nova autorização do proprietário do projeto. Isso não elimina pré-requisitos técnicos, inspeções humanas, ambiente externo ou CI real.

Da mesma forma, `autonomous-local` não significa “execute imediatamente”. Freeze e hashes, por exemplo, continuam condicionados à aprovação das dependências anteriores do próprio produto.

## Estado observado nesta versão

O snapshot atual contém 14 itens ativos: 1 em andamento e 13 pendentes. Destes, 3 são classificados como `autonomous-local`, 7 requerem inspeção humana, 2 ambiente externo e 2 CI real. Nenhum item ativo exige autorização explícita adicional segundo o plano atual.

Esse resumo é informativo; a fonte de verdade continua sendo o relatório regenerado pelo script.

## Guardrails

A fila nunca deve:

- preencher hash final antes do freeze real;
- promover revisão humana por check mecânico;
- promover GF-QA-10 sem abrir o mesmo XLSX nas três suítes declaradas;
- promover QA de navegador/dispositivo sem execução real;
- promover CI sem referência ao SHA correspondente;
- autorizar publicação, anúncio, venda ou checkout;
- exigir uso de dados financeiros reais, credenciais, criação de conta externa ou aceite legal.

## Relação com outros relatórios

`PORTFOLIO_READINESS.md` responde “quanto do contrato está aprovado?”.

`RELEASE_ACTION_QUEUE.md` responde “qual trabalho aberto vem primeiro e que tipo de evidência ele exige?”.

`dist/release-readiness/RELEASE_READINESS.*` permanece específico ao preflight do JPN Pro Kit e não é substituído por esta fila.
