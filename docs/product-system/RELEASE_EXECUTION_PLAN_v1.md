# JPN — Plano executável de release v1

Este documento descreve como transformar as dependências formais de `PRODUCT_RELEASE_STATUS_v1.json` em próximas ações verificáveis sem promover nenhum status por inferência.

## Objetivo

O repositório já possui contratos de produto, status formais de release, relatórios de prontidão, gates mecânicos, staging e candidatos internos. A lacuna coberta por este plano era operacional: cada dependência precisava ter uma próxima ação, um tipo de execução e uma evidência mínima de conclusão.

O arquivo canônico é `RELEASE_EXECUTION_PLAN_v1.json`. O Markdown explica sua leitura; não substitui o JSON.

## Modos de execução

- `autonomous-local`: pode ser executado localmente quando suas dependências anteriores estiverem satisfeitas.
- `requires-human-inspection`: exige leitura, inspeção visual ou julgamento humano real.
- `requires-external-environment`: exige ambiente que não pode ser simulado pelo gate local, como Excel/LibreOffice/Google Sheets ou navegador/dispositivo final.
- `requires-ci`: exige execução de CI associada ao SHA candidato.
- `requires-explicit-authorization`: reservado para qualquer ação que ultrapasse os guardrails atuais, como publicação ou ação comercial externa.

## Prioridade atual

Os itens `P0` concentram as evidências que destravam o maior número de entregáveis: diagramação/PDF do JPN Business, QA final do Prompt Builder, GF-QA-10, freeze/hashes do Pro Kit e CI definitivo. Itens `P1` são revisões editoriais e PDFs dos produtos de conteúdo.

A prioridade não altera a regra de evidência: um item P0 continua pendente até que seu critério de conclusão exista de fato.

## Relação com o status formal

O plano deve cobrir exatamente todas as dependências presentes em `PRODUCT_RELEASE_STATUS_v1.json`. Se uma dependência for adicionada, removida ou renomeada, `npm run check:release-execution-plan` falhará até que o plano seja atualizado.

O gate também exige:

- chave única por `produto::dependência`;
- prioridade válida;
- modo de execução conhecido;
- próxima ação não vazia;
- evidência de conclusão explícita;
- flag de autonomia coerente com o modo;
- `publication_authorized: false`;
- ausência de instruções transacionais proibidas.

## O que este plano não faz

O plano não gera evidência humana, não simula compatibilidade entre suítes, não declara CI verde, não congela artefatos, não calcula hashes finais antes do freeze e não autoriza publicação.

Uma dependência somente pode virar `passed` quando a evidência descrita em `completion_evidence` existir e puder ser verificada.

## Guardrails permanentes

Nenhuma etapa deste plano autoriza gasto, anúncio, venda, checkout, publicação pública, criação de conta externa, fornecimento de credenciais, uso de dados financeiros reais ou aceite legal. Qualquer ação desse tipo permanece fora da execução autônoma e exige autorização explícita separada.
