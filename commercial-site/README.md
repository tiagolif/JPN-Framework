# JPN Commercial Site v1

Superfície estática **interna e não publicada** para revisar a composição comercial dos seis produtos JPN sem interferir no `product-site` do Prompt Builder.

## Escopo

- uma landing de portfólio em `index.html`;
- um catálogo consolidado em `catalogo.html`;
- um diagnóstico local orientado por necessidade em `escolher-produto.html`;
- seis páginas individuais em `products/`;
- identidade visual alinhada aos tokens canônicos em `docs/brand/DESIGN_TOKENS.css`;
- conteúdo derivado dos contratos e materiais comerciais do repositório;
- seis produtos canônicos: Método JPN, JPN Prompt Builder, JPN Prompt Pack, JPN Business, JPN Gestão Fácil e JPN Pro Kit;
- Pro Kit explicitamente marcado como `EM PREPARAÇÃO`.

## Catálogo consolidado

`catalogo.html` apresenta os seis produtos em uma única superfície interna, com papel, indicação de uso, entrega central, limite e estado atual. Cada card utiliza o `data-product` canônico e um `data-release-state` que deve permanecer sincronizado com `docs/commercial/COMMERCIAL_RELEASE_STATE_v1.json`.

O catálogo registra as cinco rotas canônicas de `PRODUCT_USAGE_ROUTES_v1.json`. Essas rotas são fluxos de trabalho, não bundles, descontos ou ofertas. A regra central continua sendo escolher o menor produto que resolva a necessidade atual.

A página não usa formulário, input, script externo, tracking, URL externa, checkout ou coleta de dados e mantém `noindex,nofollow`.

## Diagnóstico de produto

`escolher-produto.html` deixou de ser um mapa editorial estático e passou a espelhar `docs/commercial/SMALL_BUSINESS_DIAGNOSTIC_v1.json`.

A página apresenta as cinco perguntas canônicas e calcula localmente um ponto de partida entre Método JPN, Prompt Pack, Prompt Builder, JPN Business e Gestão Fácil. O resultado usa a mesma mensagem, rota, regra de parada e continuidade opcional do contrato. O Pro Kit não é elegível como resultado enquanto sua rota permanecer apenas arquitetural.

O formulário é exclusivamente local: não possui `action`, endpoint, `fetch`, `XMLHttpRequest`, `sendBeacon`, `localStorage`, `sessionStorage`, analytics ou persistência. As respostas existem apenas durante a interação corrente no navegador. O formulário não constitui lead capture e não autoriza compra, contratação ou envio de mensagem.

O resultado é orientativo. A regra de decisão continua sendo começar pelo menor produto suficiente e parar quando a necessidade já estiver atendida.

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
node scripts/check-commercial-diagnostic-ui.mjs
npm run check:commercial-site
npm run check:commercial-navigation
npm run check:commercial-accessibility
npm run check:commercial-contrast
```

`check-commercial-catalog.mjs` valida os seis IDs canônicos, os links para as páginas individuais, a correspondência de `data-release-state` com `COMMERCIAL_RELEASE_STATE_v1.json`, a cobertura exata das cinco rotas canônicas, a regra do menor recurso suficiente e a ausência de promoção prematura, preço, checkout, formulário, URL externa ou claim de garantia.

`check-commercial-diagnostic-ui.mjs` compara `escolher-produto.html` com `SMALL_BUSINESS_DIAGNOSTIC_v1.json`: exige as cinco perguntas, todas as opções, os seis outcomes, fallback, produtos, rotas, mensagens e regras de parada; bloqueia combinações editoriais legadas, Pro Kit como resultado, claims comerciais de risco, envio de formulário, rede e armazenamento persistente. O gate é encadeado por `check-product-portfolio.mjs`.

`check:commercial-site` valida landing, seletor e páginas individuais, nomes e IDs canônicos, os três pilares JPN, stylesheet compartilhado, retorno relativo ao portfólio, estado `EM PREPARAÇÃO` do Pro Kit, regra de menor escopo e ausência de coleta externa, URL externa, preço em reais, CTA transacional ou claim explícito de garantia.

`check:commercial-navigation` percorre todos os arquivos HTML da superfície, executa primeiro o gate do catálogo, valida destinos relativos e fragmentos, rejeita protocolos externos e exige que cada card canônico da landing leve à página individual correspondente. Como o walk é dinâmico, catálogo e diagnóstico passam pelo mesmo gate de links internos.

`check:commercial-accessibility` valida os quinze HTMLs — landing, catálogo, diagnóstico, comparação, como funciona, casos de uso, primeiros passos, demonstração, FAQ e seis produtos — quanto a idioma, viewport, `noindex,nofollow`, título, hierarquia mínima com um único `h1`, landmarks principais, nomes acessíveis de links, `alt` em imagens quando existirem, pares `details/summary`, zoom permitido e ausência de `javascript:`. O gate também exige estado `:focus-visible` no CSS e fallback para `prefers-reduced-motion`.

`check:commercial-contrast` calcula contraste WCAG a partir dos tokens hex canônicos realmente usados na superfície. O gate cobre pares de texto principal, texto secundário, destaque, botão e foco contra os fundos/superfícies declarados; usa 4,5:1 para texto normal e 3:1 para foco não textual. Ele não substitui inspeção de transparências, gradientes, estados futuros ou conteúdo visual que venha a ser introduzido depois.

Os gates de portfólio, navegação, acessibilidade e contraste fazem parte do pipeline principal. A sincronização do diagnóstico entra pelo gate do portfólio; a integridade dos links continua coberta pelo gate de navegação.

## Acessibilidade incorporada nesta fase

O diagnóstico usa `fieldset`/`legend`, controles de rádio rotulados, mensagem de erro com `role="alert"`, resultado com `aria-live="polite"` e foco programático no resultado depois do cálculo. A superfície comercial mantém foco de teclado explícito, zoom do navegador disponível e redução de movimento. Esses controles ainda **não substituem teste manual com teclado, leitor de tela e inspeção em navegadores reais**.

## Guardrails

Esta superfície não contém preço, checkout, pixel, analytics, integração externa, captura de leads, botão de compra, escassez artificial ou promessa de resultado. O `meta robots` usa `noindex,nofollow` para reforçar que o artefato é de revisão interna.

Catálogo e diagnóstico não devem transformar abrangência em pressão comercial: se um produto individual resolver a necessidade, ele deve permanecer a indicação proporcional. Rotas descritas nessas superfícies são apenas fluxos de trabalho.

A existência destes arquivos **não autoriza publicação, anúncio, venda, coleta de dados, contratação, aceite de termos ou criação de conta externa**.

## Revisão necessária antes de qualquer publicação futura

1. QA visual em desktop e mobile;
2. teste manual de teclado, foco, radios, mensagens dinâmicas e leitura assistiva;
3. revisão do contraste efetivamente renderizado em transparências, gradientes e quaisquer novos componentes visuais;
4. revisão editorial humana da copy, catálogo e diagnóstico;
5. conferência dos claims contra os guardrails vigentes;
6. decisão explícita de quais produtos estão liberados para apresentação pública;
7. inclusão de links/CTAs reais somente depois de autorização específica;
8. revisão final de metadados e acessibilidade no ambiente que vier a ser publicado.

## Relação com o Prompt Builder

`commercial-site/` é deliberadamente separado de `product-site/`. O primeiro é uma composição comercial interna; o segundo é a aplicação funcional do JPN Prompt Builder. Essa separação reduz o risco de uma evolução comercial introduzir regressões no produto funcional.
