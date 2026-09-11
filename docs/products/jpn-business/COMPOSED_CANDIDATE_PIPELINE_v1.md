# JPN Business — Pipeline de Candidato Composto v1

## Objetivo

Conectar a infraestrutura de composição criada para o JPN Business ao candidato imprimível que já existe, sem reescrever os 12 playbooks nem antecipar aprovação humana.

O pipeline usa como fontes estruturais:

- `COMPOSITION_MAP_v1.json` — ordem e arquitetura das 20 seções;
- `COMPOSITION_SOURCE_MANIFEST_v1.json` — rastreabilidade das fontes de cada seção;
- `PROMPT_INDEX.json` — nomes e IDs canônicos do JPN Prompt Pack;
- `build-jpn-business-print-candidate.mjs` — gerador do candidato imprimível já existente.

## Novo compositor

`scripts/build-jpn-business-composed-candidate.mjs`

### Modo de checagem

```bash
node scripts/build-jpn-business-composed-candidate.mjs --check
```

Valida, sem escrever artefatos:

1. produto e `release_effect` do mapa e do manifesto;
2. política `flag-for-editorial-review-do-not-invent`;
3. correspondência exata das 20 seções entre mapa e manifesto;
4. presença dos 12 playbooks;
5. presença dos 18 templates do Prompt Pack;
6. validade de cada vínculo `JB-* -> PP-*`;
7. tipos de fonte autorizados no manifesto;
8. preservação das duas sínteses que continuam sujeitas a revisão editorial humana.

Esse modo está encadeado em `check-jpn-business-links.mjs`, portanto passa pelo gate já utilizado no build principal.

### Modo de geração

```bash
node scripts/build-jpn-business-composed-candidate.mjs
```

O fluxo:

1. executa o gerador existente `build-jpn-business-print-candidate.mjs`;
2. preserva os 12 playbooks canônicos e a Referência Rápida já incorporada;
3. injeta um sumário de composição derivado do mapa;
4. injeta uma referência cruzada `JB-* ↔ PP-*` com os nomes dos prompts obtidos do índice canônico;
5. adiciona uma seção explícita para as sínteses que ainda dependem de revisão humana;
6. registra no `candidate-manifest.json` os hashes SHA-256 do mapa, manifesto de fontes e índice do Prompt Pack;
7. mantém `visual_qa`, `pdf_export` e `publication_authorized` em estados não aprovados.

## Estado máximo desta etapa

`source-traceable-candidate-human-review-pending`

Este estado significa apenas que o candidato imprimível pode carregar rastreabilidade estrutural das fontes e referências cruzadas de forma determinística.

Não significa:

- diagramação final aprovada;
- revisão editorial humana concluída;
- PDF final aprovado;
- freeze;
- release;
- autorização de publicação ou comercialização.

## Lacunas preservadas

O compositor não produz texto editorial novo para preencher lacunas. As seções `application-checklist` e `limits`, mapeadas como `canonical-synthesis`, permanecem sinalizadas para revisão humana e devem ser consolidadas somente a partir das fontes declaradas no manifesto.

## Próxima etapa segura

Executar o compositor em ambiente com Node.js 20+, abrir o HTML resultante em navegador real e realizar o checklist de QA visual/editorial já versionado. Somente depois disso o projeto pode gerar um PDF candidato para inspeção página a página.
