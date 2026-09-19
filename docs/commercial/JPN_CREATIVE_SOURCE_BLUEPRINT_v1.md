# JPN Creative Source Blueprint v1

Status: `SOURCE_BLUEPRINT_READY`  
Escopo: produção interna; não autoriza publicação, anúncio, venda ou release.

## Objetivo

Converter `JPN_VISUAL_CREATIVE_BRIEFS_v1.md`, `JPN_CREATIVE_PRODUCTION_MANIFEST_v1.md`, `JPN_CREATIVE_COPY_DECK_v1.md`, `JPN_CREATIVE_LAYOUT_SPEC_v1.md` e `JPN_CREATIVE_ASSET_CHECKLIST_v1.md` em uma especificação única e determinística para construir as fontes editáveis e previews `JPN-CR-01..08` sem reinterpretar claims durante a execução.

## Contrato de fonte

Cada peça deve existir primeiro como fonte editável e somente depois como preview. A fonte deve separar, no mínimo:

1. `background` — fundo e áreas de respiro;
2. `brand` — assinatura JPN;
3. `status` — selo de estado quando obrigatório;
4. `headline` — mensagem principal aprovada no copy deck;
5. `support` — texto de apoio;
6. `visual-proof` — diagrama/interface/estrutura que demonstra o produto sem prometer resultado;
7. `microcopy` — limite, contexto ou orientação curta;
8. `cta-internal` — CTA não transacional para material interno.

Não converter textos em curvas antes da revisão humana. Não incorporar preço, desconto, checkout, urgência, faturamento, garantia ou claim novo.

## Nomenclatura determinística

Diretório-alvo interno sugerido: `assets/commercial/creative/`.

Para cada ID:

- fonte: `<ID>_<slug>_source.svg` ou formato editável equivalente rastreável;
- preview: `<ID>_<slug>_preview.png`;
- evidência de gate: `<ID>_<slug>_gate.md` quando necessária.

Slugs:

| ID | slug |
|---|---|
| JPN-CR-01 | metodo-jpn |
| JPN-CR-02 | prompt-builder |
| JPN-CR-03 | prompt-pack |
| JPN-CR-04 | jpn-business |
| JPN-CR-05 | gestao-facil |
| JPN-CR-06 | pro-kit |
| JPN-CR-07 | ecossistema-story |
| JPN-CR-08 | ecossistema-hero |

## Blueprint por peça

### JPN-CR-01 — Método JPN

- formato: card 1080×1080;
- prova visual: fluxo `Jornada → Precisão → Narrativa`;
- prioridade: método > explicação > assinatura;
- proibição: não representar o método como garantia de resposta correta.

### JPN-CR-02 — Prompt Builder

- formato: card 1080×1080;
- prova visual: transformação `entrada vaga → instrução estruturada`;
- prioridade: antes/depois estrutural, sem simular execução da tarefa;
- proibição: não chamar de agente autônomo ou executor.

### JPN-CR-03 — Prompt Pack

- formato: card 1080×1080;
- prova visual: mosaico/índice dos 18 templates rastreados;
- prioridade: variedade organizada > quantidade decorativa;
- proibição: não aumentar a contagem nem sugerir biblioteca ilimitada.

### JPN-CR-04 — JPN Business

- formato: card 1080×1080;
- prova visual: interface/grade dos 12 playbooks rastreados;
- prioridade: aplicação empresarial > interface > microcopy;
- proibição: não inventar automações, integrações ou playbooks.

### JPN-CR-05 — Gestão Fácil

- formato: card 1080×1080;
- prova visual: mapa funcional das 8 abas;
- prioridade: organização operacional > mapa > limite;
- status: compatibilidade multiplataforma continua dependente de `GF-QA-10`;
- proibição: não chamar de ERP, sistema contábil ou afirmar compatibilidade universal; `REPOR` é somente alerta operacional.

### JPN-CR-06 — Pro Kit

- formato: card 1080×1080;
- prova visual: mapa do ecossistema;
- selo obrigatório: `EM PREPARAÇÃO`;
- prioridade: integração conceitual > componentes > status;
- proibição: não apresentar como disponível para compra ou entrega final.

### JPN-CR-07 — Ecossistema Story

- formato: 1080×1920;
- prova visual: jornada vertical `Entender → Estruturar → Aplicar → Operar → Integrar`;
- associar cada etapa somente ao produto que efetivamente cobre a necessidade;
- CTA interno não transacional.

### JPN-CR-08 — Ecossistema Hero

- formato: 16:9;
- prova visual: visão integrada dos produtos, com hierarquia limpa;
- headline curta e leitura possível em redução;
- Pro Kit, se citado, mantém `EM PREPARAÇÃO`.

## Estados permitidos

`SOURCE_BLUEPRINT_READY → SOURCE_READY → PREVIEW_READY → GATE_PASS → PENDING_HUMAN → APPROVED_INTERNAL`

Regras:

- nenhum estado equivale a `publication_authorized=true`;
- `GATE_PASS` valida critérios automatizáveis, não estética humana;
- `APPROVED_INTERNAL` não é release;
- falha de claim, clipping, dimensão, legibilidade ou rastreabilidade retorna a peça ao estado anterior.

## Preflight antes de gerar preview

- ID e slug conferem com a tabela;
- formato/dimensão conferem com o manifesto;
- copy vem do deck aprovado, sem reescrita promocional improvisada;
- prova visual corresponde a funcionalidade rastreada;
- status obrigatório está visível;
- nenhuma informação financeira real foi inserida;
- nenhum CTA transacional foi criado;
- nenhuma compatibilidade pendente foi promovida a claim;
- fonte permanece editável e rastreável.

## Definition of Done desta etapa

Este blueprint está concluído quando as oito peças possuem especificação suficiente para uma ferramenta de design ou pipeline local gerar fontes sem decisões comerciais adicionais. A etapa seguinte é materializar `JPN-CR-01..08` como fontes editáveis e previews internos, executar os gates automatizáveis e manter revisão estética/editorial humana como `PENDING_HUMAN` até evidência real.

## Guardrails de projeto

Permanecem obrigatórios `release_ready=false` e `publication_authorized=false`. Não publicar, anunciar, comprar mídia, criar checkout, gastar dinheiro, usar dados financeiros reais, criar contas com verificação de identidade nem aceitar termos legais em nome do responsável pelo projeto.