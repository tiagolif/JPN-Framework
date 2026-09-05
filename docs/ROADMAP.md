# Roadmap — JPN Framework

Este roadmap organiza a evolução do JPN sem transformar propostas futuras em funcionalidades ou resultados já comprovados.

> **Sincronizado com `0.3.0-draft`:** a especificação, o JSON Schema e o SDK TypeScript de referência já existem. Itens de avaliação e ampliação de exemplos continuam em desenvolvimento.

## Fase 1 — Fundação documental

- [x] Definir Jornada, Precisão e Narrativa.
- [x] Criar especificação formal.
- [x] Documentar JPN-RAG.
- [x] Criar template reutilizável.
- [x] Adicionar primeiro exemplo aplicado.
- [x] Registrar limitações e princípios de validação.

## Fase 2 — Biblioteca de exemplos

- [ ] Desenvolvimento de software.
- [ ] Análise de documentos.
- [ ] Agente de vendas.
- [ ] Suporte técnico.
- [ ] Automação de backoffice.
- [ ] Multiagentes.
- [ ] RAG com fontes conflitantes.

## Fase 3 — Avaliação

Objetivo: medir se a estrutura melhora resultados em tarefas definidas.

Experimentos propostos:

- [ ] comparar prompt simples vs. JPN;
- [ ] medir cumprimento de requisitos;
- [ ] medir retrabalho;
- [ ] medir alucinações factuais;
- [ ] medir cobertura de critérios de aceitação;
- [ ] avaliação humana cega de utilidade;
- [ ] comparar diferentes modelos e fornecedores.

Resultados, positivos ou negativos, deverão ser documentados.

## Fase 4 — Esquema estruturado

- [x] JSON Schema oficial para estado JPN.
- [ ] exemplos dedicados de validação de schema.
- [ ] formato para provenance/evidence.
- [ ] contrato de handoff entre agentes.
- [ ] política formal de compatibilidade entre versões.

## Fase 5 — SDK de referência

A implementação TypeScript de referência foi iniciada em `0.3.0-draft` e atualmente inclui:

- [x] tipos TypeScript para o estado JPN;
- [x] validação runtime baseada no JSON Schema 2020-12;
- [x] erros estruturados de validação;
- [x] compilador de estado JPN para prompt operacional;
- [x] preservação opcional de estados de confiança no prompt;
- [x] avaliação heurística de prontidão;
- [x] testes automatizados;
- [x] CI com GitHub Actions;
- [ ] parser/construtor de estado a partir de entrada bruta;
- [ ] adaptadores específicos, mantendo o núcleo agnóstico de fornecedor;
- [ ] módulo de evals reproduzíveis integrado ao SDK.

O SDK deverá permanecer agnóstico de fornecedor sempre que possível.

## Fase 6 — Evals públicos

- [ ] dataset pequeno e auditável;
- [ ] scripts reproduzíveis;
- [ ] baseline sem JPN;
- [ ] resultados por modelo;
- [ ] relatório de limitações.

## Critério para versão 1.0

A versão `1.0.0` só deverá ser considerada quando houver:

1. especificação estável;
2. exemplos suficientes em domínios diferentes;
3. esquema estruturado documentado;
4. pelo menos uma rodada de avaliação reproduzível;
5. regras claras de compatibilidade e versionamento.
