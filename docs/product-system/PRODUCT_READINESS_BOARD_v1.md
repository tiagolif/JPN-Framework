# Product Readiness Board v1

Este board consolida o estado operacional dos seis produtos JPN sem substituir os contratos de portfólio e release. Ele existe para responder rapidamente: **o que está bloqueado, o que está em andamento e qual é o próximo avanço seguro sem fabricar evidência**.

## Resumo atual

| Produto | Prontidão | Release | Próximo avanço seguro |
| --- | --- | --- | --- |
| Método JPN | bloqueado | não | preparar revisão/composição; revisão humana e PDF seguem abertos |
| JPN Prompt Pack | bloqueado | não | preparar revisão/composição preservando os 18 templates; PDF segue aberto |
| JPN Business | em andamento | não | continuar composição do candidato; revisão humana e PDF seguem abertos |
| JPN Prompt Builder | bloqueado | não | preparar checklist e pacote offline candidato; celular e CI seguem obrigatórios |
| JPN Pro Kit | bloqueado | não | preparar inventário do bundle; não congelar nem gerar hashes finais |
| JPN Gestão Fácil | bloqueado | não | preparar roteiro de compatibilidade; teste físico multiplataforma segue obrigatório |

## Regra de leitura

- `blocked`: nenhum gate está em andamento e ainda há dependências abertas.
- `in-progress`: ao menos uma dependência está explicitamente `in-progress` no contrato de release.
- `release_ready`: só pode ser `true` quando todas as dependências do produto estiverem `passed` ou `not-applicable` com a evidência exigida.

O estado atual é **0 de 6 produtos release-ready**. Isso é intencional: presença de conteúdo, arte, página, candidata ou especificação não equivale a aprovação de release.

## Fronteira da automação

Pode avançar autonomamente: documentação, especificações, checkers, preparação de candidatos, inventários, roteiros de QA e organização dos materiais existentes.

Não pode avançar por inferência: revisão humana, QA físico, compatibilidade em aplicativos externos, CI verde inexistente, freeze de artefatos dependentes, hashes finais antes do freeze ou revisão página a página ainda não executada.

## Guardrails

Este board não autoriza publicação, anúncio, venda, preço, checkout, captura de lead ou tracking. Também não deve usar dados financeiros reais, dados pessoais, credenciais ou segredos para produzir evidência de gate.
