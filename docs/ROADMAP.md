# Roadmap — JPN Framework

Este roadmap organiza a evolução do JPN sem transformar propostas futuras em funcionalidades ou resultados já comprovados.

## Fase 1 — Fundação documental

- [x] Definir Jornada, Precisão e Narrativa.
- [x] Criar especificação formal.
- [x] Documentar JPN-RAG.
- [x] Criar template reutilizável.
- [x] Adicionar primeiro exemplo aplicado.
- [x] Registrar limitações e princípios de validação.

## Fase 2 — Biblioteca de exemplos

- [x] Desenvolvimento de software.
- [x] Análise de documentos.
- [x] Agente de vendas.
- [x] Suporte técnico.
- [x] Automação de backoffice.
- [x] Multiagentes.
- [x] RAG com fontes conflitantes.

A biblioteca versionada em `examples/` cobre os sete domínios acima e mantém também exemplos estruturados de estado JPN. A conclusão desta fase significa cobertura documental; não significa eficácia comparativa comprovada.

## Fase 3 — Avaliação

Objetivo: medir se a estrutura melhora resultados em tarefas definidas.

Infraestrutura preparada:

- [x] protocolo baseline vs. JPN;
- [x] dataset sintético inicial e auditável;
- [x] contrato versionado para registrar respostas e avaliações;
- [x] scorer local sem dependência de fornecedor.

Experimentos propostos:

- [ ] executar comparação prompt simples vs. JPN;
- [ ] medir cumprimento de requisitos em rodada real;
- [ ] medir retrabalho em rodada real;
- [ ] medir alucinações factuais em rodada real;
- [ ] medir cobertura de critérios de aceitação em rodada real;
- [ ] avaliação humana cega de utilidade;
- [ ] comparar diferentes modelos e fornecedores.

Resultados, positivos ou negativos, deverão ser documentados. A existência do protocolo não deve ser apresentada como prova de eficácia.

## Fase 4 — Esquema estruturado

Estado atual: existe um schema candidato versionado em `schemas/jpn.schema.json`, baseado em JSON Schema Draft 2020-12. Ele representa Jornada, Precisão e Narrativa, exige a versão da especificação e permite proveniência opcional em itens de contexto. O contrato possui validação executável em `scripts/check-jpn-schema.mjs`, integrada ao CI. Existe também `schemas/jpn-handoff.schema.json`, contrato candidato separado para handoff entre agentes, com evidências rastreáveis por fonte, estado de verificação, decisões, pendências, restrições e próximas ações. A validação executável cobre ambos os schemas, rejeita evidência sem referência de fonte, estados não previstos, referências de decisão sem evidência correspondente e IDs de evidência duplicados. A política candidata de evolução e SemVer está documentada em `docs/SCHEMA_COMPATIBILITY.md`. Isso é infraestrutura implementada, não uma declaração de estabilidade 1.0.

- [x] JSON Schema candidato para estado JPN;
- [x] campo de versão obrigatório no estado estruturado;
- [x] proveniência básica opcional (`source`) para itens de contexto;
- [x] exemplos executáveis de validação do schema;
- [x] gate de validação do schema na cadeia oficial de CI;
- [x] modelo candidato de provenance/evidence para além dos itens de contexto;
- [x] contrato estruturado candidato de handoff entre agentes;
- [x] validar referências cruzadas entre decisões e IDs de evidência;
- [x] política formal candidata de compatibilidade entre versões;
- [ ] adicionar fixtures executáveis de compatibilidade/migração entre versões quando existir a primeira mudança de contrato;
- [ ] promover os schemas candidatos a contratos estáveis somente após validação e compatibilidade documentadas.

## Fase 5 — SDK de referência

A implementação de referência já possui núcleo TypeScript em `src/`, validação, tipos, geração de prompt, readiness, testes e bundle de navegador. A arquitetura futura abaixo continua sendo uma direção de modularização, não uma afirmação de que todos esses módulos já existem como pacotes independentes.

```text
jpn/
├── parser
├── state
├── validator
├── rag
├── adapters
└── evals
```

O SDK deverá permanecer agnóstico de fornecedor sempre que possível.

## Fase 6 — Evals públicos

- [x] dataset pequeno e auditável (candidato inicial; ainda não publicado como benchmark);
- [x] script de scoring reproduzível;
- [x] baseline sem JPN definido no protocolo;
- [ ] resultados por modelo;
- [ ] relatório de limitações baseado em rodada executada.

## Critério para versão 1.0

A versão `1.0.0` só deverá ser considerada quando houver:

1. especificação estável;
2. exemplos suficientes em domínios diferentes;
3. esquema estruturado documentado e com política de compatibilidade;
4. pelo menos uma rodada de avaliação reproduzível;
5. regras claras de compatibilidade e versionamento.
