# JPN Visual QA v1

Status: checklist interno para fontes vetoriais; não equivale a aprovação de publicação.

## Escopo

Este QA cobre os SVGs de `assets/covers/` e `assets/social/`. Ele separa verificações que podem ser feitas na fonte das que exigem renderização real.

## QA de fonte

Para cada SVG:

- `width`, `height` e `viewBox` devem corresponder ao formato declarado;
- deve existir `role="img"`, `<title>` e `<desc>`;
- a paleta deve se limitar aos tokens aprovados do Brand Kit, salvo exceção documentada;
- fallback tipográfico deve incluir `Arial`/`sans-serif` ou equivalente de sistema;
- nenhum texto pode conter preço, desconto, urgência, depoimento, ROI, promessa de resultado ou CTA de compra nesta fase;
- números estruturais devem bater com fontes canônicas: Prompt Pack = 18 estruturas; Business = 12 playbooks;
- Gestão Fácil deve evitar linguagem de contabilidade, ERP ou sistema fiscal;
- Pro Kit deve manter status de preparação enquanto os artefatos finais não estiverem congelados.

## QA de renderização obrigatório

Antes de exportar PNG/PDF final:

1. renderizar na dimensão nativa;
2. conferir clipping e overflow de textos;
3. conferir fallback tipográfico em ambiente sem Inter;
4. revisar contraste dos textos secundários;
5. reduzir para 25% e confirmar leitura da headline;
6. conferir margens de segurança em mobile;
7. revisar se a hierarquia visual comunica uma única ideia principal;
8. verificar se estado/status não depende somente de cor.

## Estado desta rodada

As peças sociais adicionadas nesta etapa respeitam os formatos e textos previstos em `CREATIVE_BRIEFS_v1.md` por inspeção de fonte. A aprovação visual rasterizada permanece pendente; nenhum asset deve ser tratado como peça pública final apenas por estar versionado.

## Registro mínimo de aprovação futura

Para cada asset aprovado, registrar: arquivo, commit, ambiente/renderizador, formato exportado, data da revisão, itens corrigidos e status final (`approved-internal`, `approved-for-export` ou `blocked`).
