# JPN-RAG

Extensão do JPN Framework para sistemas de **Retrieval-Augmented Generation (RAG)**.

## Objetivo

JPN-RAG organiza a recuperação e o uso de conhecimento em três dimensões:

- **Jornada:** contexto da consulta e estado da conversa;
- **Precisão:** critérios de recuperação, filtragem e validação;
- **Narrativa:** síntese orientada ao objetivo, preservando a evidência recuperada.

## Arquitetura de referência

```text
User Query
   ↓
[J] Context Builder
   ↓
Query Normalization
   ↓
Retriever
   ↓
Candidate Documents
   ↓
[P] Relevance + Trust + Constraint Filter
   ↓
Context Assembly
   ↓
LLM / Agent
   ↓
[N] Outcome-oriented Synthesis
   ↓
Grounding Check
   ↓
Answer + Sources + Next State
```

## 1. Jornada aplicada ao RAG

Antes da busca, registrar apenas o contexto necessário:

```yaml
jornada_rag:
  pergunta_original: ""
  intencao: ""
  entidade_principal: ""
  contexto_relevante: []
  decisoes_anteriores: []
  restricoes: []
  termos_ambiguos: []
```

A etapa pode produzir uma consulta normalizada, mas deve preservar a pergunta original para auditoria.

## 2. Precisão aplicada ao retrieval

Definir critérios antes da síntese:

```yaml
retrieval_policy:
  fontes_permitidas: []
  fontes_proibidas: []
  recencia_maxima: null
  top_k: 5
  requer_citacao: true
  limiar_relevancia: null
  regras_de_conflito: []
```

### Filtragem recomendada

Cada trecho recuperado pode ser avaliado por:

1. relevância para a consulta;
2. autoridade/origem;
3. atualidade, quando aplicável;
4. compatibilidade com as restrições do domínio;
5. redundância;
6. conflito com outras fontes.

## 3. Context Assembly

O contexto enviado ao modelo deve ser mínimo e suficiente.

Estrutura sugerida:

```text
[QUESTION]
...

[CONFIRMED CONTEXT]
...

[EVIDENCE 1]
source: ...
content: ...

[EVIDENCE 2]
source: ...
content: ...

[CONSTRAINTS]
...

[OUTPUT REQUIREMENTS]
...
```

Evite despejar documentos inteiros quando apenas trechos pequenos são necessários.

## 4. Narrativa aplicada à síntese

A Narrativa define como o conteúdo recuperado deve virar uma resposta útil.

```yaml
narrativa_rag:
  estado_final_desejado: ""
  formato: ""
  audiencia: ""
  nivel_de_detalhe: ""
  deve_expor_fontes: true
  proxima_acao: ""
```

A síntese não deve alterar o significado das fontes para produzir uma resposta mais conveniente.

## 5. Proveniência

Quando a infraestrutura permitir, cada afirmação factual importante deve apontar para a evidência que a sustenta.

Modelo simples:

```json
{
  "claim": "...",
  "evidence_ids": ["doc-12#chunk-4"],
  "confidence_state": "confirmed"
}
```

## 6. Conflito de fontes

Quando fontes confiáveis divergem:

1. não esconda o conflito;
2. identifique quais pontos divergem;
3. priorize a política de autoridade definida pelo domínio;
4. explique o grau de certeza;
5. evite escolher arbitrariamente uma versão.

## 7. Falta de evidência

Se o retrieval não produzir evidência suficiente, o sistema deve retornar um estado explícito, por exemplo:

```json
{
  "status": "insufficient_evidence",
  "missing": ["preço vigente", "data de validade"],
  "recommended_action": "consultar fonte comercial autorizada"
}
```

Isso é preferível a completar a resposta por plausibilidade.

## 8. Memória e RAG

Memória conversacional e base documental devem ser tratadas como fontes diferentes.

- **memória:** decisões, preferências e estado da interação;
- **RAG:** fatos recuperados de documentos ou sistemas;
- **modelo:** raciocínio e transformação, não fonte automática de verdade.

## 9. Exemplo: CRM comercial

Pergunta:

> “Qual o preço deste produto?”

Política JPN-RAG:

```yaml
jornada:
  contexto: "cliente em atendimento comercial"

precisao:
  fonte_autorizada_preco: "sistema comercial vigente"
  permitir_preco_de_catalogo_antigo: false
  se_fonte_indisponivel: "handoff para vendedor"

narrativa:
  estado_final_desejado: "cliente recebe informação confiável ou encaminhamento correto"
```

Se a base recuperar um preço antigo e a política exigir preço vigente, o agente não deve apresentá-lo como atual.

## 10. Avaliação de JPN-RAG

Métricas possíveis:

- Precision@K / Recall@K do retrieval;
- groundedness;
- taxa de afirmações sem evidência;
- cobertura de citações;
- taxa de respostas `insufficient_evidence` corretas;
- utilidade percebida pelo usuário;
- latência e custo por consulta.

## 11. Segurança

JPN-RAG não substitui políticas de segurança. Implementações devem considerar:

- controle de acesso por documento;
- isolamento entre tenants;
- proteção contra prompt injection em documentos;
- redaction de dados sensíveis;
- auditoria de fontes;
- limites para execução de ferramentas.
