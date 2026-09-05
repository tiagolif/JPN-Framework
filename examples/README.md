# Biblioteca de Exemplos JPN

Esta pasta reúne estados JPN completos para os domínios previstos na Fase 2 do roadmap do framework.

## Exemplos

1. `software-development.json` — correção de bug preservando contrato público.
2. `document-analysis.json` — resumo rastreável de contrato com revisão humana.
3. `sales-agent.json` — qualificação de leads sem inventar preço, estoque ou condições.
4. `technical-support.json` — triagem segura antes de diagnosticar.
5. `backoffice-automation.json` — automação operacional sem ampliar autoridade do fluxo.
6. `multi-agent-handoff.json` — transferência de contexto entre agentes com estados de confiança.
7. `rag-conflicting-sources.json` — RAG com fontes conflitantes e sem escolha silenciosa.

## Contrato

Os exemplos usam `0.3.0-draft` e preservam Jornada, Precisão e Narrativa, incluindo os estados `confirmed`, `inferred`, `unknown` e `conflicting` quando aplicáveis.

Eles foram concebidos para uso com o SDK, Prompt Builder, demonstrações, testes e futuros evals. Contexto ausente, incerto ou conflitante é explicitado em vez de completado por invenção.
