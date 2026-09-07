# JPN Business — Candidato Imprimível v1

## Estado

`print candidate / visual QA pending`

Este documento registra a primeira superfície de composição executável do JPN Business. Ela aproxima o produto de um artefato final sem antecipar aprovação de PDF, revisão humana ou publicação.

## Fonte canônica

- Conteúdo: `docs/products/jpn-business/JPN_BUSINESS_v1.md`
- Índice: `docs/products/jpn-business/BUSINESS_INDEX.json`
- Especificação: `docs/products/jpn-business/COMPOSITION_SPEC_v1.md`
- QA visual futuro: `docs/products/jpn-business/VISUAL_QA_CHECKLIST_v1.md`

## Comandos

### Verificação estrutural

```bash
npm run check:jpn-business-print-candidate
```

O gate exige:

- 12 playbooks, em sequência `JB-01` a `JB-12`;
- IDs únicos no documento e no índice;
- título de cada playbook idêntico ao índice;
- presença, em cada playbook, de Processo de negócio, Resultado pretendido, Responsável típico, Entradas, Restrições, Passos, Pontos de decisão, Saída, Como validar, O que registrar para continuidade, Riscos e JPN usado;
- pelo menos um vínculo `PP-*` no índice de cada playbook;
- ausência de alguns claims proibidos de garantia, eliminação de erros/alucinações ou substituição de revisão/especialista.

### Geração

```bash
npm run build:jpn-business-print-candidate
```

A geração parte do staging editorial comum e aplica uma camada específica para o JPN Business:

- A4;
- capa JPN já versionada;
- quebra de página antes de cada playbook;
- identificação visual de playbook operacional;
- bloco explícito com os prompts `PP-*` relacionados;
- destaque consistente de campos operacionais;
- CSS adequado a impressão;
- manifesto determinístico de conteúdo e dependências.

## Saídas locais

- `dist/editorial-print-staging/jpn-business/index.html`
- `dist/editorial-print-staging/jpn-business/candidate-manifest.json`

O manifesto registra SHA-256 da fonte e do índice, os 12 playbooks, vínculos com o Prompt Pack e o estado explícito de `visual_qa: pending`, `pdf_export: pending` e `publication_authorized: false`.

## O que esta etapa comprova

Esta etapa comprova que existe um caminho reprodutível entre o documento consolidado e uma superfície imprimível estruturada, e que a estrutura mínima dos 12 playbooks pode ser verificada automaticamente.

Ela **não** comprova:

- qualidade editorial humana;
- ausência de problemas visuais após renderização em um navegador específico;
- PDF final aprovado;
- fontes incorporadas corretamente no PDF;
- links funcionais no PDF exportado;
- autorização de venda, anúncio ou publicação.

## Critério para avançar `diagramacao-final` para `passed`

O status deve continuar `in-progress` até que o HTML candidato seja efetivamente renderizado, o PDF candidato seja exportado e a inspeção visual página a página prevista em `VISUAL_QA_CHECKLIST_v1.md` tenha evidência versionada.

Nenhum artefato gerado por este comando deve ser tratado como publicado ou comercialmente aprovado por padrão.
