# Exemplo — Multiagentes e Handoff

## Cenário
Coordenar agentes especializados sem perder contexto, responsabilidade ou rastreabilidade entre etapas.

## Jornada
```yaml
jornada:
  contexto: "fluxo multiagente"
  objetivo: "delegar tarefas especializadas com handoff verificável"
  agentes: ["triagem", "pesquisa", "execução", "revisão"]
  restricoes:
    - "cada agente acessa apenas o necessário"
    - "nenhum agente presume sucesso do anterior"
    - "estado compartilhado precisa ter origem identificável"
  incertezas: ["qual agente resolve exceções", "limite de tentativas"]
```

## Precisão
```yaml
precisao:
  contrato_de_handoff:
    campos_obrigatorios:
      - "task_id"
      - "objetivo"
      - "estado_atual"
      - "evidencias"
      - "pendencias"
      - "proxima_acao"
      - "responsavel_atual"
  criterios_de_aceitacao:
    - "todo handoff possui objetivo e estado explícitos"
    - "evidência e inferência não são misturadas"
    - "falha de agente não apaga o estado anterior"
    - "revisor consegue reconstruir a sequência"
```

## Narrativa
```yaml
narrativa:
  sequencia:
    - "triagem define objetivo e rota"
    - "pesquisa adiciona evidências"
    - "execução produz candidato"
    - "revisão compara candidato com critérios"
    - "aprovar, corrigir ou escalar"
  estado_final: "resultado acompanhado por trilha de handoffs e pendências"
```

## Exemplo de handoff
```json
{
  "task_id": "task-042",
  "objetivo": "preparar resposta baseada em fontes internas",
  "estado_atual": "evidências coletadas; resposta ainda não revisada",
  "evidencias": ["fonte-A#secao-2", "fonte-B#linha-18"],
  "pendencias": ["resolver divergência de prazo"],
  "proxima_acao": "revisão humana ou agente revisor",
  "responsavel_atual": "revisao"
}
```

## Guardrail
O agente seguinte deve receber um estado explícito, não apenas texto livre da etapa anterior. Isso reduz perda de contexto e evita que uma hipótese herdada pareça fato confirmado.
