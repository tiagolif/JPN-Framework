# JPN Visual Identity v1

> Status: revisão interna. Este documento não autoriza publicação, oferta, checkout ou release.

## Direção

A identidade JPN deve comunicar **estrutura, fluxo e precisão**. O visual é escuro, sóbrio e técnico, com acentos em verde-água e alto contraste. A marca evita estética genérica de “IA futurista”, excesso de neon, robôs humanoides, promessas visuais de resultado e qualquer elemento que sugira capacidade inexistente.

## Marca

O wordmark canônico é **JPN**, sempre em caixa alta. Preferência de peso 800, espaçamento de letras de `0.08em` e cor clara sobre fundo escuro. Não distorcer, não aplicar sombras decorativas, não usar gradiente dentro do wordmark e não substituir o nome por uma promessa comercial.

Posicionamento visual e verbal: sistema prático para estruturar, executar, operar e gerir trabalho com IA de forma clara e verificável.

## Paleta canônica

| Token | Valor | Papel |
| --- | --- | --- |
| `bg` | `#06121C` | fundo principal |
| `bg2` | `#0B1F33` | fundo secundário |
| `surface` | `#0E2639` | superfície principal |
| `surface2` | `#102A3C` | superfície secundária |
| `line` | `#21455E` | bordas e divisórias |
| `text` | `#F5F9FC` | texto principal |
| `muted` | `#A7BDCC` | texto secundário |
| `accent` | `#2EC4B6` | ação e destaque principal |
| `accent2` | `#86E2D9` | foco, links e destaque secundário |

A implementação de referência está em `commercial-site/styles.css`; os nove tokens acima devem permanecer sincronizados com essa superfície.

## Tipografia

Stack preferencial: `Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif`.

- títulos principais: peso forte, espaçamento negativo e poucas linhas;
- corpo: leitura confortável, `line-height` próximo de `1.6`;
- labels e eyebrows: caixa alta, peso forte e espaçamento ampliado;
- todo material deve manter fallbacks funcionais, sem depender de fonte proprietária para preservar identidade.

## Formas e composição

Raio principal de cards: **18 px**. Botões: **12 px**. Bordas devem permanecer visíveis e discretas. Cards usam superfícies escuras com contraste sutil, sem sombras pesadas ou efeito de vidro excessivo.

A composição prioriza baixa a média densidade, respiro amplo e uma mensagem principal por seção. Em materiais digitais, grades de 1 a 3 colunas devem colapsar de forma limpa em telas menores.

## Componentes

**Botão primário:** fundo `accent`, texto escuro `#06121C`, peso 800 e raio de 12 px.

**Botão secundário:** fundo transparente, texto `text`, borda `line`, raio de 12 px.

**Cards:** gradiente ou transição discreta entre `surface` e `surface2`, borda `line`, raio de 18 px.

**Foco:** outline de 3 px em `accent2`, offset de 4 px. O estado de foco nunca deve ser removido sem substituto equivalente.

## Direção de imagens e artes

Preferir diagramas limpos, mockups funcionais, capturas reais ou claramente demonstrativas, geometria simples e fundos controlados. Linhas de conexão, blocos modulares, grades e marcadores funcionais podem reforçar a ideia de método e sistema.

Evitar stock genérico, robôs como símbolo padrão de IA, neon excessivo, fundos poluídos, contadores falsos, urgência artificial, badges de autoridade não comprovados e qualquer composição que implique resultado garantido.

## Adaptação por superfície

**Web:** usar os tokens diretamente, preservar foco visível, responsividade e `prefers-reduced-motion`.

**PDF:** manter hierarquia, contraste e espaçamento. Fundos escuros podem ser adaptados para impressão se a mudança melhorar legibilidade e não alterar a identidade funcional.

**Artes sociais:** uma mensagem principal, poucos elementos e área segura. Evitar transformar a arte em catálogo denso.

**Apresentações:** uma ideia central por slide, headline curta, evidência e próximo passo.

**Planilhas:** aplicar a identidade de forma funcional em cabeçalhos, destaques e legendas; estética nunca deve prejudicar leitura dos dados.

## Ênfase por produto

- **Método JPN:** clareza conceitual, diagramas J-P-N e exercícios com respiro.
- **JPN Prompt Pack:** cards numerados, categorias e seleção rápida.
- **JPN Prompt Builder:** interface, etapas, estados e exemplos de entrada/saída.
- **JPN Business:** playbooks, fluxos e quadros operacionais.
- **JPN Gestão Fácil:** tabelas limpas, indicadores explicados e exemplos sem dados financeiros reais.
- **JPN Pro Kit:** visão integrada dos componentes, sem sugerir release enquanto os gates estiverem abertos.

## Acessibilidade e guardrails

A identidade exige foco visível, suporte a movimento reduzido, texto corporal de referência a partir de 16 px e significado que não dependa apenas de cor. Contraste deve ser validado antes de qualquer publicação futura.

A identidade visual não pode ser usada para introduzir preço, checkout, promessa de ROI, resultado garantido, 100% de precisão, substituição de revisão humana ou aparência de release final sem autorização específica.
