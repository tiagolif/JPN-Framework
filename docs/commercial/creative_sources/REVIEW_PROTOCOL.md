# Protocolo de revisão visual — JPN-CR-01..08

> **CANDIDATO INTERNO · NÃO PUBLICAR**  
> `release_ready=false` · `publication_authorized=false`

Este protocolo transforma a inspeção visual das oito peças comerciais em uma etapa rastreável e repetível. Ele **não substitui revisão humana** e não autoriza publicação.

## Inventário e formatos canônicos

| ID | Fonte | Formato |
|---|---|---:|
| JPN-CR-01 | `JPN-CR-01-metodo-jpn-card.svg` | 1080×1080 |
| JPN-CR-02 | `JPN-CR-02-prompt-builder-card.svg` | 1080×1080 |
| JPN-CR-03 | `JPN-CR-03-prompt-pack-card.svg` | 1080×1080 |
| JPN-CR-04 | `JPN-CR-04-jpn-business-card.svg` | 1080×1080 |
| JPN-CR-05 | `JPN-CR-05-gestao-facil-card.svg` | 1080×1080 |
| JPN-CR-06 | `JPN-CR-06-pro-kit-card.svg` | 1080×1080 |
| JPN-CR-07 | `JPN-CR-07-ecossistema-story.svg` | 1080×1920 |
| JPN-CR-08 | `JPN-CR-08-ecossistema-hero.svg` | 1920×1080 |

A galeria offline `index.html` é a superfície de comparação. O arquivo `review-manifest.json` é gerado pelo CI a partir das fontes e registra SHA-256, dimensões e estado `PENDING_HUMAN` de cada peça.

## Passo 1 — integridade antes da aparência

Antes de avaliar estética, confirmar que os gates automatizados passaram. Não revisar uma peça cujo SVG, inventário, dimensões, guardrails ou manifesto estejam falhando.

Para cada peça, conferir:

- ID e produto corretos;
- dimensão canônica correta;
- ausência de corte, overflow ou elemento fora da prancheta;
- `NÃO PUBLICAR` preservado enquanto a peça for candidata interna;
- fatos comerciais coerentes com os produtos: Prompt Pack com 18 templates, JPN Business com 12 playbooks e JPN Pro Kit ainda em preparação;
- nenhum preço, desconto, garantia, depoimento ou promessa de resultado não aprovado.

## Passo 2 — inspeção em três escalas

Avaliar cada arte em três condições, sem alterar o arquivo-fonte durante a inspeção:

1. **Visão geral** — peça inteira ajustada à tela. A mensagem principal deve ser identificável antes dos detalhes.
2. **100%** — verificar tipografia, alinhamentos, bordas, ícones, espaçamentos e artefatos de renderização.
3. **Miniatura** — reduzir até aproximadamente 25% da largura original. Título, produto e hierarquia principal devem continuar reconhecíveis.

Para JPN-CR-07, conferir também leitura vertical em viewport estreito. Para JPN-CR-08, conferir leitura horizontal em 16:9.

## Passo 3 — critérios editoriais e de marca

Classificar cada critério como `PASS`, `FAIL` ou `N/A`:

| Critério | O que observar |
|---|---|
| Hierarquia | título → benefício/contexto → detalhes → guardrail |
| Legibilidade | texto sem colisão, tamanho coerente e contraste suficiente |
| Consistência | tipografia, raios, espaçamentos e linguagem visual compatíveis entre as oito peças |
| Produto | nome, papel e estágio do produto sem ambiguidade |
| Jornada | quando presente, sequência Entender → Estruturar → Aplicar → Operar → Integrar correta |
| Claims | sem promessa absoluta, garantia ou dado comercial inventado |
| Marca | assinatura JPN coerente com os ativos de identidade do repositório |
| Segurança | candidato interno claramente separado de material autorizado para publicação |

Qualquer `FAIL` mantém `review_state=PENDING_HUMAN` e deve gerar uma correção objetiva antes de nova inspeção.

## Passo 4 — registro de evidência

Para cada peça revisada, registrar no handoff humano:

- ID da peça;
- SHA-256 exibido no manifesto;
- data da inspeção;
- ambiente/renderizador usado;
- resultado por critério;
- observações concretas de correção;
- decisão final `PASS` ou `FAIL`.

Uma aprovação visual só vale para o SHA-256 inspecionado. Qualquer alteração posterior no SVG invalida a aprovação anterior e exige nova revisão.

## Política para previews rasterizados

PNG/JPEG são **derivados de revisão**, não fontes de verdade. A fonte editável continua sendo o SVG. Um preview só pode ser considerado válido quando:

- deriva do SHA-256 atual da fonte;
- preserva a dimensão canônica ou registra explicitamente a escala aplicada;
- não introduz crop, fundo, compressão destrutiva ou substituição tipográfica inesperada;
- mantém o guardrail `NÃO PUBLICAR` visível enquanto a publicação não estiver autorizada.

A geração raster não deve adicionar dependência paga, serviço externo, upload ou publicação. Até existir um exportador local reproduzível e validado no repositório, a galeria offline permanece a evidência visual automatizável principal.

## Condição de saída desta etapa

A frente visual só pode deixar `PENDING_HUMAN` quando as oito peças tiverem inspeção registrada contra seus hashes atuais e nenhum `FAIL` permanecer aberto. Isso **não** altera automaticamente `release_ready` nem `publication_authorized`; promoção de release continua sendo uma decisão separada e posterior aos demais QAs físicos/editoriais do ecossistema JPN.
