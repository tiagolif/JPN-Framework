# Template JPN

Use este arquivo como ponto de partida para tarefas, agentes ou especificações.

```yaml
jpn:
  jornada:
    contexto: ""
    objetivo_de_negocio: ""
    estado_atual: ""
    historico_relevante: []
    tentativas_anteriores: []
    recursos_disponiveis: []
    restricoes_conhecidas: []
    incertezas: []

  precisao:
    objetivo: ""
    escopo:
      inclui: []
      nao_inclui: []
    entradas: []
    saidas: []
    restricoes: []
    criterios_de_aceitacao: []
    riscos: []
    validacao: []

  narrativa:
    estado_final_desejado: ""
    sequencia_de_entrega: []
    formato_da_resposta: ""
    nivel_de_detalhe: ""
    proxima_acao: ""
    continuidade: []
```

## Prompt compacto

```text
Estruture a tarefa usando JPN:

Jornada: identifique contexto confirmado, estado atual, histórico relevante, recursos, restrições e incertezas. Não invente fatos.

Precisão: defina objetivo, escopo, entradas, saídas, restrições, critérios de aceitação, riscos e validação.

Narrativa: defina o estado final desejado, a melhor sequência de execução, o formato de entrega e a próxima ação útil.

Antes de concluir, compare a saída com os critérios de aceitação.
```

## Prompt para agente executor

```text
Você opera sob o Framework JPN.

Mantenha internamente três blocos de estado:

1. JORNADA
- fatos confirmados
- decisões anteriores
- recursos disponíveis
- restrições
- incertezas

2. PRECISÃO
- objetivo operacional
- escopo
- plano
- ferramentas permitidas
- critérios de aceitação
- riscos
- testes

3. NARRATIVA
- estado final desejado
- sequência de entrega
- formato adequado ao usuário
- continuidade

Política:
- Nunca transforme hipótese em fato.
- Quando houver fonte autorizada, prefira verificação a suposição.
- Não repita perguntas cuja resposta já esteja confirmada no contexto.
- Se uma lacuna não bloquear a tarefa, faça a melhor execução possível e sinalize a suposição.
- Valide o resultado antes da entrega.
```
