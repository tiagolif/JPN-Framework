# Raw input → JPN draft

Status: experimental / draft API.

## Objetivo

`createJpnDraftFromText()` cria um estado JPN estruturalmente válido a partir de texto livre sem fingir que informações ausentes foram entendidas ou confirmadas.

A função é intencionalmente conservadora:

- preserva o texto bruto como contexto confirmado com `source: raw_input`;
- cria defaults operacionais mínimos apenas para manter o rascunho utilizável;
- registra campos não confirmados em `unresolvedFields`;
- registra defaults inferidos em `inferredFields`;
- adiciona incertezas explícitas ao estado;
- não usa modelo de IA, rede ou API externa;
- não transforma automaticamente suposições em fatos.

## Exemplo

```ts
import {
  createJpnDraftFromText,
  validateJpnState,
} from "jpn-framework";

const draft = createJpnDraftFromText(
  "Criar um plano de follow-up para leads que pararam de responder.",
  {
    naoInclui: ["inventar preço, estoque ou prazo"],
    saidas: ["plano de follow-up", "mensagens sugeridas"],
    formatoDaResposta: "Markdown",
  },
);

const validation = validateJpnState(draft.state);
```

## O que a função não faz

Ela não é um parser semântico completo. Em especial, ela não tenta descobrir automaticamente:

- objetivo de negócio;
- escopo real;
- política da empresa;
- fontes confiáveis;
- critérios de aceitação;
- autoridade do usuário ou do agente;
- fatos ausentes no texto bruto.

Esses campos devem ser confirmados pelo usuário, por regras explícitas ou por uma etapa posterior de extração com provenance adequado.

## Uso em produtos

O Prompt Builder pode usar esta API como primeira etapa para converter uma solicitação curta em um rascunho editável. Antes da execução final, a interface deve destacar `unresolvedFields` e permitir revisão humana.

## Evolução futura

Uma futura camada de extração assistida por modelo pode produzir `JpnDraftHints`, mas deve manter a separação entre conteúdo confirmado, inferido, desconhecido e conflitante.
