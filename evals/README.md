# JPN Evals v1

Conjunto inicial com 16 casos reproduzíveis para comparar uma instrução baseline com a mesma tarefa estruturada em JPN.

## Objetivo
Medir RCR (Requirement Compliance Rate), UCR (Unsupported Claim Rate), RT (Rework Turns), FC (Format Compliance), CS (Consistency Score), latência e tokens quando disponíveis.

## Procedimento mínimo
1. Execute cada tarefa no grupo Baseline usando `input` + `context`.
2. Execute a versão JPN da mesma tarefa mantendo modelo, parâmetros, ferramentas e fontes idênticos.
3. Faça ao menos 5 repetições por condição quando o custo permitir.
4. Avalie primeiro por regras determinísticas.
5. Use avaliação humana cega somente quando necessário.
6. Preserve resultados negativos.

## RCR
`RCR = soma dos pesos dos requisitos atendidos / soma dos pesos totais`

## UCR
`UCR = claims factuais sem suporte / total de claims factuais`

## Dataset
`dataset/jpn_eval_v1.jsonl`

Categorias cobertas: software, support, document_analysis, operations, rag, conflict, ambiguous, rigid_format, marketing, sales, management, content, automation, research e customer_success.

Este dataset não prova superioridade do JPN. Ele cria infraestrutura para testar hipóteses de maneira reproduzível.
