# Prompt Builder — Gate de regressão contextual v1

Estado: `candidate / automated structural regression gate added / human mobile QA pending`.

## Objetivo

Transformar os achados do primeiro teste móvel real do JPN Prompt Builder em regressões executáveis antes de integrar a lógica contextual ao Builder principal.

O gate não tenta provar compreensão semântica universal. Ele verifica propriedades determinísticas que não devem regredir enquanto a implementação evolui.

## Caso de referência PB-CTX-01

Entrada: cliente demonstrou interesse em um guarda-roupa e ainda não informou orçamento, tamanho/espaço disponível nem forma de pagamento.

Restrições: não inventar preço, estoque, prazo, medidas, condição de pagamento ou promoção; não usar urgência artificial nem pressionar o cliente.

O resultado candidato precisa:

- preservar o interesse em guarda-roupa como contexto confirmado;
- reconhecer orçamento/faixa de valor como pendência;
- reconhecer espaço/medida disponível como pendência;
- reconhecer forma de pagamento como pendência;
- preservar integralmente as restrições digitadas;
- adaptar a Narrativa a Atendimento/vendas;
- orientar entrega da mensagem pronta antes de explicações;
- permitir que lacunas comerciais sejam tratadas como perguntas naturais ao cliente quando não bloquearem segurança;
- não reintroduzir `Estado atual: Não informado` para contexto já fornecido;
- não reintroduzir `Restrições: Não informadas` quando o campo foi preenchido.

## Cobertura adicional

O script `scripts/check-prompt-builder-context-regressions.mjs` cobre também:

- PB-CTX-02 — análise com causa desconhecida e dados por canal ausentes;
- PB-CTX-03 — automação com intervenção humana antes de ação externa;
- PB-CTX-04 — desenvolvimento sem dependências confirmadas;
- PB-CTX-05 — conteúdo limitado a briefing confirmado;
- PB-CTX-06 — estratégia sem linha de base suficiente para metas numéricas.

## Execução

```bash
node scripts/check-prompt-builder-context-regressions.mjs
```

O módulo `product-site/mobile-context-aware.js` pode agora ser importado em Node sem exigir DOM. O binding ao botão `generate` só é registrado quando `document` existe.

## O que este gate comprova

- preservação de trechos obrigatórios;
- ausência de regressões textuais conhecidas;
- ordem Jornada → Precisão → Narrativa;
- adaptação determinística por tipo de tarefa;
- extração conservadora das pendências explícitas usadas no caso de referência.

## O que este gate não comprova

- compreensão semântica completa;
- qualidade universal de prompts;
- superioridade sobre outras metodologias;
- comportamento de clipboard, teclado virtual, viewport ou `localStorage` em aparelho real;
- compatibilidade final do bundle offline;
- QA humano aprovado;
- release, venda ou publicação autorizados.

## Próximo passo seguro

Após o gate estrutural e a inspeção móvel da fixture v2, integrar a transformação contextual ao Builder principal por uma camada compartilhada, mantendo o SDK canônico e seus validadores como fonte de integridade estrutural.

## Guardrails

Nenhum gasto, anúncio, checkout, conta externa, dado financeiro, credencial, aceite legal, publicação comercial ou autorização de venda faz parte deste gate.
