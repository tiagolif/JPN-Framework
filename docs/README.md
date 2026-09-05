# Documentação do JPN Framework

Este diretório concentra a documentação técnica complementar do framework.

## Índice

### [`SPECIFICATION.md`](SPECIFICATION.md)
Especificação formal de Jornada, Precisão e Narrativa, incluindo campos, regras, estados de confiança, validação e limitações.

### [`JPN-RAG.md`](JPN-RAG.md)
Extensão do framework para sistemas de Retrieval-Augmented Generation, com foco em recuperação, proveniência, suficiência de evidência e síntese fundamentada.

### [`HANDOFF.md`](HANDOFF.md)
Contrato draft para transferência de contexto entre agentes, preservando estados de confiança, incertezas, conflitos, escopo e próxima ação sem transportar cadeia de pensamento.

### [`EVALUATION.md`](EVALUATION.md)
Protocolo inicial para comparar JPN com um baseline e medir cumprimento de requisitos, retrabalho, groundedness, consistência, latência e custo.

### [`ROADMAP.md`](ROADMAP.md)
Plano de evolução do projeto, incluindo biblioteca de exemplos, schema estruturado, evals e possível SDK de referência.

---

## Recursos relacionados

- [`../templates/JPN_TEMPLATE.md`](../templates/JPN_TEMPLATE.md) — template reutilizável.
- [`../schemas/jpn.schema.json`](../schemas/jpn.schema.json) — JSON Schema do estado JPN.
- [`../examples/customer-support.md`](../examples/customer-support.md) — exemplo aplicado a atendimento comercial.
- [`../CHANGELOG.md`](../CHANGELOG.md) — histórico de versões.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — diretrizes para contribuição.

---

## Ordem sugerida de leitura

Para conhecer o projeto:

1. `README.md` na raiz;
2. `SPECIFICATION.md`;
3. exemplo de atendimento;
4. `JPN-RAG.md`;
5. `HANDOFF.md`;
6. `EVALUATION.md`.

Para implementar:

1. `SPECIFICATION.md`;
2. `JPN_TEMPLATE.md`;
3. `jpn.schema.json`;
4. políticas específicas do domínio;
5. `HANDOFF.md` quando houver mais de um agente;
6. testes e evals.
