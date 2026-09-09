# JPN Commercial Site v1

Superfície estática **interna e não publicada** para revisar a composição comercial dos seis produtos JPN sem interferir no `product-site` do Prompt Builder.

## Escopo

- uma landing de portfólio em `index.html`;
- um seletor orientado por necessidade em `escolher-produto.html`;
- seis páginas individuais em `products/`;
- identidade visual alinhada aos tokens canônicos em `docs/brand/DESIGN_TOKENS.css`;
- conteúdo derivado de `docs/commercial/PRODUCT_PAGE_COPY_PACK_v1.md` e das regras de sales enablement;
- seis produtos canônicos: Método JPN, JPN Prompt Builder, JPN Prompt Pack, JPN Business, JPN Gestão Fácil e JPN Pro Kit;
- Pro Kit explicitamente marcado como `EM PREPARAÇÃO`.

## Seletor de produto

`escolher-produto.html` organiza o portfólio pela necessidade imediata do usuário, em vez de começar pelo produto. A regra central é escolher o menor escopo que resolva a necessidade atual. Por isso, o Pro Kit não é tratado como recomendação automática quando um produto individual já atende ao caso.

O seletor diferencia os seis produtos, registra GF-QA-10 como pendente na Gestão Fácil, preserva o estado `EM PREPARAÇÃO` do Pro Kit e apresenta quatro rotas de combinação como fluxos de trabalho — não como bundles, ofertas ou preços.

A página é totalmente estática: não usa formulário, input, script externo, tracking, URL externa, checkout ou coleta de dados.

## Páginas individuais

- `products/metodo-jpn.html`;
- `products/jpn-prompt-builder.html`;
- `products/jpn-prompt-pack.html`;
- `products/jpn-business.html`;
- `products/jpn-gestao-facil.html`;
- `products/jpn-pro-kit.html`.

Cada página possui hero, explicação de funcionamento/estrutura, entregáveis ou recursos, limites, FAQ, retorno relativo ao portfólio e `meta robots` em `noindex,nofollow`.

Os cards da landing apontam diretamente para essas seis páginas. A landing também aponta para o seletor, e o seletor aponta de volta ao portfólio e a cada página individual. A navegação continua totalmente relativa e local: nenhum link comercial externo é necessário nesta fase.

## Preflight

Execute:

```bash
npm run check:commercial-site
npm run check:commercial-navigation
npm run check:commercial-accessibility
npm run check:commercial-contrast
```

`check:commercial-site` valida landing, seletor e páginas individuais, nomes e IDs canônicos, os três pilares JPN, stylesheet compartilhado, retorno relativo ao portfólio, estado `EM PREPARAÇÃO` do Pro Kit, GF-QA-10 pendente no seletor, regra de menor escopo e ausência de coleta de dados, URL externa, preço em reais, CTA transacional ou claim explícito de garantia.

`check:commercial-navigation` percorre todos os arquivos HTML da superfície, valida destinos relativos e fragmentos, rejeita protocolos externos e exige que cada card canônico da landing leve à página individual correspondente. Como o walk é dinâmico, o seletor passa pelo mesmo gate de links internos.

`check:commercial-accessibility` valida os oito HTMLs — landing, seletor e seis produtos — quanto a idioma, viewport, `noindex,nofollow`, título, hierarquia mínima com um único `h1`, landmarks principais, nomes acessíveis de links, `alt` em imagens quando existirem, pares `details/summary`, zoom permitido e ausência de `javascript:`. O gate também exige estado `:focus-visible` no CSS e fallback para `prefers-reduced-motion`.

`check:commercial-contrast` calcula contraste WCAG a partir dos tokens hex canônicos realmente usados na superfície. O gate cobre pares de texto principal, texto secundário, destaque, botão e foco contra os fundos/superfícies declarados; usa 4,5:1 para texto normal e 3:1 para foco não textual. Ele não substitui inspeção de transparências, gradientes, estados futuros ou conteúdo visual que venha a ser introduzido depois.

Os quatro comandos fazem parte de `npm run build`.

## Acessibilidade incorporada nesta fase

A superfície comercial usa foco de teclado explícito em links e elementos `summary`, mantém zoom do navegador disponível, não depende de animação para compreensão e inclui redução de movimento para o `scroll-behavior`. O contraste dos pares canônicos passa a ter um gate calculado para impedir regressões nos tokens. Esses controles ainda **não substituem teste manual com teclado, leitor de tela e inspeção em navegadores reais**.

## Guardrails

Esta superfície não contém preço, checkout, formulário, pixel, analytics, integração externa, captura de leads, botão de compra, escassez artificial ou promessa de resultado. O `meta robots` usa `noindex,nofollow` para reforçar que o artefato é de revisão interna.

O seletor não deve transformar abrangência em pressão comercial: se um produto individual resolver a necessidade, ele deve permanecer a indicação proporcional. Combinações descritas no seletor são apenas rotas de trabalho.

A existência destes arquivos **não autoriza publicação, anúncio, venda, coleta de dados, contratação, aceite de termos ou criação de conta externa**.

## Revisão necessária antes de qualquer publicação futura

1. QA visual em desktop e mobile;
2. teste manual de teclado, foco e leitura assistiva;
3. revisão do contraste efetivamente renderizado em transparências, gradientes e quaisquer novos componentes visuais;
4. revisão editorial humana da copy e do seletor;
5. conferência dos claims contra os guardrails vigentes;
6. decisão explícita de quais produtos estão liberados para apresentação pública;
7. inclusão de links/CTAs reais somente depois de autorização específica;
8. revisão final de metadados e acessibilidade no ambiente que vier a ser publicado.

## Relação com o Prompt Builder

`commercial-site/` é deliberadamente separado de `product-site/`. O primeiro é uma composição comercial interna; o segundo é a aplicação funcional do JPN Prompt Builder. Essa separação reduz o risco de uma evolução comercial introduzir regressões no produto funcional.