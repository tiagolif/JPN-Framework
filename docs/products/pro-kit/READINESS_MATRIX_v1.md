# JPN Pro Kit v1 — Matriz Operacional de Prontidão

Base: JPN Framework `0.3.0-draft`.

Status deste documento: **candidate companion / release QA pending**.

Esta matriz consolida o estado real dos componentes do JPN Pro Kit. Ela não substitui `RELEASE_GATES.json`, `RELEASE_CHECKLIST.md`, `DELIVERY_MAP.md` nem o manifesto final. Seu objetivo é permitir decidir rapidamente **o que pode avançar agora, o que está bloqueado e qual evidência falta**, sem transformar pendências em aprovações.

## Como ler

- **Pronto para próxima etapa**: há fonte ou artefato versionado suficiente para continuar o trabalho interno.
- **Pendente de QA humano/runtime**: depende de inspeção ou software externo e não pode ser aprovado automaticamente.
- **Pendente de artefato final**: conteúdo existe, mas PDF/binário/freeze final ainda não existe ou não foi aprovado.
- **Pendente de freeze**: só pode ocorrer depois dos gates anteriores.
- **Passed**: usar somente quando houver evidência versionada ou execução reproduzível registrada.

## Matriz por componente

| Componente | Estado atual | Próxima ação segura | Evidência para avançar | Bloqueia release? |
|---|---|---|---|---|
| Método JPN | fonte consolidada; referência rápida candidata | revisão ortográfica final, diagramação e inspeção visual/PDF | `METODO_JPN_v1.md` + quick reference + registro de QA visual | sim |
| JPN Prompt Pack | 18 templates consolidados; referência rápida candidata | revisão ortográfica final, diagramação e inspeção visual/PDF | `JPN_PROMPT_PACK_v1.md`, `PROMPT_INDEX.json` e registro de QA visual | sim |
| JPN Business | 12 playbooks consolidados; referência rápida integrada ao candidato imprimível | exportar candidato e inspecionar página a página | fonte, índice, quick reference, candidato renderizado e QA visual | sim |
| Prompt Builder | camada contextual integrada na cadeia candidata; regressões automatizadas | teste físico em celular real: geração, copiar, salvar, recuperar, viewport e teclado | checklist móvel preenchido com aparelho/navegador e resultado | sim |
| JPN Gestão Fácil | XLSX versionado; GF-QA-01..09 registrados | executar GF-QA-10 no mesmo binário em Excel, LibreOffice Calc e Google Sheets | `QA_EXECUTION_v0.1.md` com as três compatibilidades registradas | sim |
| Manual Gestão Fácil | fonte editorial versionada | revisão final, exportação PDF e inspeção visual | manual fonte + PDF candidato + registro de revisão | sim |
| Identidade visual e artes | fontes e gates automatizados existentes | concluir renderização e inspeção visual humana dos SVGs/peças | `VISUAL_REVIEW_EXECUTION_v1.md` atualizado com evidência real | sim |
| Materiais comerciais, páginas e copies | superfícies e gates automatizados existentes | revisão final de coerência com fatos do produto e oferta ainda não publicada | gates comerciais + revisão humana final | sim |
| Guia `LEIA_PRIMEIRO` | fonte versionada | exportar/revisar formato final junto do kit | fonte + PDF/TXT final inspecionado | sim |
| Manifesto do Pro Kit | template versionado | preencher somente após freeze dos artefatos aprovados | `MANIFEST.json` com caminhos, versões e SHA-256 finais | sim |
| Release notes | fonte versionada | atualizar no freeze final para refletir exatamente o pacote entregue | release notes final compatível com manifesto | sim |

## Gates bloqueadores canônicos

A fonte de verdade de gates continua sendo `docs/products/pro-kit/RELEASE_GATES.json`. No estado atual, os bloqueadores que **não podem ser tratados como concluídos** são:

1. `gestao-facil-cross-compat` — requer GF-QA-10 em Excel, LibreOffice e Google Sheets;
2. `visual-render-review` — requer inspeção visual final real;
3. `final-pdfs` — requer PDFs finais revisados;
4. `final-hashes` — requer freeze dos artefatos antes de calcular hashes finais;
5. `current-head-ci` — requer CI verde no head definitivo candidato a release.

O gate `prompt-builder-release-decision` registra somente que a modalidade de entrega offline foi definida. Ele **não comprova QA móvel final nem freeze do bundle**.

## Ordem segura de fechamento

1. concluir QA humano/runtime que não depende de freeze;
2. corrigir eventuais achados sem alterar silenciosamente escopo ou versão-base;
3. gerar e revisar PDFs/artefatos finais;
4. montar staging candidato;
5. executar gates automáticos no head definitivo;
6. congelar os arquivos aprovados;
7. calcular SHA-256 e preencher o manifesto final;
8. verificar CI no mesmo head congelado;
9. somente então considerar o pacote tecnicamente pronto para uma decisão separada de publicação/venda.

## O que não deve ser automatizado como `passed`

- inspeção visual página a página;
- teste em aparelho móvel real;
- compatibilidade GF-QA-10 em aplicativos externos;
- revisão editorial humana final;
- aceite de termos, publicação, anúncio, checkout, gasto ou criação de conta externa;
- qualquer decisão que exija dados financeiros reais ou autorização do titular.

## Regra de parada

Pare o processo de release e mantenha o estado como pendente se qualquer uma destas condições ocorrer:

- evidência ausente, conflitante ou não reproduzível;
- artefato final divergente da fonte canônica;
- placeholder, segredo, chave, dado pessoal desnecessário ou dado financeiro real no pacote;
- hash calculado antes do freeze definitivo;
- CI referente a commit diferente do head a ser entregue;
- aprovação humana necessária ainda não registrada.

## Critério de saída desta matriz

Esta matriz pode ser considerada cumprida quando todos os gates bloqueadores de `RELEASE_GATES.json` tiverem evidência real compatível, o manifesto estiver preenchido após freeze e o CI estiver verde no mesmo head candidato. Isso ainda não constitui autorização para publicar, vender, anunciar ou realizar qualquer gasto.
