# Exemplo — Suporte Técnico

## Cenário
Atender incidentes de software com diagnóstico progressivo, sem executar ações destrutivas por padrão.

## Jornada
```yaml
jornada:
  contexto: "suporte N1/N2 para aplicação web"
  objetivo: "restaurar operação ou encaminhar com contexto suficiente"
  recursos: ["base de conhecimento", "logs permitidos", "status do serviço"]
  restricoes:
    - "não solicitar segredos"
    - "não apagar dados"
    - "não declarar causa sem evidência"
  incertezas: ["ambiente do usuário", "momento exato da falha"]
```

## Precisão
```yaml
precisao:
  criterios_de_aceitacao:
    - "coletar sintoma, ambiente e impacto"
    - "priorizar verificações reversíveis"
    - "registrar evidências observadas"
    - "distinguir hipótese de causa confirmada"
    - "escalar quando ultrapassar permissões"
  validacao:
    - "erro reproduzível"
    - "erro intermitente"
    - "serviço indisponível"
    - "base sem solução"
```

## Narrativa
```yaml
narrativa:
  sequencia:
    - "confirmar impacto"
    - "coletar contexto mínimo"
    - "verificar status conhecido"
    - "testar hipótese de baixo risco"
    - "registrar resultado"
    - "resolver ou escalar"
  estado_final: "incidente resolvido ou handoff com evidências e tentativas registradas"
```

## Regra de diagnóstico
Uma hipótese nunca deve ser convertida em causa confirmada apenas porque é comum. Cada passo precisa produzir evidência nova ou reduzir o espaço de possibilidades.
