# Prompt Builder — QA contextual móvel v1

Estado: `candidate / human mobile inspection pending`

## Origem

O primeiro teste manual real da fixture móvel revelou uma limitação útil: a ideia já continha estado atual e lacunas comerciais, mas o gerador v1 ainda escrevia `Estado atual: Não informado`. A Narrativa também era genérica e a regra “faça perguntas essenciais” podia devolver ao operador perguntas que, em atendimento, deveriam ser incorporadas naturalmente à própria mensagem ao cliente.

Isso é tratado como limitação de implementação do Builder, não como evidência de falha ou superioridade do Método JPN.

## Correção candidata

A fixture `product-site/mobile-context-aware-test.html` carrega `mobile-context-aware.js`, que:

- preserva as frases fornecidas pelo usuário como contexto confirmado;
- extrai apenas pendências explicitamente sinalizadas no pedido, sem promover inferências a fatos;
- preserva o campo de restrições quando preenchido;
- adapta estado final e formato ao tipo de tarefa;
- para `Atendimento / vendas`, orienta entregar primeiro a mensagem pronta e transformar lacunas comerciais em perguntas naturais ao cliente;
- evita preâmbulo de raciocínio quando o contexto já é suficiente;
- continua sem API, modelo remoto, preço, checkout ou publicação.

## Caso de regressão PB-CTX-01 — guarda-roupa / WhatsApp

Entrada de ideia:

> Quero criar uma abordagem de venda pelo WhatsApp para um cliente que demonstrou interesse em um guarda-roupa, mas ainda não informou orçamento, tamanho disponível no quarto nem forma de pagamento. Quero uma resposta profissional, curta e natural, que avance a conversa sem pressionar o cliente.

Tipo: `Atendimento / vendas`.

Restrição recomendada para o teste:

> Não inventar preço, estoque, prazo de entrega, medidas, condição de pagamento ou promoção. Não usar urgência artificial e não pressionar o cliente.

Critérios de aceite:

1. O texto da ideia aparece em `Contexto confirmado` e não é substituído por `Estado atual: Não informado`.
2. Orçamento, espaço/medida e forma de pagamento aparecem como pendências, não como fatos confirmados.
3. A restrição digitada aparece integralmente em `Restrições informadas`.
4. A Narrativa é específica para atendimento/vendas.
5. O prompt pede a entrega comercial diretamente quando possível, sem exigir resumo de raciocínio antes da mensagem.
6. O prompt orienta que lacunas comerciais sejam descobertas naturalmente na conversa quando isso não bloquear segurança.
7. Nenhum preço, estoque, prazo, medida, promoção ou condição comercial é inventado.

Resultado nesta branch: `pending human mobile inspection`.

## Casos adicionais

- `PB-CTX-02`: análise documental — fatos, inferências, conflitos e lacunas devem permanecer separados.
- `PB-CTX-03`: automação — Narrativa deve priorizar fluxo, exceções, validações e intervenção humana.
- `PB-CTX-04`: desenvolvimento — não assumir arquitetura/dependências e exigir critérios de aceite.
- `PB-CTX-05`: texto/conteúdo — priorizar peça final sem inventar números, depoimentos ou condições.
- `PB-CTX-06`: plano/estratégia — priorizar sequência, dependências, premissas e próximos passos.

## Limites

A extração atual é determinística e deliberadamente conservadora. Ela não é compreensão semântica completa e não usa IA para inferir fatos. Uma futura evolução pode usar classificação mais robusta, desde que preserve rastreabilidade entre informação fornecida, inferência e lacuna.

Nenhum caso é marcado como `PASS` sem evidência correspondente. Nenhuma autorização de publicação, venda, gasto ou ação externa é criada por este documento.