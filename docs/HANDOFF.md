# Contrato de Handoff entre Agentes — JPN Framework

Status: **draft**  
Base: **JPN 0.3.0-draft**

Este documento propõe um contrato mínimo para transferir contexto entre agentes, ferramentas ou etapas de automação sem perder fatos, incertezas, restrições e estados de confiança.

## Objetivo

Um handoff JPN deve permitir que o próximo agente saiba:

1. por que recebeu a tarefa;
2. quais fatos estão confirmados;
3. quais itens são inferidos, desconhecidos ou conflitantes;
4. o que já foi decidido ou executado;
5. o que está dentro e fora do escopo;
6. qual ação é esperada a seguir;
7. quais evidências ou fontes sustentam o contexto quando disponíveis.

O contrato não deve transportar raciocínio privado, cadeia de pensamento ou conteúdo oculto do agente anterior.

## Princípios

- **Preservar confiança:** `inferred` não pode virar `confirmed` sem nova evidência.
- **Não apagar conflito:** itens `conflicting` devem continuar identificados até que uma regra ou fonte autoritativa resolva o conflito.
- **Não ampliar autoridade:** o agente receptor herda apenas o escopo explicitamente delegado.
- **Separar fato de ação:** fatos descrevem o estado; `requested_action` descreve o que o próximo agente deve fazer.
- **Registrar provenance quando disponível:** fonte, documento, mensagem, ferramenta ou evento que sustenta um item deve ser preservado.
- **Falhar de forma explícita:** handoffs incompletos devem ser rejeitados ou devolvidos para complementação quando a lacuna impedir execução segura.

## Envelope proposto

```json
{
  "handoff_version": "0.1-draft",
  "jpn_version": "0.3.0-draft",
  "handoff_id": "handoff-123",
  "from": "agent-support",
  "to": "agent-sales",
  "reason": "Cliente pediu orçamento após triagem inicial.",
  "state": {
    "version": "0.3.0-draft",
    "jornada": {},
    "precisao": {},
    "narrativa": {}
  },
  "requested_action": "Preparar próxima ação comercial sem inventar preço ou estoque.",
  "completed_actions": [
    "necessidade principal resumida",
    "restrições registradas"
  ],
  "open_questions": [
    "Qual é o preço vigente autorizado?"
  ],
  "provenance": [
    {
      "item": "Cliente pediu orçamento.",
      "source_type": "message",
      "source_ref": "conversation:msg-42"
    }
  ]
}
```

## Campos do envelope

### `handoff_version`

Versão do contrato de handoff. É separada de `jpn_version` para permitir evolução independente do envelope.

### `jpn_version`

Versão do contrato JPN usado em `state`.

### `handoff_id`

Identificador único ou rastreável do handoff.

### `from` e `to`

Identificadores lógicos do emissor e do receptor. Não precisam representar fornecedores específicos de IA.

### `reason`

Motivo operacional da transferência.

### `state`

Estado JPN válido. O receptor deve tratá-lo como contrato de contexto, não como texto narrativo livre.

### `requested_action`

A ação específica delegada ao agente receptor.

### `completed_actions`

Ações já executadas. O objetivo é reduzir repetição e prevenir que o receptor repita etapas concluídas sem necessidade.

### `open_questions`

Lacunas que ainda precisam ser resolvidas.

### `provenance`

Referências de origem quando disponíveis. O campo é informativo neste draft e não substitui um futuro contrato formal de evidence/provenance.

## Estados de confiança

Os itens de contexto continuam usando os estados do JPN:

- `confirmed`
- `inferred`
- `unknown`
- `conflicting`

O agente receptor **não deve promover** um item para um estado de maior certeza sem justificativa rastreável.

Exemplo incorreto:

```text
Agente A: "Cliente parece ter urgência" [inferred]
Agente B: "Cliente tem urgência" [confirmed]
```

Exemplo correto:

```text
Agente A: "Cliente parece ter urgência" [inferred]
Agente B: preserva `inferred` até que o cliente confirme prazo ou urgência.
```

## Validação mínima antes do envio

O emissor deve verificar:

- o `state` JPN é válido;
- `reason` está presente;
- `requested_action` está presente;
- conflitos relevantes não foram removidos;
- incertezas essenciais permanecem visíveis;
- ações já concluídas estão registradas quando isso evita repetição;
- nenhuma credencial, segredo ou dado desnecessário foi inserido no payload.

## Validação mínima no recebimento

O receptor deve rejeitar ou devolver o handoff quando:

- a ação solicitada está fora de sua autoridade;
- o estado JPN é inválido;
- uma lacuna essencial torna impossível executar a tarefa com segurança;
- existe conflito de contexto que exige uma regra de precedência não fornecida;
- o payload tenta delegar decisão que exige revisão humana obrigatória.

## Exemplo de vendas

```json
{
  "handoff_version": "0.1-draft",
  "jpn_version": "0.3.0-draft",
  "handoff_id": "lead-984",
  "from": "agent-attendance",
  "to": "agent-sales",
  "reason": "Cliente demonstrou interesse e solicitou orçamento.",
  "requested_action": "Preparar mensagem de continuidade e indicar dados que precisam de confirmação.",
  "completed_actions": ["necessidade resumida", "produto de interesse identificado"],
  "open_questions": ["preço vigente", "estoque disponível"],
  "provenance": []
}
```

Neste caso, o agente de vendas não deve preencher preço ou estoque por inferência.

## Exemplo de RAG com conflito

Se duas fontes divergem, o handoff deve preservar ambas como `conflicting` e registrar a pergunta aberta sobre precedência documental. O receptor não deve escolher silenciosamente uma das fontes.

## Segurança e privacidade

O contrato deve transportar apenas informações necessárias à execução. Não incluir:

- cadeia de pensamento;
- segredos, tokens ou credenciais;
- dados pessoais que não sejam necessários ao objetivo;
- instruções fora da autoridade do receptor.

## Compatibilidade

Este documento é um draft e não altera o JSON Schema oficial do estado JPN. O envelope de handoff fica externo ao `state` para evitar modificar o contrato principal antes de haver implementação e testes suficientes.

Uma futura versão poderá formalizar o envelope em JSON Schema próprio e adicionar validação no SDK.

## Critérios para estabilização

Antes de considerar o handoff estável, o framework deve ter pelo menos:

1. exemplos em dois ou mais domínios;
2. teste de preservação dos estados de confiança;
3. teste de handoff incompleto;
4. teste com fontes conflitantes;
5. política mínima de provenance/evidence;
6. decisão explícita de compatibilidade entre versões.
