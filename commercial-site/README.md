# JPN Commercial Site v1

Superfície estática **interna e não publicada** para revisar a composição comercial dos seis produtos JPN sem interferir no `product-site` do Prompt Builder.

## Escopo

- uma landing de portfólio em `index.html`;
- seis páginas individuais em `products/`;
- identidade visual alinhada aos tokens canônicos em `docs/brand/DESIGN_TOKENS.css`;
- conteúdo derivado de `docs/commercial/PRODUCT_PAGE_COPY_PACK_v1.md`;
- seis produtos canônicos: Método JPN, JPN Prompt Builder, JPN Prompt Pack, JPN Business, JPN Gestão Fácil e JPN Pro Kit;
- Pro Kit explicitamente marcado como `EM PREPARAÇÃO`.

## Páginas individuais

- `products/metodo-jpn.html`;
- `products/jpn-prompt-builder.html`;
- `products/jpn-prompt-pack.html`;
- `products/jpn-business.html`;
- `products/jpn-gestao-facil.html`;
- `products/jpn-pro-kit.html`.

Cada página possui hero, explicação de funcionamento/estrutura, entregáveis ou recursos, limites, FAQ, retorno relativo ao portfólio e `meta robots` em `noindex,nofollow`.

Os cards da landing apontam diretamente para essas seis páginas. A navegação continua totalmente relativa e local: nenhum link comercial externo é necessário nesta fase.

## Preflight

Execute:

```bash
npm run check:commercial-site
npm run check:commercial-navigation
npm run check:commercial-accessibility
```

`check:commercial-site` valida landing e páginas individuais, nomes e IDs canônicos, os três pilares JPN, stylesheet compartilhado, retorno relativo ao portfólio, estado `EM PREPARAÇÃO` do Pro Kit e ausência de coleta de dados, URL externa, preço em reais, CTA transacional ou claim explícito de garantia.

`check:commercial-navigation` percorre todos os arquivos HTML da superfície, valida destinos relativos e fragmentos, rejeita protocolos externos e exige que cada card canônico da landing leve à página individual correspondente.

`check:commercial-accessibility` valida os sete HTMLs quanto a idioma, viewport, `noindex,nofollow`, título, hierarquia mínima com um único `h1`, landmarks principais, nomes acessíveis de links, `alt` em imagens quando existirem, pares `details/summary`, zoom permitido e ausência de `javascript:`. O gate também exige estado `:focus-visible` no CSS e fallback para `prefers-reduced-motion`.

Os três comandos fazem parte de `npm run build`.

## Acessibilidade incorporada nesta fase

A superfície comercial usa foco de teclado explícito em links e elementos `summary`, mantém zoom do navegador disponível, não depende de animação para compreensão e inclui redução de movimento para o `scroll-behavior`. Esses controles são preflight estrutural; eles **não substituem teste manual com teclado, leitor de tela, contraste calculado e inspeção em navegadores reais**.

## Guardrails

Esta superfície não contém preço, checkout, formulário, pixel, analytics, integração externa, captura de leads, botão de compra, escassez artificial ou promessa de resultado. O `meta robots` usa `noindex,nofollow` para reforçar que o artefato é de revisão interna.

A existência destes arquivos **não autoriza publicação, anúncio, venda, coleta de dados, contratação, aceite de termos ou criação de conta externa**.

## Revisão necessária antes de qualquer publicação futura

1. QA visual em desktop e mobile;
2. teste manual de teclado, foco, contraste e leitura assistiva;
3. revisão editorial humana da copy;
4. conferência dos claims contra os guardrails vigentes;
5. decisão explícita de quais produtos estão liberados para apresentação pública;
6. inclusão de links/CTAs reais somente depois de autorização específica;
7. revisão final de metadados e acessibilidade no ambiente que vier a ser publicado.

## Relação com o Prompt Builder

`commercial-site/` é deliberadamente separado de `product-site/`. O primeiro é uma composição comercial interna; o segundo é a aplicação funcional do JPN Prompt Builder. Essa separação reduz o risco de uma evolução comercial introduzir regressões no produto funcional.