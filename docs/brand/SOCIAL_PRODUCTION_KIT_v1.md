# JPN Social Production Kit v1

Status: candidate production system / visual QA pending.
Base: `BRAND_KIT_v1.md` + `DESIGN_TOKENS.css` + `SOCIAL_ART_SYSTEM_v1.md`.

## Objetivo

Transformar o sistema visual existente em um fluxo reutilizável para produzir novas artes JPN sem redesenhar a identidade a cada peça e sem transformar arquivo-fonte em autorização de publicação.

## Princípio de produção

Toda nova peça começa por uma mensagem factual já sustentada por fonte canônica. Depois escolhe-se o menor layout suficiente, substituem-se apenas os campos editáveis e executam-se os gates técnicos e a revisão visual humana.

Sequência: `Fato → Formato → Hierarquia → Estado → QA → Revisão humana`.

## Templates editáveis

| ID | Arquivo | Uso principal | Dimensão |
|---|---|---|---|
| TPL-SOC-01 | `assets/social/templates/jpn-template-editorial-1080x1350.svg` | conceito, produto, princípio ou passo a passo curto | 1080×1350 |
| TPL-SOC-02 | `assets/social/templates/jpn-template-card-1080x1080.svg` | princípio único, lembrete ou conceito curto | 1080×1080 |
| TPL-SOC-03 | `assets/social/templates/jpn-template-horizontal-1920x1080.svg` | comparação, ecossistema, apresentação ou cabeçalho | 1920×1080 |

Os templates são fontes internas. Não são anúncios, peças aprovadas nem exportações finais.

## Campos editáveis

Cada template expõe cinco zonas lógicas:

1. **assinatura** — `JPN` ou nome canônico do produto;
2. **eyebrow** — categoria curta, sem urgência comercial;
3. **headline** — uma ideia principal, preferencialmente em até duas linhas;
4. **support** — explicação factual curta;
5. **state/footer** — condição real da peça, como `Fonte de design · não publicada` ou outro estado canônico.

Não remover o rodapé de estado enquanto a peça não possuir revisão visual/editorial específica e autorização de publicação.

## Layout TPL-SOC-01 — editorial vertical

Use quando houver uma ideia principal e até três apoios visuais.

- margem segura: 72 px;
- assinatura no topo;
- título em bloco dominante;
- área central para três módulos J · P · N ou três fatos curtos;
- apoio final com no máximo duas linhas;
- estado na base.

Evitar mais de três cartões, listas longas e texto corrido.

## Layout TPL-SOC-02 — card quadrado

Use para uma única afirmação verificável.

- margem segura: 72 px;
- headline curta como centro visual;
- motivo J · P · N como apoio, não como decoração dominante;
- apenas um bloco de explicação;
- estado na base.

Se a ideia exigir comparação ou mais de três fatos, migrar para TPL-SOC-01 ou TPL-SOC-03.

## Layout TPL-SOC-03 — horizontal

Use para relações, mapas e comparações conceituais.

- margem segura: 96 px;
- título no terço esquerdo;
- até três módulos ou colunas no campo principal;
- leitura da esquerda para a direita;
- estado no rodapé.

Não usar como tabela densa. Se houver mais de três dimensões relevantes, produzir página/documento em vez de comprimir tudo em uma arte.

## Hierarquia tipográfica

Os templates mantêm no máximo três níveis:

- headline: 72–96 px conforme formato;
- apoio: 30–38 px;
- labels/estado: 20–26 px.

Fallback vetorial obrigatório: `Inter,Arial,sans-serif`.

## Paleta

Somente tokens visuais canônicos. O accent `#2EC4B6` serve para hierarquia e motivo JPN; não deve dominar a área total da peça. Fundo preferencial: `#06121C` ou `#0B1F33`. Texto principal: `#F5F9FC`. Texto secundário: `#A7BDCC`.

## Matriz de escolha rápida

| Necessidade | Template recomendado |
|---|---|
| explicar um conceito | TPL-SOC-01 |
| destacar uma regra | TPL-SOC-02 |
| mostrar três etapas | TPL-SOC-01 |
| comparar conceitos | TPL-SOC-03 |
| mostrar ecossistema | TPL-SOC-03 |
| publicar preço/oferta | nenhum; parar e exigir fonte comercial confirmada + autorização específica |

## Copy segura

Uma arte candidata pode usar mensagens do `docs/commercial/COPY_BANK_v1.md`, `CREATIVE_BRIEFS_v1.md` ou outra fonte canônica atual. Não inventar números, compatibilidade, disponibilidade, preço, desconto, prazo, depoimento ou promessa de resultado.

Claims bloqueados sem evidência incluem garantia de resultado, aumento de vendas, redução garantida de custos, ROI garantido, precisão absoluta e privacidade absoluta.

## Fluxo de adaptação

1. registrar a fonte canônica da mensagem;
2. escolher TPL-SOC-01, 02 ou 03;
3. duplicar o SVG e renomear com assunto + dimensão;
4. substituir headline e apoio sem alterar a estrutura-base;
5. atualizar `<title>` e `<desc>` para acessibilidade;
6. manter o estado verdadeiro do produto;
7. executar `npm run check:visual-assets` e `npm run check:visual-bounds`;
8. renderizar em ambiente gráfico;
9. revisar corte, contraste, leitura reduzida e quebras;
10. manter como candidato até autorização específica de publicação.

## Checklist de qualidade

- [ ] mensagem possui fonte canônica identificável;
- [ ] apenas um conceito principal;
- [ ] até três níveis tipográficos;
- [ ] título e descrição acessíveis atualizados;
- [ ] dimensão coincide com nome e `viewBox`;
- [ ] cores pertencem à paleta JPN;
- [ ] nenhum dado real sensível aparece na peça;
- [ ] nenhum preço, desconto ou condição foi inventado;
- [ ] nenhum claim de resultado foi criado sem evidência;
- [ ] estado do produto permanece verdadeiro;
- [ ] QA técnico executado;
- [ ] inspeção visual humana ainda é exigida antes de exportação pública.

## Estados preservados

- Prompt Builder: QA físico contextual em dispositivo real continua pendente;
- Gestão Fácil: GF-QA-10 multiplataforma continua pendente; `REPOR` é alerta, não autorização de compra;
- JPN Pro Kit: permanece `EM PREPARAÇÃO`;
- fontes SVG: não publicadas por padrão.

## Regra de parada

Parar a produção quando a peça depender de informação comercial não confirmada, dados financeiros reais, credenciais, publicação/envio externo, gasto, contratação, aceite legal ou criação de conta com verificação de identidade. O template nunca substitui autorização humana.