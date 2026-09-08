# JPN Gestão Fácil — gate de integridade do binário v0.1

Status: **ativo para o binário reconstruído testado localmente**.

## Objetivo

Impedir que o XLSX já submetido a GF-QA-01..09 seja alterado silenciosamente sem invalidar a evidência registrada em `QA_EXECUTION_v0.1.md`.

Artefato protegido:

`deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx`

SHA-256 esperado:

`46b6fff3b366b2ac3467f443643c12e6aa8ba9958b8b54e0797ec91176c9dded`

## O que o gate verifica

`scripts/check-gestao-facil-binary.mjs` confirma:

1. existência e tamanho mínimo plausível do arquivo;
2. assinatura inicial `PK`, esperada em um contêiner OOXML/XLSX;
3. SHA-256 idêntico ao binário usado no QA funcional local;
4. correspondência entre esse hash e o hash registrado em `QA_EXECUTION_v0.1.md`;
5. GF-QA-01..09 continuam registrados como `PASS`;
6. GF-QA-10 continua registrado como `PENDENTE` até existir evidência real de compatibilidade cruzada.

Executar com:

```bash
npm run check:gestao-facil-binary
```

## Regra de mudança

Se o XLSX for modificado, o gate deve falhar. Não se deve simplesmente atualizar o hash esperado. A sequência correta é:

1. tratar o novo arquivo como novo candidato;
2. repetir GF-QA-01..09 sobre esse binário;
3. registrar nova evidência observada;
4. só então atualizar o hash do gate;
5. manter GF-QA-10 pendente até teste real em Excel, LibreOffice Calc e Google Sheets.

## Limites

Este gate prova identidade do binário e continuidade da evidência local; ele não prova compatibilidade entre aplicativos, inspeção visual, correção contábil/fiscal, adequação jurídica nem autorização de publicação.

Nenhum dado financeiro real deve ser usado para executar ou atualizar este gate.
