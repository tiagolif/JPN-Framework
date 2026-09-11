# JPN Business — Guia do Mapa de Composição v1

## Objetivo

Converter a especificação editorial do JPN Business em uma estrutura determinística que possa ser usada na preparação da diagramação sem declarar a diagramação, o PDF ou o release como concluídos.

O arquivo canônico desta etapa é `COMPOSITION_MAP_v1.json`.

## O que o mapa fixa

- a ordem das cinco seções iniciais;
- a ordem canônica dos 12 playbooks `JB-01..JB-12`;
- nome, categoria e vínculos `PP-*` de cada playbook;
- os oito blocos que cada cartão de playbook deve expor na composição;
- as três seções finais;
- os quatro tipos de destaque previstos pela especificação;
- guardrails editoriais que impedem claims e promoções indevidas.

## O que o mapa não fixa

O mapa não define número final de páginas, quebra de página, tipografia final, tamanho de fonte, posição exata de elementos, escolha de ilustrações, versão final da capa ou acabamento visual. Essas decisões pertencem à etapa de composição/QA visual e continuam sujeitas a revisão humana.

## Relação com as fontes canônicas

O checker `scripts/check-jpn-business-composition-map.mjs` compara o mapa com:

1. `BUSINESS_INDEX.json`, para preservar os 12 playbooks, nomes, categorias e links `PP-*`;
2. `PROMPT_INDEX.json`, para impedir referência a template inexistente;
3. `COMPOSITION_SPEC_v1.md`, para preservar a arquitetura editorial e os destaques exigidos.

O checker também exige que o mapa permaneça com:

- `status: composition-prep-only`;
- `release_effect: none`;
- regra explícita impedindo promoção automática de `diagramacao-final`, `pdf-final`, freeze ou release.

## Integração no QA

O novo checker é executado pelo `check-jpn-business-links.mjs`, junto dos gates já existentes de referência rápida, workbook, revisão de 30 dias e preflight de composição. Assim, o mapa entra na mesma cadeia de QA do produto sem criar uma trilha paralela.

## Critério de avanço

Esta etapa pode ser considerada concluída quando o mapa permanecer consistente com as fontes canônicas e o gate estrutural passar no ambiente de build.

O máximo de estado permitido por esta etapa é:

`READY_FOR_COMPOSITION_PREP`

Isso significa apenas que a estrutura está pronta para servir de entrada à composição.

## Pendências preservadas

Continuam necessárias antes de qualquer promoção de `diagramacao-final`:

- gerar o arquivo candidato completo;
- diagramar os 12 playbooks;
- conferir as referências `PP-*` no arquivo resultante;
- realizar inspeção visual página a página;
- verificar cortes, overflow, páginas vazias acidentais e legibilidade;
- registrar evidência versionada da revisão humana.

Depois disso, `pdf-final`, freeze, hashes, manifesto e release ainda permanecem etapas separadas.

## Guardrails

Este mapa não autoriza publicação, anúncio, compra, contratação, checkout, uso de dados financeiros reais, inserção de credenciais ou aceite legal. Também não comprova garantia de vendas, ROI, precisão absoluta ou eliminação de alucinações.
