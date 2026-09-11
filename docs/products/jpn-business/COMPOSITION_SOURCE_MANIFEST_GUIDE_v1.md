# JPN Business — Guia do Manifesto de Fontes v1

## Objetivo

Eliminar uma lacuna entre o mapa de composição e o conteúdo editorial já existente. O `COMPOSITION_MAP_v1.json` define **quais blocos** precisam existir no material; o `COMPOSITION_SOURCE_MANIFEST_v1.json` define **de onde cada bloco deve ser obtido** antes de qualquer reescrita ou diagramação.

Este manifesto não é um PDF, não é uma composição final e não aprova release.

## Regra principal

A composição deve reutilizar conteúdo canônico existente antes de criar texto novo. Quando uma informação necessária não existir nas fontes mapeadas, a ação correta é registrar uma lacuna para revisão editorial — nunca preencher automaticamente por inferência.

## Cobertura

O manifesto cobre, na ordem do mapa de composição:

- 5 blocos de abertura;
- 12 playbooks `JB-01..JB-12`;
- 3 blocos finais.

Total esperado: **20 seções rastreáveis**.

Todos os 12 playbooks apontam para `JPN_BUSINESS_v1.md` e usam como âncora o cabeçalho canônico completo. As seções derivadas de índices, como sumário e referência cruzada `JB-* ↔ PP-*`, são identificadas explicitamente como geradas a partir das fontes versionadas.

## Tipos de fonte

- `composed-metadata`: metadados versionados usados para compor identificação do produto;
- `canonical-excerpt`: trecho editorial canônico reutilizado diretamente;
- `generated-from-map`: estrutura derivada do mapa, sem inventar conteúdo;
- `canonical-playbook`: playbook extraído do documento editorial consolidado;
- `generated-cross-reference`: relação derivada dos índices versionados;
- `canonical-synthesis`: síntese editorial permitida apenas a partir das fontes declaradas, sujeita a revisão humana.

## Gate automático

`scripts/check-jpn-business-source-manifest.mjs` valida:

1. produto, estado e efeito de release do manifesto;
2. alinhamento exato de quantidade, ordem, IDs e tipos de seção com `COMPOSITION_MAP_v1.json`;
3. inexistência de IDs duplicados ou seções extras;
4. existência física de todas as fontes declaradas dentro do repositório;
5. correspondência dos 12 cabeçalhos canônicos dos playbooks em `JPN_BUSINESS_v1.md`;
6. preservação da regra de revisão humana para conteúdo ausente;
7. ausência de promoção automática de `diagramacao-final`, `pdf-final`, freeze ou release.

O checker é executado dentro de `check-jpn-business-links.mjs`, reaproveitando o gate já encadeado no build principal.

## O que esta etapa permite afirmar

Apenas que existe rastreabilidade estrutural entre o mapa de composição e suas fontes editoriais.

Estado máximo suportado por esta etapa: `READY_FOR_SOURCE_ASSEMBLY`.

## O que continua pendente

- montagem do arquivo candidato completo;
- transformação dos playbooks no layout definido pela especificação;
- geração de sumário e referência cruzada no artefato real;
- diagramação;
- inspeção página a página;
- revisão editorial humana;
- validação de overflow, cortes e legibilidade;
- PDF candidato;
- freeze, hashes e release.

Nenhuma dessas etapas pode ser marcada como concluída somente pela existência deste manifesto ou pelo sucesso do checker automático.
