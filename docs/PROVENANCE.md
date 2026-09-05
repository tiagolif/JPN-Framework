# JPN Provenance & Evidence Contract — draft v1

Este documento propõe um contrato complementar para registrar **origem, evidência e rastreabilidade** em fluxos JPN sem alterar prematuramente o JSON Schema principal do estado `0.3.0-draft`.

> Status: **draft experimental**. O contrato abaixo é um envelope externo ao estado JPN. Ele não substitui `jpn.schema.json` e não autoriza tratar evidência como verdade apenas por estar registrada.

---

## 1. Problema

O estado JPN já diferencia informações `confirmed`, `inferred`, `unknown` e `conflicting`. Isso responde **qual é o estado de confiança** de um item, mas não resolve sozinho:

- de qual fonte a informação veio;
- onde, dentro da fonte, a evidência pode ser encontrada;
- quais afirmações dependem de quais evidências;
- se duas fontes sustentam afirmações incompatíveis;
- como preservar essa rastreabilidade entre agentes, RAG e automações;
- como auditar uma resposta depois da execução.

O objetivo deste contrato é adicionar essa camada sem misturar provenance com cadeia de pensamento.

---

## 2. Princípios

1. **Fonte não é evidência.** Uma fonte identifica a origem; uma evidência identifica o trecho, registro ou observação relevante dentro dela.
2. **Evidência não garante verdade.** Uma fonte pode estar errada, desatualizada ou entrar em conflito com outra.
3. **Inferência continua sendo inferência.** Várias evidências não promovem automaticamente `inferred` para `confirmed`.
4. **Conflito deve permanecer visível.** O sistema não deve escolher silenciosamente entre fontes incompatíveis.
5. **Provenance deve sobreviver ao handoff.** Se um agente transfere contexto, as referências necessárias para auditar esse contexto devem acompanhar o handoff.
6. **Não transportar cadeia de pensamento.** O contrato registra fatos, evidências, transformações observáveis e decisões declaradas — não raciocínio privado do modelo.
7. **Minimização.** Registre apenas o necessário para rastreabilidade; não copie segredos, credenciais ou dados pessoais sem necessidade operacional e autorização apropriada.

---

## 3. Envelope externo

A forma recomendada nesta etapa é envolver o estado JPN sem modificar seu schema:

```json
{
  "jpn_state": {
    "version": "0.3.0-draft",
    "jornada": {},
    "precisao": {},
    "narrativa": {}
  },
  "provenance": {
    "contract_version": "provenance-draft-v1",
    "sources": [],
    "evidence": [],
    "claims": []
  }
}
```

Consumidores que conhecem apenas o estado JPN podem continuar usando `jpn_state`. Consumidores que entendem provenance podem usar o envelope completo.

---

## 4. Source

Uma `source` representa a origem lógica da informação.

Campos recomendados:

```json
{
  "id": "src-001",
  "type": "document",
  "label": "Política de garantia",
  "locator": "drive://politica-garantia-v4.pdf",
  "observed_at": "2026-09-05T13:00:00Z",
  "content_hash": "sha256:...",
  "metadata": {
    "version": "4"
  }
}
```

### Campos

| Campo | Obrigatório | Significado |
|---|---:|---|
| `id` | sim | identificador estável dentro do envelope |
| `type` | sim | `document`, `message`, `database`, `api`, `human`, `sensor`, `web`, `other` |
| `label` | não | nome legível |
| `locator` | não | URL, URI interna, caminho, ID ou referência resolvível |
| `observed_at` | não | instante em que a fonte foi observada |
| `content_hash` | não | hash para detectar mudança de conteúdo |
| `metadata` | não | metadados não normativos |

`locator` não deve conter credenciais ou tokens de acesso.

---

## 5. Evidence

Uma `evidence` aponta para uma unidade específica dentro de uma fonte.

```json
{
  "id": "ev-001",
  "source_id": "src-001",
  "locator": "p. 4, seção 2",
  "summary": "A política informa garantia de 12 meses.",
  "confidence_state": "confirmed"
}
```

### Campos

| Campo | Obrigatório | Significado |
|---|---:|---|
| `id` | sim | identificador da evidência |
| `source_id` | sim | referência a `sources[].id` |
| `locator` | não | página, linha, registro, mensagem, chave ou posição |
| `summary` | sim | descrição curta e auditável do que a evidência sustenta |
| `confidence_state` | sim | estado JPN: `confirmed`, `inferred`, `unknown`, `conflicting` |
| `metadata` | não | metadados adicionais |

O contrato prefere `summary` a copiar grandes trechos de documentos. Quando um trecho literal for necessário, o sistema deve respeitar direitos de acesso, privacidade e limites de uso aplicáveis.

---

## 6. Claim

Uma `claim` é uma afirmação que o sistema pretende usar, transferir ou apresentar.

```json
{
  "id": "claim-001",
  "text": "A garantia vigente é de 12 meses.",
  "confidence_state": "conflicting",
  "evidence_refs": ["ev-001", "ev-002"],
  "status": "needs_resolution"
}
```

### Campos

| Campo | Obrigatório | Significado |
|---|---:|---|
| `id` | sim | identificador da afirmação |
| `text` | sim | afirmação em linguagem clara |
| `confidence_state` | sim | estado de confiança atual |
| `evidence_refs` | sim | zero ou mais referências a evidências |
| `status` | não | `usable`, `needs_confirmation`, `needs_resolution`, `rejected` |

### Regra de ausência de evidência

Uma afirmação factual sem evidência não deve receber `confirmed` apenas porque o modelo a produziu. Quando a confirmação depender de uma fonte ainda ausente, use `unknown` ou `inferred`, conforme o caso.

---

## 7. Conflitos

Quando duas evidências entram em conflito:

1. preserve as duas evidências;
2. marque as evidências ou a claim como `conflicting`;
3. registre a lacuna que impede resolução;
4. não escolha uma fonte apenas por ordem de recuperação, posição ou confiança do modelo;
5. aplique uma regra de precedência somente se essa regra estiver explicitamente disponível e for válida para o domínio.

Exemplo:

```json
{
  "claims": [
    {
      "id": "claim-garantia",
      "text": "O prazo de garantia é 12 ou 18 meses, dependendo de qual fonte tem precedência.",
      "confidence_state": "conflicting",
      "evidence_refs": ["ev-doc-a", "ev-doc-b"],
      "status": "needs_resolution"
    }
  ]
}
```

---

## 8. Integração com Jornada

`jornada.itens_de_contexto[].source` continua válido como referência simples e legível. Quando provenance estruturada estiver disponível, recomenda-se usar um identificador estável que possa ser resolvido no envelope:

```json
{
  "value": "Documento A informa garantia de 12 meses.",
  "confidence_state": "conflicting",
  "source": "ev-doc-a"
}
```

Nesta etapa, essa convenção é informativa e não altera o significado do campo `source` no schema atual.

---

## 9. Integração com RAG

Em RAG, provenance deve ser construída desde a recuperação:

```text
consulta
  ↓
fontes recuperadas
  ↓
evidências selecionadas + locators
  ↓
claims candidatas
  ↓
checagem de suficiência/conflito
  ↓
síntese
```

Boas práticas:

- preservar `source_id` e `locator` após reranking;
- não perder a relação claim → evidence durante a síntese;
- detectar quando múltiplos chunks são duplicatas da mesma fonte;
- não usar quantidade de chunks como substituto de independência de fontes;
- sinalizar quando a evidência recuperada é insuficiente para responder.

---

## 10. Integração com handoff multiagente

Um handoff pode transportar apenas o subconjunto de provenance necessário ao próximo agente.

O agente receptor deve poder responder:

- quais fatos estão confirmados;
- quais são inferências;
- quais claims têm evidência;
- quais fontes estão em conflito;
- quais lacunas ainda impedem a ação solicitada.

O receptor não deve reclassificar `inferred` como `confirmed` sem nova evidência ou regra explícita.

---

## 11. Transformações e auditoria

Quando uma automação transforma dados, recomenda-se registrar uma trilha observável:

```json
{
  "transformation": {
    "id": "tx-001",
    "operation": "normalize_customer_name",
    "input_refs": ["ev-018"],
    "output_claim_refs": ["claim-014"],
    "tool": "crm-normalizer@1.2.0"
  }
}
```

Essa trilha descreve **o que foi feito**, não o raciocínio interno que levou o modelo a fazê-lo.

---

## 12. Critérios mínimos para uso de `confirmed`

`confirmed` deve significar que existe base suficiente para tratar o item como confirmado **dentro do domínio e do contexto da execução**.

Exemplos de bases possíveis:

- mensagem explícita do usuário;
- registro de sistema autoritativo;
- documento vigente identificado;
- confirmação humana autorizada;
- resultado determinístico validado.

Não são confirmação suficiente por si só:

- memória do modelo;
- plausibilidade;
- repetição da mesma informação por chunks duplicados;
- uma inferência produzida por outro agente sem evidência adicional.

---

## 13. Falhas seguras

Se provenance estiver ausente, incompleta ou inconsistente:

- não inventar `source_id`;
- não criar localizadores falsos;
- não produzir citação que não possa ser resolvida;
- reduzir o estado de confiança quando apropriado;
- registrar a lacuna;
- pedir revisão humana quando a decisão exigir confirmação que não existe.

---

## 14. Próximos passos propostos

Antes de incorporar provenance ao schema principal:

1. testar este envelope com os exemplos de RAG, vendas, documentos e handoff;
2. criar JSON Schema próprio para o envelope;
3. adicionar validação opcional no SDK;
4. medir impacto nos evals de groundedness/UCR;
5. definir migração antes de qualquer mudança incompatível no estado JPN principal.

Até lá, `jpn.schema.json` permanece a autoridade para o estado JPN e este documento permanece um contrato experimental complementar.
