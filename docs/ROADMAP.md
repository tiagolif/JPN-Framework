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

Infraestrutura preparada: protocolo baseline vs. JPN, dataset sintético auditável, contrato versionado de avaliações e scorer local. Permanecem pendentes rodadas reais, métricas de retrabalho/alucinação/cobertura, avaliação humana cega e comparação entre modelos. A existência do protocolo não é prova de eficácia.

## Fase 4 — Esquema estruturado

O estado JPN possui schema candidato e gate executável. O handoff entre agentes agora possui duas versões comparáveis: a baseline preservada `schemas/jpn-handoff.v0.1.schema.json` e o contrato atual `schemas/jpn-handoff.schema.json` (`0.2.0-draft`). A primeira migração executável `0.1 → 0.2` está coberta por fixture determinística e bloqueia conversões que exigiriam inventar evidência temporal. A política de SemVer e o changelog permanecem candidatos; isso não declara estabilidade 1.0.

- [x] JSON Schema candidato para estado JPN;
- [x] campo de versão obrigatório no estado estruturado;
- [x] proveniência básica opcional (`source`) para itens de contexto;
- [x] exemplos executáveis de validação do schema;
- [x] gate de validação do schema na cadeia oficial de CI;
- [x] modelo candidato de provenance/evidence;
- [x] contrato estruturado candidato de handoff entre agentes;
- [x] validar referências cruzadas entre decisões e IDs de evidência;
- [x] política formal candidata de compatibilidade entre versões;
- [x] registrar baselines candidatas;
- [x] adicionar primeira fixture executável de compatibilidade/migração (`handoff 0.1 → 0.2`);
- [ ] ampliar fixtures de migração quando novas versões estruturais surgirem;
- [ ] promover schemas candidatos a contratos estáveis somente após validação e compatibilidade documentadas.

## Fase 5 — SDK de referência

A implementação de referência já possui núcleo TypeScript em `src/`, validação, tipos, geração de prompt, readiness, testes e bundle de navegador. A modularização futura continua sendo direção arquitetural, não afirmação de pacotes independentes completos.

## Fase 6 — Evals públicos

- [x] dataset pequeno e auditável (candidato inicial; ainda não publicado como benchmark);
- [x] script de scoring reproduzível;
- [x] baseline sem JPN definido no protocolo;
- [ ] resultados por modelo;
- [ ] relatório de limitações baseado em rodada executada.

## Critério para versão 1.0

A versão `1.0.0` só deverá ser considerada quando houver especificação estável, exemplos suficientes, esquema documentado com política de compatibilidade, ao menos uma rodada de avaliação reproduzível e regras claras de versionamento.
