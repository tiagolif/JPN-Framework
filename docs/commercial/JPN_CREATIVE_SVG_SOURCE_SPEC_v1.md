# JPN Creative SVG Source Spec v1

Status: INTERNAL / NOT FOR PUBLICATION

## Objetivo

Definir a materialização das peças JPN-CR-01..08 em fontes SVG editáveis, reproduzíveis e versionáveis, reduzindo dependência de ferramentas proprietárias e preservando a rastreabilidade entre copy, layout, fonte e preview.

Esta especificação complementa os briefs, copy deck, layout spec, asset checklist e source blueprint já rastreados.

## Contrato de fonte

Cada peça deve possuir um SVG UTF-8 como fonte canônica. O SVG deve:

- usar `viewBox` correspondente ao formato lógico da peça;
- manter textos como elementos `<text>` editáveis enquanto possível;
- agrupar camadas com IDs estáveis;
- não incorporar imagens externas remotas;
- não depender de credenciais, APIs ou fontes pagas;
- usar apenas dados fictícios ou abstrações visuais;
- evitar filtros/efeitos que prejudiquem renderização portátil;
- permitir geração determinística de preview PNG por ferramenta local compatível.

## Estrutura de camadas

Ordem recomendada, do fundo para a frente:

1. `background`
2. `brand`
3. `status`
4. `headline`
5. `support`
6. `visual-proof`
7. `microcopy`
8. `cta-internal`

IDs internos devem permanecer estáveis para facilitar QA e futuras automações.

## Formatos

| ID | Formato | ViewBox sugerido |
|---|---|---|
| JPN-CR-01 | Card | `0 0 1080 1080` |
| JPN-CR-02 | Card | `0 0 1080 1080` |
| JPN-CR-03 | Card | `0 0 1080 1080` |
| JPN-CR-04 | Card | `0 0 1080 1080` |
| JPN-CR-05 | Card | `0 0 1080 1080` |
| JPN-CR-06 | Card | `0 0 1080 1080` |
| JPN-CR-07 | Story | `0 0 1080 1920` |
| JPN-CR-08 | Hero | `0 0 1600 900` |

## Convenção de arquivos

Fontes:

`assets/commercial/creative/source/jpn-cr-XX-<slug>.svg`

Previews:

`assets/commercial/creative/preview/jpn-cr-XX-<slug>.png`

O preview é derivado. O SVG é a fonte editável canônica.

## Provas visuais por peça

### JPN-CR-01 — Método JPN

Visualizar a progressão Jornada → Precisão → Narrativa sem alegar garantia de resultado.

### JPN-CR-02 — Prompt Builder

Mostrar transformação de entrada vaga em instrução estruturada. Não representar execução autônoma da tarefa.

### JPN-CR-03 — Prompt Pack

Representar o catálogo real de 18 templates, sem inflar quantidade ou sugerir automação inexistente.

### JPN-CR-04 — JPN Business

Representar os 12 playbooks rastreados e a lógica de aplicação empresarial sem inventar módulos.

### JPN-CR-05 — Gestão Fácil

Representar o mapa real das 8 abas. `REPOR` é somente alerta operacional. Não chamar de ERP, sistema contábil ou solução universal. Compatibilidade multiplataforma permanece condicionada ao GF-QA-10.

### JPN-CR-06 — Pro Kit

Representar integração do ecossistema. O status visível obrigatório é `EM PREPARAÇÃO` enquanto esse for o estado rastreado.

### JPN-CR-07 — Ecossistema / Story

Representar a jornada Entender → Estruturar → Aplicar → Operar → Integrar e permitir leitura vertical rápida.

### JPN-CR-08 — Ecossistema / Hero

Representar a mesma arquitetura em composição horizontal para página/apresentação, sem CTA transacional.

## Tipografia e portabilidade

A fonte deve priorizar uma pilha aberta/sistema definida pelos documentos de identidade existentes. Caso o renderizador não possua a família preferida, a composição deve continuar legível com fallback sans-serif. Não converter texto em path antes da revisão humana, pois isso reduz editabilidade.

## QA automatizável

Para cada SVG, o gate pode verificar mecanicamente:

- XML/SVG parseável;
- `viewBox` esperado;
- presença dos IDs obrigatórios de camada;
- ausência de links remotos e scripts;
- ausência de termos comerciais bloqueados;
- status obrigatório quando aplicável;
- dimensões/nome coerentes com o manifesto;
- renderização local sem erro quando houver renderizador disponível.

Essas verificações não substituem inspeção estética/editorial humana.

## Estados

`SPEC_READY → SVG_SOURCE_READY → PREVIEW_READY → AUTOMATED_GATE_PASS → PENDING_HUMAN → APPROVED_INTERNAL`

Nenhum estado acima autoriza publicação. `publication_authorized=false` e `release_ready=false` permanecem guardrails independentes.

## Guardrails

As fontes e previews não podem introduzir:

- preço, desconto ou checkout não autorizados;
- escassez/urgência artificial;
- promessa de vendas, lucro ou precisão garantida;
- compatibilidade universal;
- dados financeiros reais;
- credenciais ou dados pessoais;
- produto pendente apresentado como disponível.

## Próxima materialização

Com este contrato, a próxima mudança mecânica deve criar os SVGs `JPN-CR-01..08` em `assets/commercial/creative/source/`, começando pelos cards individuais e preservando copy e estados já aprovados documentalmente. Depois, gerar previews derivados e executar os gates automatizáveis antes da revisão humana.
