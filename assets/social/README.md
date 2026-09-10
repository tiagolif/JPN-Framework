# JPN Social Assets v1

Status: fontes vetoriais internas, não publicadas.
Base visual: `docs/brand/BRAND_KIT_v1.md`.
Sistema operacional: `docs/brand/SOCIAL_ART_SYSTEM_v1.md`.
Kit de produção: `docs/brand/SOCIAL_PRODUCTION_KIT_v1.md`.
Base editorial/comercial: `docs/commercial/CREATIVE_BRIEFS_v1.md`.

## Arquivos desta etapa

- `jpn-manifesto-1080x1350.svg` — CB-01, manifesto vertical;
- `jpn-principio-lacunas-1080x1080.svg` — CB-09, princípio sobre lacunas;
- `jpn-ecossistema-1920x1080.svg` — CB-10, mapa horizontal do ecossistema;
- `jpn-prompt-pack-1080x1350.svg` — CB-04, adaptação social do Prompt Pack;
- `jpn-business-1080x1350.svg` — CB-05, adaptação social do Business;
- `jpn-prompt-builder-contexto-1080x1350.svg` — estado candidato da camada contextual do Prompt Builder;
- `jpn-gestao-facil-inicio-1080x1350.svg` — onboarding da reconstrução controlada da Gestão Fácil.

## Templates reutilizáveis

A pasta `templates/` contém três fontes-base para novas peças, todas internas e não publicadas:

- `templates/jpn-template-editorial-1080x1350.svg` — TPL-SOC-01, conceito/produto/passo a passo curto;
- `templates/jpn-template-card-1080x1080.svg` — TPL-SOC-02, princípio único ou lembrete;
- `templates/jpn-template-horizontal-1920x1080.svg` — TPL-SOC-03, comparação, mapa ou apresentação.

Antes de adaptar um template, usar `docs/brand/SOCIAL_PRODUCTION_KIT_v1.md` e identificar a fonte canônica da mensagem.

## Regras de uso

Estas peças são fontes editáveis. Não são anúncios publicados, não contêm preço, desconto, urgência, depoimento, ROI ou CTA de compra. Não devem receber dados reais de clientes, empresas ou finanças.

A cópia deve permanecer alinhada aos documentos comerciais e de produto canônicos. Qualquer mudança de quantidade de prompts/playbooks, estado de produto, compatibilidade ou QA exige atualização simultânea do asset e da fonte correspondente.

As peças candidatas específicas permanecem deliberadamente conservadoras: o Prompt Builder continua com QA móvel real pendente e a Gestão Fácil continua com GF-QA-10 pendente.

## Gates antes de exportação pública

1. executar `npm run check:visual-assets`;
2. executar `npm run check:visual-bounds`;
3. renderizar SVG em ambiente gráfico;
4. revisar corte, quebra de linha e fallback tipográfico;
5. validar leitura em escala reduzida;
6. conferir nomenclatura e números contra os índices e estados canônicos;
7. confirmar status real de disponibilidade do produto;
8. exportar somente após aprovação editorial/visual específica e autorização de publicação.
