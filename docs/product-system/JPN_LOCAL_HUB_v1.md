# JPN Local Hub v1

## Objetivo

O `jpn-local-hub/` é um ponto de entrada interno para as ferramentas e materiais já existentes no ecossistema JPN. Ele reduz a fragmentação de navegação sem criar um novo produto, sem substituir os contratos de release e sem materializar artefatos finais.

## Rotas operacionais

- Método JPN → `metodo-jpn-site/index.html`
- JPN Prompt Pack → `prompt-pack-site/index.html`
- JPN Business → `business-site/index.html`
- JPN Prompt Builder → `product-site/index.html`
- JPN Gestão Fácil → `docs/products/gestao-facil/importacao-v0.3/README_IMPORTACAO.md`
- JPN Pro Kit → `pro-kit-site/index.html`

## Rotas comerciais internas

O hub também aponta para catálogo, apresentação, folha comercial, galeria de artes, diagnóstico e FAQ. Essas superfícies continuam internas, não indexadas e sem autorização de publicação.

## Fonte de verdade

O hub não define readiness. Estados e evidências devem ser verificados em:

- `PRODUCT_READINESS_BOARD_v1.md`;
- `PRODUCT_RELEASE_STATUS_v1.json`;
- `RELEASE_EVIDENCE_CONTRACT_v1.md`.

Se houver divergência, os contratos de produto/release prevalecem sobre o texto de navegação.

## Guardrails

- `publication_authorized: false`;
- `release_effect: none`;
- nenhuma API externa, login, analytics ou tracking;
- nenhum preço, checkout, formulário ou captura de lead;
- nenhuma publicação, anúncio, gasto ou contratação;
- nenhuma credencial, segredo ou dado financeiro real;
- nenhum aceite legal ou criação de conta com verificação de identidade;
- nenhuma página ou checker conta como evidência suficiente de release.

## Uso

Abrir `jpn-local-hub/index.html` diretamente no navegador. O hub funciona por links relativos e não precisa de servidor ou conexão de rede.