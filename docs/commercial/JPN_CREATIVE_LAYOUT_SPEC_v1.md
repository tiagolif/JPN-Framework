# JPN Creative Layout Spec v1

Status: candidato interno — não publicar

## Objetivo

Converter `JPN_VISUAL_CREATIVE_BRIEFS_v1.md`, `JPN_CREATIVE_PRODUCTION_MANIFEST_v1.md` e `JPN_CREATIVE_COPY_DECK_v1.md` em uma especificação de layout suficientemente objetiva para produzir as peças `JPN-CR-01..08` sem improvisar hierarquia, conteúdo ou claims.

## Sistema visual comum

### Hierarquia

1. assinatura curta `JPN` ou nome do produto;
2. headline como elemento textual dominante;
3. prova visual ou representação funcional existente;
4. apoio em no máximo duas linhas curtas quando o formato permitir;
5. microcopy/status;
6. CTA interno discreto.

### Grid e respiro

- trabalhar com área segura mínima equivalente a 7% da menor dimensão da peça;
- manter headline e CTA fora das bordas e áreas de corte;
- limitar cards quadrados a três blocos principais: mensagem, prova visual e identificação;
- não preencher espaço vazio apenas para aumentar densidade;
- preservar contraste entre fundo, texto e estados sem depender somente de cor para comunicar status.

### Tipografia

- usar a família tipográfica já adotada pela identidade JPN quando disponível no projeto;
- no máximo três níveis tipográficos visíveis por peça;
- evitar caixa alta em parágrafos;
- status `EM PREPARAÇÃO` deve ser legível sem competir com a headline.

### Componentes recorrentes

- selo de produto: nome curto da solução;
- trilha JPN: `Entender → Estruturar → Aplicar → Operar → Integrar` apenas quando a jornada agregar contexto;
- painel de prova: captura, diagrama ou estrutura derivada de artefato real;
- CTA interno: navegação/demonstração, nunca compra nesta fase;
- rodapé técnico opcional: `Candidato interno — não publicar` em previews de revisão.

## JPN-CR-01 — Método JPN · card 1080×1080

**Topo:** Método JPN.

**Centro esquerdo:** headline `Transforme uma ideia solta em uma instrução mais clara.`

**Centro direito / prova:** fluxo visual em cinco nós: `Ideia vaga → Jornada → Precisão → Narrativa → Instrução estruturada`.

**Base:** microcopy `Entender antes de executar.` + CTA interno `Conheça o método`.

**Evitar:** ícones de dinheiro, gráficos de crescimento ou qualquer representação de resultado garantido.

## JPN-CR-02 — Prompt Builder · card 1080×1080

**Topo:** JPN Prompt Builder.

**Centro:** headline `Estruture o pedido antes de enviar para a IA.`

**Prova:** painel com campos `Contexto`, `Objetivo`, `Fatos`, `Limites`, `Formato` e `Conclusão`, terminando em uma área `Instrução para revisar`.

**Base:** `Você revisa. O Builder estrutura.` + `Ver demonstração`.

**Evitar:** botão ou copy que sugira execução automática da tarefa final.

## JPN-CR-03 — Prompt Pack · card 1080×1080

**Topo:** JPN Prompt Pack.

**Centro:** headline `Comece de um modelo em vez de começar do zero.`

**Prova:** mosaico limpo derivado do catálogo real de templates; não criar categorias ou quantidades que não existam no artefato rastreado.

**Base:** `Escolha. Adapte. Revise.` + `Explorar templates`.

## JPN-CR-04 — JPN Business · card 1080×1080

**Topo:** JPN Business.

**Centro:** headline `Encontre o playbook certo para a situação.`

**Prova:** representação da interface real com sequência `Situação → filtro → playbook`, priorizando legibilidade sobre quantidade de detalhes.

**Base:** `Situação → filtro → playbook.` + `Ver navegador`.

**Evitar:** linguagem de decisão automática ou promessa comercial.

## JPN-CR-05 — Gestão Fácil · card 1080×1080

**Topo:** Gestão Fácil.

**Centro:** headline `Organize a rotina da pequena empresa em uma planilha estruturada.`

**Prova:** mini mapa das abas/áreas reais, sem valores financeiros de exemplo.

**Base:** `Registrar. Acompanhar. Decidir.` + `Conhecer a estrutura`.

**Nota de revisão:** previews internos devem manter registrado que a compatibilidade multiplataforma depende de `GF-QA-10`. Não inserir claim `funciona em qualquer planilha`.

**Evitar:** chamar de ERP, sistema fiscal ou automação de compras. `REPOR` é somente alerta operacional.

## JPN-CR-06 — Pro Kit · card 1080×1080

**Topo:** JPN Pro Kit + selo visível `EM PREPARAÇÃO`.

**Centro:** headline `O ecossistema JPN reunido em uma jornada única.`

**Prova:** trilha `Entender → Estruturar → Aplicar → Operar → Integrar` conectando as camadas existentes.

**Base:** `Conhecer o ecossistema`.

**Evitar:** preço, botão de compra, disponibilidade imediata ou promessa de entrega.

## JPN-CR-07 — Story do ecossistema · 1080×1920

Produzir seis frames com uma única lógica visual contínua. Cada frame deve manter o nome da etapa como elemento dominante e o produto como elemento secundário.

1. `Nem todo problema precisa da ferramenta maior.`
2. `Entender — Método JPN`
3. `Estruturar — Prompt Builder`
4. `Aplicar — Prompt Pack e JPN Business`
5. `Operar — Gestão Fácil`
6. `Integrar — JPN Pro Kit · EM PREPARAÇÃO`

Fecho no frame 6: `Comece pelo menor recurso suficiente para a necessidade.`

## JPN-CR-08 — Hero do ecossistema · 16:9

**Esquerda:** eyebrow `Ecossistema JPN`, headline `Da ideia à operação, uma camada para cada necessidade.` e subheadline do copy deck.

**Direita:** mapa visual das cinco etapas com os produtos associados.

**Base:** CTAs internos `Comparar produtos` e `Ver demonstrações`.

Em viewport estreito, empilhar texto antes do mapa e preservar a ordem semântica.

## Estados de produção

Cada peça deve usar apenas estes estados internos:

- `SPEC_READY`: layout e copy definidos;
- `SOURCE_READY`: fonte editável criada;
- `PREVIEW_READY`: preview rasterizado/exportado;
- `GATE_PASS`: validações automatizáveis aplicáveis passaram;
- `PENDING_HUMAN`: inspeção visual/editorial ainda necessária;
- `APPROVED_INTERNAL`: revisão humana concluída, sem equivaler a autorização de publicação.

Nenhum desses estados autoriza anúncio, publicação, checkout ou venda.

## Critérios de gate visual/editorial

Antes de marcar um preview como pronto para revisão humana:

1. dimensões correspondem ao manifesto;
2. texto confere literalmente com o copy deck ou possui mudança documentada;
3. status obrigatório está visível;
4. não há preço, desconto, escassez ou promessa de resultado;
5. prova visual deriva de artefato existente;
6. headline permanece legível em redução;
7. CTA é interno e não transacional;
8. Gestão Fácil e Pro Kit preservam seus limites de QA/status;
9. nenhum dado financeiro real, credencial ou dado pessoal aparece na peça.

## Convenção de arquivos

Usar o ID do manifesto como prefixo, por exemplo:

- `JPN-CR-01_metodo-jpn_card_source.*`
- `JPN-CR-01_metodo-jpn_card_preview.png`
- `JPN-CR-08_ecossistema_hero_source.*`
- `JPN-CR-08_ecossistema_hero_preview.png`

Não usar `final`, `approved` ou `release` no nome enquanto os gates correspondentes não tiverem evidência.

## Próxima etapa mecânica

Produzir as fontes editáveis e previews de `JPN-CR-01..08` conforme esta especificação, mantendo `publication_authorized=false`. Após cada exportação, executar os gates automatizáveis existentes e deixar inspeção estética/editorial humana explicitamente pendente quando aplicável.
