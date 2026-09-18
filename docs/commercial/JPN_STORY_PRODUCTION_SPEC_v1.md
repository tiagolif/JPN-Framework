# JPN — Especificação de Produção de Stories v1

Status: **interno / não publicado**

## Objetivo

Transformar a biblioteca canônica `JPN_SOCIAL_COPY_LIBRARY_v1.md` em uma família consistente de 24 telas verticais (4 por produto), pronta para produção e revisão sem criar novas promessas comerciais.

## Escopo

Produtos: JPN Prompt Builder, Método JPN, JPN Prompt Pack, JPN Business, Gestão Fácil e JPN Pro Kit.

Formato de cada tela: **1080 × 1920 SVG**. Cada sequência contém exatamente quatro telas, preservando a ordem e o sentido da copy canônica.

## Sistema visual

- Fundo escuro e painel de conteúdo alinhados à identidade JPN existente.
- Cor teal JPN usada como destaque, nunca como substituto de contraste textual.
- Hierarquia: marca/produto → mensagem principal → apoio → indicador `1/4`...`4/4`.
- Tela 4 contém apenas CTA informativo compatível com a biblioteca canônica.
- Rodapé obrigatório: `Arte interna · não publicada`.
- Evitar texto encostado nas bordas; manter área segura mínima de 96 px nas laterais e 160 px no topo/rodapé.
- Não rasterizar texto: preservar conteúdo textual no SVG para acessibilidade e revisão.
- Cada SVG deve possuir `title` e `desc` coerentes com produto e número da tela.

## Nomenclatura

Diretório proposto: `commercial-site/assets/social/stories/`.

Padrão: `jpn-<slug-produto>-story-0N-1080x1920.svg`, com `N` de 1 a 4.

Slugs: `prompt-builder`, `metodo-jpn`, `prompt-pack`, `business`, `gestao-facil`, `pro-kit`.

## Conteúdo canônico

O texto de cada sequência deve ser copiado de `docs/commercial/JPN_SOCIAL_COPY_LIBRARY_v1.md`, seção **Story — 4 telas**, sem introduzir preço, checkout, urgência, escassez, depoimento, métrica, cliente, renda prometida ou compatibilidade não validada.

### Guardrails específicos

**Gestão Fácil:** preservar o estado de reconstrução controlada e QA multiplataforma pendente. A sequência não pode sugerir que a planilha substitui ERP, contabilidade, sistema fiscal ou bancário.

**JPN Pro Kit:** preservar o estado de preparação e a lógica da menor solução suficiente; não apresentar o kit completo como compra obrigatória.

## Registro obrigatório

Ao materializar os SVGs:

1. registrar todos os 24 ativos no manifesto comercial canônico;
2. adicionar previews à galeria interna de artes;
3. manter `release_ready=false` e `publication_authorized=false`;
4. executar os validadores de manifesto, galeria, visual e superfícies comerciais;
5. não promover os ativos para release antes de inspeção visual humana.

## Critérios de revisão

Cada sequência deve ser verificada em ordem 1→4 quanto a continuidade narrativa, legibilidade em viewport móvel, contraste, ausência de overflow, consistência de margens, identificação inequívoca do produto, CTA informativo e ausência de alegações novas.

A aprovação automatizada confirma apenas estrutura e rastreabilidade. A aprovação visual final continua sendo um gate humano.
