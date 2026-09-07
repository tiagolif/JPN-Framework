# Exemplo — Análise de Documentos

## Cenário
Extrair obrigações e riscos de um conjunto de documentos sem tratar inferências como fatos.

## Jornada
```yaml
jornada:
  contexto: "análise assistida de documentos"
  objetivo: "produzir síntese rastreável e destacar lacunas"
  fontes: ["documentos fornecidos", "metadados disponíveis"]
  restricoes:
    - "não inventar cláusulas"
    - "não substituir análise jurídica ou contábil especializada"
  incertezas:
    - "documentos faltantes"
    - "versão vigente de anexos"
```

## Precisão
```yaml
precisao:
  criterios_de_aceitacao:
    - "cada afirmação relevante aponta para evidência"
    - "conflitos entre documentos são destacados"
    - "lacunas são marcadas como não verificadas"
    - "fato, interpretação e recomendação ficam separados"
  validacao:
    - "amostrar afirmações contra a fonte"
    - "testar documento sem data"
    - "testar versões conflitantes"
```

## Narrativa
```yaml
narrativa:
  sequencia:
    - "inventariar fontes"
    - "identificar escopo e versão"
    - "extrair fatos com referência"
    - "comparar conflitos"
    - "separar inferências"
    - "produzir resumo e pendências"
  formato: "resumo executivo + tabela de evidências + lacunas"
```

## Saída esperada
| Item | Conteúdo |
|---|---|
| Fato | afirmação suportada por fonte identificada |
| Evidência | documento e trecho/localização |
| Conflito | versões ou declarações incompatíveis |
| Lacuna | informação necessária mas ausente |
| Próxima ação | verificação ou decisão humana necessária |

## Guardrail
Sem evidência suficiente, o resultado deve dizer `não verificado` em vez de completar a lacuna por plausibilidade.
