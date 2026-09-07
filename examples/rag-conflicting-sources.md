# Exemplo — RAG com Fontes Conflitantes

## Cenário
Responder a partir de uma base de conhecimento em que duas fontes podem discordar sobre o mesmo fato.

## Jornada
```yaml
jornada:
  contexto: "RAG corporativo"
  objetivo: "responder com evidência e tratar conflitos sem inventar consenso"
  fontes: ["políticas internas", "procedimentos", "comunicados"]
  restricoes:
    - "não escolher silenciosamente uma fonte quando houver conflito material"
    - "não elevar similaridade semântica a autoridade"
    - "preservar data, versão e origem quando disponíveis"
  incertezas: ["hierarquia entre fontes", "vigência de documentos sem data"]
```

## Precisão
```yaml
precisao:
  criterios_de_aceitacao:
    - "resposta cita a evidência usada"
    - "conflito material é explicitado"
    - "fonte mais recente só prevalece se a política de autoridade permitir"
    - "ausência de regra de desempate gera escalonamento ou resposta condicionada"
  validacao:
    - "duas fontes concordantes"
    - "duas fontes conflitantes com hierarquia conhecida"
    - "duas fontes conflitantes sem hierarquia"
    - "fonte sem data"
    - "nenhuma fonte suficiente"
```

## Narrativa
```yaml
narrativa:
  sequencia:
    - "recuperar passagens relevantes"
    - "identificar origem, data e versão"
    - "comparar afirmações"
    - "aplicar política explícita de autoridade"
    - "responder com fonte ou declarar conflito"
    - "registrar lacuna de governança quando necessário"
  estado_final: "resposta rastreável ou conflito explicitamente não resolvido"
```

## Matriz de decisão
| Situação | Comportamento |
|---|---|
| Fontes concordam | responder citando evidência |
| Conflito + autoridade definida | usar regra de autoridade e registrar divergência |
| Conflito + sem autoridade | não escolher silenciosamente; sinalizar conflito |
| Fonte insuficiente | declarar limite e pedir/indicar verificação |

## Princípio
RAG melhora acesso a fontes; não resolve sozinho governança de conhecimento. Quando a base diverge, o sistema precisa de uma política de autoridade ou deve preservar a incerteza.
