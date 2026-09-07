# JPN Business ↔ JPN Prompt Pack — contrato de consistência v1

Status: `gate mecânico definido`

Base do framework: `0.3.0-draft`.

## Objetivo

Evitar que o JPN Business seja entregue com referências quebradas, IDs duplicados ou divergência silenciosa em relação ao JPN Prompt Pack.

O Business usa prompts do Pack como blocos de execução dentro de processos maiores. Portanto, qualquer vínculo `JB-* → PP-*` precisa continuar válido quando um dos produtos for editado.

## Fontes canônicas verificadas

- `docs/products/jpn-business/BUSINESS_INDEX.json`
- `docs/products/jpn-business/JPN_BUSINESS_v1.md`
- `docs/products/prompt-pack/PROMPT_INDEX.json`
- `docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md`

## Gate automatizado

Comando:

```bash
npm run check:jpn-business-links
```

Implementação:

`script/check-jpn-business-links.mjs` não existe; a implementação canônica é `scripts/check-jpn-business-links.mjs`.

O gate falha quando encontra qualquer uma destas condições:

1. produto ou versão estrutural ausente nos índices;
2. `framework_base` divergente entre Business e Prompt Pack;
3. IDs `JB-*` ou `PP-*` duplicados;
4. ID fora do formato versionado esperado;
5. playbook sem nome, categoria ou vínculo com o Prompt Pack;
6. referência `PP-*` inexistente no índice do Prompt Pack;
7. `JB-*` ausente no documento humano do Business;
8. `PP-*` ausente no documento humano do Prompt Pack;
9. quantidade estrutural inesperada na versão atual: 12 playbooks Business ou 18 templates Prompt Pack.

## Estado observado nesta versão

O índice Business contém 12 playbooks e referencia somente IDs presentes no índice atual do Prompt Pack. O Prompt Pack contém 18 templates. Ambos declaram `framework_base` igual a `0.3.0-draft`.

Essa verificação prova consistência estrutural entre os artefatos versionados; ela não mede qualidade de resposta de modelo, eficácia comercial nem desempenho do método.

## Política para futuras edições

Qualquer mudança que:

- renomeie um ID `PP-*`;
- remova um template do Prompt Pack;
- adicione ou remova um playbook `JB-*`;
- altere a base do framework em apenas um produto;

precisa atualizar os dois índices e passar novamente pelo gate antes de um candidato a release.

## Definition of Done

Esta etapa é considerada concluída quando o gate estiver integrado ao `npm run build` e o CI do head correspondente terminar com sucesso.
