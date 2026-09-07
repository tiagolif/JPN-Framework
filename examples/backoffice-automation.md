# Exemplo — Automação de Backoffice

## Cenário
Automatizar triagem e preparação de tarefas administrativas repetitivas sem autorizar ações irreversíveis automaticamente.

## Jornada
```yaml
jornada:
  contexto: "operações administrativas"
  objetivo: "reduzir trabalho manual de classificação e preparação"
  recursos: ["caixa de entrada", "planilha operacional", "regras internas"]
  restricoes:
    - "não efetuar pagamentos"
    - "não assinar documentos"
    - "não excluir registros sem revisão"
  incertezas: ["exceções de processo", "prioridades concorrentes"]
```

## Precisão
```yaml
precisao:
  escopo:
    inclui: ["classificar", "extrair campos", "sugerir prioridade", "preparar rascunho", "registrar fila"]
    nao_inclui: ["aprovar despesa", "alterar contrato", "enviar instrução financeira"]
  criterios_de_aceitacao:
    - "cada item recebe categoria e evidência"
    - "campos ausentes permanecem ausentes"
    - "exceções são encaminhadas para revisão"
    - "ações de alto impacto exigem humano"
```

## Narrativa
```yaml
narrativa:
  sequencia:
    - "receber item"
    - "classificar"
    - "extrair dados permitidos"
    - "validar completude"
    - "preparar próxima ação"
    - "encaminhar para execução humana quando necessário"
```

## Regra operacional
Automação boa não é a que executa tudo: é a que reduz trabalho repetitivo preservando pontos de decisão onde erro, autorização ou impacto justificam revisão humana.
