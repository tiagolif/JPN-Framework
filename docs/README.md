# Documentação do JPN Framework

Este diretório concentra a documentação técnica complementar do framework e os documentos operacionais de QA/release dos produtos JPN.

## Índice

### [`SPECIFICATION.md`](SPECIFICATION.md)
Especificação formal de Jornada, Precisão e Narrativa, incluindo campos, regras, estados de confiança, validação e limitações.

### [`JPN-RAG.md`](JPN-RAG.md)
Extensão do framework para sistemas de Retrieval-Augmented Generation, com foco em recuperação, proveniência, suficiência de evidência e síntese fundamentada.

### [`EVALUATION.md`](EVALUATION.md)
Protocolo inicial para comparar JPN com um baseline e medir cumprimento de requisitos, retrabalho, groundedness, consistência, latência e custo.

### [`ROADMAP.md`](ROADMAP.md)
Plano de evolução técnica do framework, incluindo biblioteca de exemplos, schema estruturado, evals e possível SDK de referência.

### [`PRODUCT-RELEASE-TRACKER.md`](PRODUCT-RELEASE-TRACKER.md)
Acompanhamento separado dos produtos digitais JPN, com estados, entregáveis candidatos, gates pendentes e sequência recomendada para freeze/release.

### [`PRODUCT-QA-CHECKLIST.md`](PRODUCT-QA-CHECKLIST.md)
Checklist operacional de conteúdo, visual, PDFs, planilhas, Prompt Builder, páginas web, Prompt Pack, Business, Pro Kit, segurança e empacotamento.

---

## Recursos relacionados

- [`../templates/JPN_TEMPLATE.md`](../templates/JPN_TEMPLATE.md) — template reutilizável.
- [`../schemas/jpn.schema.json`](../schemas/jpn.schema.json) — JSON Schema do estado JPN.
- [`../examples/customer-support.md`](../examples/customer-support.md) — exemplo aplicado a atendimento comercial.
- [`../CHANGELOG.md`](../CHANGELOG.md) — histórico de versões.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — diretrizes para contribuição.

---

## Ordem sugerida de leitura

Para conhecer o framework:

1. `README.md` na raiz;
2. `SPECIFICATION.md`;
3. exemplo de atendimento;
4. `JPN-RAG.md`;
5. `EVALUATION.md`.

Para implementar:

1. `SPECIFICATION.md`;
2. `JPN_TEMPLATE.md`;
3. `jpn.schema.json`;
4. políticas específicas do domínio;
5. testes e evals.

Para preparar produtos e releases:

1. `PRODUCT-RELEASE-TRACKER.md`;
2. `PRODUCT-QA-CHECKLIST.md`;
3. resolver os gates do produto;
4. promover para `PRONTO PARA FREEZE` apenas após QA aplicável;
5. gerar manifesto/checksums e então congelar o pacote final.
