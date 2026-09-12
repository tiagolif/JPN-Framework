# Manifesto de ativos comerciais JPN v1

Este documento é a versão legível de `COMMERCIAL_ASSET_MANIFEST_v1.json`. Ele registra os ativos visuais já existentes e evita que capas, artes sociais, marcas e templates fiquem órfãos ou sejam usados fora do produto e do estado corretos.

## Estado

- Publicação autorizada: **não**.
- Efeito sobre release: **nenhum**.
- Uso permitido: prévia interna, referência de página, candidato de conteúdo ou fonte de design conforme o tipo do ativo.
- O manifesto não transforma nenhuma peça em anúncio, oferta, checkout ou material público.

## Cobertura do portfólio

Cada um dos seis produtos possui exatamente uma capa canônica:

| Produto | Capa |
| --- | --- |
| Método JPN | `assets/covers/metodo-jpn-v1.svg` |
| JPN Prompt Pack | `assets/covers/jpn-prompt-pack-v1.svg` |
| JPN Business | `assets/covers/jpn-business-v1.svg` |
| JPN Prompt Builder | `assets/covers/jpn-prompt-builder-v1.svg` |
| JPN Pro Kit | `assets/covers/jpn-pro-kit-v1.svg` |
| JPN Gestão Fácil | `assets/covers/jpn-gestao-facil-v01.svg` |

Todos também possuem ao menos uma peça social própria. O Método JPN utiliza o carrossel de quatro cards; Gestão Fácil possui duas peças; Prompt Pack, Business, Prompt Builder e Pro Kit possuem peças individuais.

## Ativos compartilhados

`jpn-mark.svg` e `jpn-lockup.svg` pertencem à marca JPN e não a um único produto. As peças `jpn-manifesto`, `jpn-jornada-precisao-narrativa` e `jpn-principio-lacunas` são classificadas como conteúdo do framework. `jpn-ecossistema` e `jpn-comparacao-conceitual` são peças do ecossistema/portfólio.

Os três arquivos em `assets/social/templates/` são fontes de design, não peças prontas para publicação.

## Proveniência

O manifesto liga os ativos às fontes canônicas que justificam seu conteúdo ou sua forma. Entre elas estão:

- `PRODUCT_PORTFOLIO_v1.json` para produtos e escopo;
- `PRODUCT_ONE_PAGERS_v1.json` para a representação resumida de cada produto;
- `JPN_VISUAL_IDENTITY_v1.json` e `BRAND_KIT_v1.md` para identidade;
- `CREATIVE_BRIEFS_v1.md` e `SOCIAL_CONTENT_LIBRARY_v1.md` para conteúdo social;
- `SOCIAL_ART_SYSTEM_v1.md` e `SOCIAL_PRODUCTION_KIT_v1.md` para templates e produção.

## Regra de integridade

O checker associado percorre recursivamente `assets/brand`, `assets/covers` e `assets/social`. Todo SVG encontrado nesses diretórios deve estar registrado no manifesto e todo caminho registrado deve existir. Assim, uma nova arte adicionada sem classificação passa a gerar falha em vez de ficar silenciosamente fora da governança.

Também são validados IDs e caminhos únicos, fontes existentes, `product_id` válido, cobertura de capa e arte social dos seis produtos e os bloqueios de publicação/release.

## Guardrails

Nenhum ativo deste inventário pode, por sua presença no repositório, ser interpretado como autorização para publicar, anunciar ou vender. Preço, checkout, captura de lead, tracking, dado financeiro real e afirmação de prontidão final permanecem bloqueados.

A capa e a arte do JPN Pro Kit continuam apenas internas enquanto suas dependências de release estiverem abertas.
