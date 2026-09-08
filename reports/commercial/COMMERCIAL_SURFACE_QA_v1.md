# JPN Commercial Surface QA v1

Status: **candidato interno — não publicado**.

Este relatório separa verificações mecânicas já cobertas pelo repositório de validações que continuam exigindo inspeção humana ou ambiente de navegador. Ele não autoriza publicação.

## Escopo

Arquivos sob revisão:

- `commercial-site/index.html`;
- `commercial-site/products/metodo-jpn.html`;
- `commercial-site/products/jpn-prompt-builder.html`;
- `commercial-site/products/jpn-prompt-pack.html`;
- `commercial-site/products/jpn-business.html`;
- `commercial-site/products/jpn-gestao-facil.html`;
- `commercial-site/products/jpn-pro-kit.html`;
- `commercial-site/styles.css`.

## Matriz de QA

| ID | Critério | Método | Estado |
| --- | --- | --- | --- |
| CS-QA-01 | seis produtos canônicos e Pro Kit em preparação | `check:commercial-site` | automatizado |
| CS-QA-02 | ausência de preço, formulário, checkout, analytics, scripts/URLs externas e claims proibidos | `check:commercial-site` | automatizado |
| CS-QA-03 | links relativos, fragmentos e mapeamento landing → produto | `check:commercial-navigation` | automatizado |
| CS-QA-04 | idioma, viewport, robots, title, um `h1`, landmarks e nomes de links | `check:commercial-accessibility` | automatizado |
| CS-QA-05 | imagens com `alt`, quando existirem, e pares `details/summary` | `check:commercial-accessibility` | automatizado |
| CS-QA-06 | zoom não bloqueado, sem `javascript:` e segurança para `_blank` | `check:commercial-accessibility` | automatizado |
| CS-QA-07 | foco visível e redução de movimento | `check:commercial-accessibility` + CSS | automatizado |
| CS-QA-08 | composição desktop sem overflow, sobreposição ou corte | navegador real | pendente |
| CS-QA-09 | composição mobile em largura estreita | navegador real | pendente |
| CS-QA-10 | navegação integral por teclado e ordem de foco | teste manual | pendente |
| CS-QA-11 | contraste dos pares canônicos de tokens | `check:commercial-contrast` | automatizado parcialmente |
| CS-QA-12 | leitura assistiva de landmarks, links, headings e FAQ | leitor de tela | pendente |
| CS-QA-13 | revisão editorial humana de copy e microcopy | revisão humana | pendente |
| CS-QA-14 | decisão explícita de liberação pública por produto | autorização do responsável | bloqueado até decisão futura |

## Contraste calculado

`check:commercial-contrast` calcula luminância relativa e razão de contraste para pares canônicos extraídos diretamente de `commercial-site/styles.css`. O gate cobre:

- texto principal contra fundo, fundo secundário e as duas superfícies;
- texto secundário contra fundo e superfícies;
- destaque claro contra fundo e superfícies;
- texto escuro sobre o botão de destaque;
- cor de foco contra fundo e superfícies.

Os pares de texto normal devem atingir pelo menos **4,5:1**. Os pares de foco não textual devem atingir pelo menos **3:1**. O gate falha quando um token ausente ou uma alteração de cor derruba qualquer par abaixo do mínimo correspondente.

O estado de CS-QA-11 é `automatizado parcialmente` porque o cálculo prova os pares de tokens definidos, mas não inspeciona o resultado composto de transparências, gradientes, imagens, sobreposições ou novos estados visuais que venham a ser introduzidos. Esses casos continuam exigindo inspeção do render final.

## Interpretação

`automatizado` significa que existe um gate versionado que deve passar quando executado no ambiente de build. Não significa que o critério foi validado em todos os navegadores ou tecnologias assistivas.

`automatizado parcialmente` significa que uma parte objetiva do critério possui gate reproduzível, enquanto a parte dependente de renderização final permanece pendente.

`pendente` significa que a estrutura necessária foi preparada, mas ainda falta evidência real de inspeção.

`bloqueado até decisão futura` significa que a ação depende de autorização explícita e não deve ser promovida automaticamente.

## Evidência esperada para fechar o QA visual

Quando houver ambiente de navegador disponível, registrar pelo menos:

1. viewport desktop de referência;
2. viewport mobile estreito;
3. página inicial e as seis páginas individuais;
4. estado normal e foco de teclado nos principais links;
5. FAQ aberto em pelo menos uma página;
6. observações de overflow, recorte, contraste composto ou quebra de hierarquia;
7. correções realizadas e nova inspeção após cada falha.

A evidência deve identificar versão/commit revisado. Screenshots podem complementar a revisão, mas não substituem teclado, contraste composto e leitura assistiva.

## Guardrail de publicação

Enquanto CS-QA-08 a CS-QA-14 não estiverem resolvidos conforme aplicável, a superfície continua um artefato interno com `noindex,nofollow`. Nenhum status deste relatório deve ser interpretado como autorização para anúncio, checkout, venda ou coleta de dados.