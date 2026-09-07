# JPN — Relatório agregado de prontidão v1

## Objetivo

Transformar o contrato de portfólio e o registro de status de release em uma visão agregada, determinística e auditável dos seis produtos JPN.

O relatório é gerado por `scripts/report-product-readiness.mjs` a partir de:

- `docs/product-system/PRODUCT_PORTFOLIO_v1.json`;
- `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json`.

A saída versionada fica em `reports/product-readiness/PORTFOLIO_READINESS.md`.

## Comandos

- `npm run report:product-readiness` regenera o relatório.
- `npm run check:product-readiness-report` compara o relatório versionado com o estado atual dos contratos e falha se houver divergência.

O check deve rodar no build principal para impedir que alterações em dependências ou status deixem a visão agregada desatualizada.

## Como a prontidão é calculada

Para cada produto, o denominador inclui todas as dependências cujo status não seja `not-applicable`. O numerador inclui somente dependências com status `passed`.

`prontidão = passed / dependências aplicáveis`

A porcentagem é arredondada para o inteiro mais próximo. Um produto só aparece como `Pronto = Sim` quando possui ao menos uma dependência aplicável e todas elas estão em `passed`.

A mesma regra é aplicada ao portfólio completo.

## Evidência continua sendo obrigatória

Este relatório não promove estados. Ele apenas lê o registro de release. O gate `check:product-release-status` continua responsável por rejeitar um item `passed` sem evidência válida.

Portanto, gerar novamente o relatório nunca é suficiente para aprovar uma dependência.

## Limites de interpretação

A porcentagem não representa qualidade, probabilidade de venda, retorno financeiro, precisão da IA, aceitação de mercado ou conformidade jurídica. Ela mede somente a conclusão documentada das dependências registradas no contrato de release.

Revisões editoriais humanas, inspeções visuais, compatibilidade entre aplicativos e CI final continuam dependentes das evidências específicas definidas para cada produto.

## Guardrails operacionais

A geração ou atualização deste relatório não autoriza publicação, anúncio, venda, checkout, contratação de serviço, criação de conta externa, aceite de termos ou uso de dados financeiros reais.
