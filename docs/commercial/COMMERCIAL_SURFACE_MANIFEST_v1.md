# JPN Commercial Surface Manifest v1

Status: **revisão interna**. Publicação não autorizada. Efeito em release: **nenhum**.

## Objetivo

Este manifesto transforma a superfície comercial existente em um inventário canônico. Ele não cria novas páginas nem substitui as fontes de conteúdo: registra **quais páginas existem, para que servem, de quais contratos dependem e quais ações locais podem oferecer**.

A regra central continua sendo apresentar o menor produto suficiente para a necessidade atual, sem preço, checkout, captura de lead, tracking, escassez artificial ou promessa de resultado.

## Superfície coberta

O site interno contém 15 HTMLs:

- landing do portfólio;
- catálogo consolidado;
- diagnóstico local;
- comparação de produtos;
- explicação de funcionamento;
- casos de uso;
- primeiros passos;
- demonstração guiada;
- perguntas frequentes;
- seis páginas individuais de produto.

O arquivo estruturado `COMMERCIAL_SURFACE_MANIFEST_v1.json` é a fonte para IDs, paths, tipo de superfície, propósito, contratos de origem, ações permitidas e, nas páginas de produto, produto e capa correspondentes.

## Mapa de origem

| Superfície | Fonte principal |
|---|---|
| Portfólio | `PRODUCT_PORTFOLIO_v1.json` + `PRODUCT_USAGE_ROUTES_v1.json` |
| Catálogo | portfólio + rotas + release comercial + matriz comparativa |
| Diagnóstico | `SMALL_BUSINESS_DIAGNOSTIC_v1.json` |
| Comparação | `PRODUCT_COMPARISON_MATRIX_v1.json` |
| Como funciona | `HOW_JPN_WORKS_v1.md` + terminologia canônica |
| Casos de uso | `SMALL_BUSINESS_USE_CASES_v1.json` |
| Primeiros passos | `CUSTOMER_ONBOARDING_GUIDE_v1.json` |
| Demonstração | `GUIDED_DEMO_PLAYBOOK_v1.json` |
| FAQ | `PRODUCT_FAQ_OBJECTIONS_v1.json` |
| Páginas de produto | one-pagers + release comercial + documentação do produto |

## Regras globais

Todas as superfícies permanecem `noindex,nofollow`, usam navegação relativa/local e não podem conter preço, checkout, CTA transacional, lead capture, tracking ou publicação autorizada.

O diagnóstico é a única exceção para controles de formulário. O formulário deve continuar sem envio, sem endpoint, sem rede e sem persistência.

## Páginas de produto

Cada uma das seis páginas individuais deve:

1. mapear para exatamente um ID de `PRODUCT_PORTFOLIO_v1.json`;
2. existir também em `COMMERCIAL_RELEASE_STATE_v1.json`;
3. preservar `public_presentation_allowed: false` enquanto houver dependências abertas;
4. apontar para a capa já existente em `assets/covers/`;
5. manter os limites específicos do produto.

O JPN Pro Kit continua **EM PREPARAÇÃO** enquanto freeze, hashes e CI final estiverem abertos. A JPN Gestão Fácil continua sendo apoio gerencial e não substitui contabilidade, banco, fiscal, ERP ou auditoria.

## Gate automático

`node scripts/check-commercial-surface-manifest.mjs`

O gate verifica cobertura exata dos HTMLs, unicidade de IDs e paths, existência de contratos e capas, correspondência dos seis produtos com portfólio e release comercial, `noindex,nofollow`, stylesheet compartilhado e a política especial do diagnóstico.

Ele também bloqueia autorização de publicação, preço, checkout, tracking, lead capture e CTA transacional no próprio contrato.

## O que este manifesto não faz

- não publica o site;
- não cria URL externa;
- não cria checkout, formulário de contato ou analytics;
- não promove nenhum produto a release final;
- não substitui QA visual/manual;
- não aprova termos, preços ou claims futuros.

O objetivo é reduzir drift e tornar a superfície existente auditável antes de qualquer decisão futura de publicação.
