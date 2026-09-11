# Commercial Release State v1

Status: internal governance / no publication authorization.

## Objetivo

Manter a superfície comercial interna sincronizada com `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json` para evitar que páginas, copies ou materiais tratem um produto como liberado enquanto ainda existem dependências canônicas abertas.

A fonte estruturada é `docs/commercial/COMMERCIAL_RELEASE_STATE_v1.json`.

## Regra derivada

Para cada produto:

- se qualquer dependência canônica estiver em `pending`, `in-progress` ou `blocked`, o estado comercial obrigatório é `internal-review`;
- nesse caso, `public_presentation_allowed` deve permanecer `false`;
- somente quando todas as dependências estiverem em `passed` ou `not-applicable` o contrato permite `release-ready` e `public_presentation_allowed: true`;
- o contrato comercial nunca altera o estado de release por conta própria.

## Estado atual

Os seis produtos permanecem em `internal-review` porque o contrato canônico ainda possui dependências abertas. O arquivo JSON registra os IDs exatos dessas dependências por produto e deve acompanhar qualquer mudança futura do registro de release.

Isso inclui, entre outros gates, revisão editorial/PDF dos produtos editoriais, QA físico contextual do Prompt Builder, GF-QA-10 da Gestão Fácil e freeze/hashes/CI do Pro Kit.

## Checker

Execute:

```bash
node scripts/check-commercial-release-state.mjs
```

O checker valida:

1. correspondência exata entre os produtos do contrato canônico e da camada comercial;
2. lista e ordem das dependências ainda abertas;
3. estado `internal-review` enquanto houver bloqueios;
4. `public_presentation_allowed: false` enquanto houver bloqueios;
5. existência da página comercial individual de cada produto;
6. correspondência de `data-product` com o ID canônico;
7. manutenção de `noindex,nofollow` nas páginas internas;
8. ausência de frases explícitas de disponibilidade/venda prematura em produtos ainda não liberados.

## Limites

Um PASS deste checker significa apenas que a camada comercial está coerente com o contrato de release naquele commit.

Ele não comprova:

- revisão editorial humana;
- QA visual, responsivo ou assistivo;
- compatibilidade física de planilhas;
- PDF final;
- freeze de artefatos;
- CI final de release;
- autorização de publicação, anúncio, checkout, precificação ou venda.

Nenhuma dessas etapas deve ser promovida por inferência a partir deste gate.
