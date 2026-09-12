# JPN Commercial Site v1

Superfície estática **interna e não publicada** para revisar a composição comercial dos seis produtos JPN sem interferir no `product-site` do Prompt Builder.

## Escopo

- uma landing de portfólio em `index.html`;
- um catálogo consolidado em `catalogo.html`;
- um seletor orientado por necessidade em `escolher-produto.html`;
- seis páginas individuais em `products/`;
- identidade visual alinhada aos tokens canônicos em `docs/brand/DESIGN_TOKENS.css`;
- conteúdo derivado dos contratos e materiais comerciais do repositório;
- seis produtos canônicos: Método JPN, JPN Prompt Builder, JPN Prompt Pack, JPN Business, JPN Gestão Fácil e JPN Pro Kit;
- Pro Kit explicitamente marcado como `EM PREPARAÇÃO`.

## Catálogo consolidado

`catalogo.html` apresenta os seis produtos em uma única superfície interna, com papel, indicação de uso, entrega central, limite e estado atual. Cada card utiliza o `data-product` canônico e um `data-release-state` que deve permanecer sincronizado com `docs/commercial/COMMERCIAL_RELEASE_STATE_v1.json`.

O catálogo também registra quatro rotas de continuidade entre produtos. Essas rotas são combinações de trabalho, não bundles, descontos ou ofertas. A regra central continua sendo escolher o menor produto que resolva a necessidade atual.

A página não usa formulário, input, script externo, tracking, URL externa, checkout ou coleta de dados e mantém `noindex,nofollow`.

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

A navegação continua totalmente relativa e local: nenhum link comercial externo é necessário nesta fase.

## Preflight

Execute:

```bash
node scripts/check-commercial-catalog.mjs
npm run check:commercial-site
npm run check:commercial-navigation
npm run check:commercial-accessibility
npm run check:commercial-contrast
```

`check-commercial-catalog.mjs` valida os seis IDs canônicos, os links para as páginas individuais, a correspondência de `data-release-state` com `COMMERCIAL_RELEASE_STATE_v1.json`, a regra do menor recurso suficiente e a ausência de promoção prematura, preço, checkout, formulário, URL externa ou claim de garantia. Ele é executado automaticamente pelo gate de navegação comercial.

`check:commercial-site` valida landing, seletor e páginas individuais, nomes e IDs canônicos, os três pilares JPN, stylesheet compartilhado, retorno relativo ao portfólio, estado `EM PREPARAÇÃO` do Pro Kit, GF-QA-10 pendente no seletor, regra de menor escopo e ausência de coleta de dados, URL externa, preço em reais, CTA transacional ou claim explícito de garantia.

`check:commercial-navigation` percorre todos os arquivos HTML da superfície, executa primeiro o gate do catálogo, valida destinos relativos e fragmentos, rejeita protocolos externos e exige que cada card canônico da landing leve à página individual correspondente. Como o walk é dinâmico, catálogo e seletor passam pelo mesmo gate de links internos.

`check:commercial-accessibility` valida os quinze HTMLs — landing, catálogo, seletor, comparação, como funciona, casos de uso, primeiros passos, demonstração, FAQ e seis produtos — quanto a idioma, viewport, `noindex,nofollow`, título, hierarquia mínima com um único `h1`, landmarks principais, nomes acessíveis de links, `alt` em imagens quando existirem, pares `details/summary`, zoom permitido e ausência de `javascript:`. O gate também exige estado `:focus-visible` no CSS e fallback para `prefers-reduced-motion`.

`check:commercial-contrast` calcula contraste WCAG a partir dos tokens hex canônicos realmente usados na superfície. O gate cobre pares de texto principal, texto secundário, destaque, botão e foco contra os fundos/superfícies declarados; usa 4,5:1 para texto normal e 3:1 para foco não textual. Ele não substitui inspeção de transparências, gradientes, estados futuros ou conteúdo visual que venha a ser introduzido depois.

Os gates de navegação, acessibilidade e contraste já fazem parte de `npm run build`; como o catálogo foi integrado ao gate de navegação, sua sincronização comercial também passa pelo pipeline principal.

## Acessibilidade incorporada nesta fase

A superfície comercial usa foco de teclado explícito em links e elementos `summary`, mantém zoom do navegador disponível, não depende de animação para compreensão e inclui redução de movimento para o `scroll-behavior`. O contraste dos pares canônicos passa a ter um gate calculado para impedir regressões nos tokens. Esses controles ainda **não substituem teste manual com teclado, leitor de tela e inspeção em navegadores reais**.

## Guardrails

Esta superfície não contém preço, checkout, formulário, pixel, analytics, integração externa, captura de leads, botão de compra, escassez artificial ou promessa de resultado. O `meta robots` usa `noindex,nofollow` para reforçar que o artefato é de revisão interna.

Catálogo e seletor não devem transformar abrangência em pressão comercial: se um produto individual resolver a necessidade, ele deve permanecer a indicação proporcional. Combinações descritas nessas superfícies são apenas rotas de trabalho.

A existência destes arquivos **não autoriza publicação, anúncio, venda, coleta de dados, contratação, aceite de termos ou criação de conta externa**.

## Revisão necessária antes de qualquer publicação futura

1. QA visual em desktop e mobile;
2. teste manual de teclado, foco e leitura assistiva;
3. revisão do contraste efetivamente renderizado em transparências, gradientes e quaisquer novos componentes visuais;
4. revisão editorial humana da copy, catálogo e seletor;
5. conferência dos claims contra os guardrails vigentes;
6. decisão explícita de quais produtos estão liberados para apresentação pública;
7. inclusão de links/CTAs reais somente depois de autorização específica;
8. revisão final de metadados e acessibilidade no ambiente que vier a ser publicado.

## Relação com o Prompt Builder

`commercial-site/` é deliberadamente separado de `product-site/`. O primeiro é uma composição comercial interna; o segundo é a aplicação funcional do JPN Prompt Builder. Essa separação reduz o risco de uma evolução comercial introduzir regressões no produto funcional.
