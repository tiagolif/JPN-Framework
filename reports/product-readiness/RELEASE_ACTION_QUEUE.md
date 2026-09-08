# JPN — Fila priorizada de ações de release

> Relatório derivado mecanicamente de `PRODUCT_PORTFOLIO_v1.json`, `PRODUCT_RELEASE_STATUS_v1.json` e `RELEASE_EXECUTION_PLAN_v1.json`. Ele organiza trabalho; não aprova release, venda, anúncio ou publicação.

## Resumo operacional

- Itens ativos: **14**
- Itens ativos que podem avançar sem nova autorização: **14**
- Ações autônomas locais abertas: **3**
- Inspeções humanas abertas: **7**
- Ações que exigem ambiente externo: **2**
- Ações que exigem CI real: **2**
- Ações que exigem autorização explícita: **0**

## Próximas ações, em ordem

| # | Prioridade | Produto | Dependência | Estado | Modo | Sem nova autorização | Próxima ação | Evidência atual |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | P0 | JPN Business | `diagramacao-final` | Em andamento | Inspeção humana | Sim | Gerar o candidato composto, revisar paginação, margens, hierarquia e referências PP-*. | `docs/products/jpn-business/COMPOSITION_SPEC_v1.md` |
| 2 | P0 | JPN Business | `pdf-final` | Pendente | Inspeção humana | Sim | Exportar PDF candidato após composição e inspecionar o arquivo completo antes de freeze. | Ainda não registrada |
| 3 | P0 | JPN Prompt Builder | `ci-final` | Pendente | CI | Sim | Executar CI no head definitivo do candidato de release e exigir resultado verde. | Ainda não registrada |
| 4 | P0 | JPN Prompt Builder | `pacote-offline-final` | Pendente | Ambiente externo | Sim | Executar QA final em navegador/dispositivo, congelar o bundle offline somente após aprovação e registrar hashes finais. | Ainda não registrada |
| 5 | P0 | JPN Pro Kit | `artefatos-congelados` | Pendente | Autônoma local | Sim | Consolidar somente artefatos cujas dependências próprias estejam aprovadas e então congelar o conjunto de entrega. | Ainda não registrada |
| 6 | P0 | JPN Pro Kit | `hashes-finais` | Pendente | Autônoma local | Sim | Calcular SHA-256 apenas depois do freeze real e preencher o manifesto final sem alterar os binários. | Ainda não registrada |
| 7 | P0 | JPN Pro Kit | `ci-final` | Pendente | CI | Sim | Executar CI no SHA definitivo do conjunto candidato e exigir resultado verde. | Ainda não registrada |
| 8 | P0 | JPN Gestão Fácil | `gf-qa-10` | Pendente | Ambiente externo | Sim | Abrir o mesmo XLSX em Microsoft Excel, LibreOffice Calc e Google Sheets e registrar compatibilidade usando somente dados fictícios. | Ainda não registrada |
| 9 | P0 | JPN Gestão Fácil | `arquivo-final-validado` | Pendente | Autônoma local | Sim | Após GF-QA-10 aprovado, congelar o XLSX validado e registrar seu SHA-256 final. | Ainda não registrada |
| 10 | P1 | Método JPN | `revisao-editorial-humana` | Pendente | Inspeção humana | Sim | Ler o candidato completo, corrigir ortografia, clareza e consistência sem alterar a base metodológica canônica. | Ainda não registrada |
| 11 | P1 | Método JPN | `pdf-final` | Pendente | Inspeção humana | Sim | Gerar PDF candidato interno e revisar página a página antes de qualquer freeze. | Ainda não registrada |
| 12 | P1 | JPN Prompt Pack | `revisao-editorial-humana` | Pendente | Inspeção humana | Sim | Executar revisão ortográfica e editorial fina preservando os 18 templates e seus IDs canônicos. | Ainda não registrada |
| 13 | P1 | JPN Prompt Pack | `pdf-final` | Pendente | Inspeção humana | Sim | Gerar PDF candidato e executar QA visual página a página. | Ainda não registrada |
| 14 | P1 | JPN Business | `revisao-editorial-humana` | Pendente | Inspeção humana | Sim | Revisar texto e os 12 playbooks contra a fonte e o índice canônico. | Ainda não registrada |

## Ações autônomas locais abertas

- **JPN Pro Kit / artefatos-congelados** — Consolidar somente artefatos cujas dependências próprias estejam aprovadas e então congelar o conjunto de entrega.
- **JPN Pro Kit / hashes-finais** — Calcular SHA-256 apenas depois do freeze real e preencher o manifesto final sem alterar os binários.
- **JPN Gestão Fácil / arquivo-final-validado** — Após GF-QA-10 aprovado, congelar o XLSX validado e registrar seu SHA-256 final.

## Regra de execução

A presença de uma ação nesta fila não significa que seus pré-requisitos já estejam satisfeitos. Antes de executar, deve-se confirmar as dependências do próprio produto e produzir exatamente a evidência declarada no plano. Itens de inspeção humana, ambiente externo e CI não podem ser promovidos por inferência ou por checks mecânicos.

## Guardrails

- Não preencher hashes finais antes do freeze real.
- Não marcar revisão humana, GF-QA-10, QA de navegador/dispositivo ou CI como concluídos sem execução real.
- Não usar dados financeiros reais, credenciais, criação de conta externa ou aceite legal.
- Não publicar, anunciar, vender ou habilitar checkout com base neste relatório.
