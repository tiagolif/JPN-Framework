# Exemplo — Desenvolvimento de Software

## Cenário
Construir uma API de cadastro de clientes sem perder requisitos, segurança e critérios de aceite.

## Jornada
```yaml
jornada:
  contexto: "API REST para cadastro de clientes"
  objetivo: "criar e consultar clientes com comportamento previsível"
  estado_atual: "requisitos em linguagem natural"
  restricoes:
    - "não expor dados sensíveis em logs"
    - "não assumir campos obrigatórios não definidos"
  incertezas:
    - "mecanismo de autenticação"
    - "política de retenção"
```

## Precisão
```yaml
precisao:
  escopo:
    inclui: ["POST /customers", "GET /customers/:id", "validação", "erros consistentes"]
    nao_inclui: ["faturamento", "campanhas", "perfilamento automático"]
  criterios_de_aceitacao:
    - "entrada inválida retorna erro 4xx sem stack trace"
    - "IDs são únicos"
    - "registro criado pode ser recuperado"
    - "campos não autorizados não são persistidos"
  validacao:
    - "teste feliz"
    - "payload incompleto"
    - "ID inexistente"
    - "campo extra"
    - "falha de persistência"
```

## Narrativa
```yaml
narrativa:
  sequencia:
    - "confirmar contrato de entrada e saída"
    - "implementar validação"
    - "implementar persistência"
    - "implementar endpoints"
    - "adicionar testes"
    - "registrar decisões e lacunas"
  estado_final: "API testada contra critérios explícitos"
```

## Testes mínimos
| Caso | Resultado esperado |
|---|---|
| Payload válido | 201 e cliente recuperável |
| Campo obrigatório ausente | 4xx documentado |
| Campo desconhecido | rejeitado ou ignorado conforme contrato |
| Falha no banco | erro controlado sem vazamento de segredo |

## Por que o JPN ajuda
A Jornada evita começar pelo código antes de entender contexto; a Precisão transforma pedidos vagos em contrato verificável; a Narrativa organiza a ordem de implementação e validação.
