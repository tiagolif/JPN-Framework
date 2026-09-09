# JPN Social Art System v1

Status: candidate companion / visual QA pending.
Base: `docs/brand/BRAND_KIT_v1.md` + `docs/brand/DESIGN_TOKENS.css`.

## Objetivo

Padronizar peças sociais internas do ecossistema JPN sem transformar fonte de design em anúncio, promessa comercial ou autorização de publicação.

## Estrutura visual

Cada arte deve preservar:

1. assinatura `JPN` discreta no topo;
2. um único conceito principal;
3. até três níveis tipográficos;
4. motivo de três módulos conectado à lógica Jornada · Precisão · Narrativa;
5. accent usado como hierarquia, nunca como preenchimento dominante;
6. alto contraste e leitura em tela pequena;
7. rodapé de estado quando a peça ainda não estiver liberada.

## Formatos canônicos desta fase

- `1080x1350` — peça vertical editorial/social;
- `1080x1080` — card quadrado;
- `1920x1080` — composição horizontal/apresentação.

O nome do arquivo deve terminar com a dimensão real: `-1080x1350.svg`, `-1080x1080.svg` ou `-1920x1080.svg`.

## Paleta permitida

Derivada dos tokens canônicos:

- `#06121C` fundo principal;
- `#0B1F33` fundo secundário;
- `#0E2639` superfície;
- `#102A3C` superfície secundária;
- `#21455E` linha;
- `#F5F9FC` texto principal;
- `#A7BDCC` texto secundário;
- `#2EC4B6` accent principal;
- `#86E2D9` accent secundário;
- `#9AF0E7` accent claro.

## Tipografia

SVGs devem usar `Inter,Arial,sans-serif` como fallback vetorial desta fase. Títulos podem usar 800–900; corpo e labels devem manter contraste e espaçamento adequados.

## Hierarquia de conteúdo

Uma peça deve responder, visualmente, nesta ordem:

- **o que é** — nome do produto, princípio ou recurso;
- **por que importa** — uma frase factual, curta e verificável;
- **como se organiza** — módulos, etapas ou benefícios concretos já existentes no produto;
- **estado** — quando aplicável, indicar `Fonte de design · não publicada`, `EM PREPARAÇÃO` ou outra condição canônica verdadeira.

## Guardrails editoriais

Não usar em arte:

- garantia de resultado, venda, ROI ou precisão absoluta;
- urgência artificial;
- preço, desconto ou condição comercial não confirmados;
- depoimento inventado;
- métricas sem evidência;
- dados reais de clientes, empresas ou finanças;
- afirmação de disponibilidade quando o produto permanece candidato.

## Novas peças desta etapa

### Prompt Builder — contexto preservado

Arquivo: `assets/social/jpn-prompt-builder-contexto-1080x1350.svg`.

Mensagem factual: o Builder candidato passa a preservar contexto confirmado e restrições na camada contextual, sem afirmar compreensão semântica universal ou QA móvel concluído.

### Gestão Fácil — início rápido

Arquivo: `assets/social/jpn-gestao-facil-inicio-1080x1350.svg`.

Mensagem factual: existe um roteiro de início rápido para a reconstrução controlada da planilha; GF-QA-10 continua pendente.

## Checklist antes de exportar

- [ ] SVG passa em `npm run check:visual-assets`;
- [ ] título e descrição acessíveis presentes;
- [ ] dimensão do arquivo coincide com nome e `viewBox`;
- [ ] paleta está dentro dos tokens canônicos;
- [ ] copy não contém claim bloqueado;
- [ ] estado do produto confere com a documentação atual;
- [ ] inspeção visual real foi executada em renderização;
- [ ] publicação recebeu autorização específica.

## Regra de parada

Se estado, quantidade, claim, disponibilidade ou fonte editorial estiverem conflitantes, não exportar nem publicar a peça. Corrigir primeiro a fonte canônica ou a arte, mantendo o status como candidato até nova evidência.
