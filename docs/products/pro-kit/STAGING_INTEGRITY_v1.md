# JPN Pro Kit — Integridade do staging v1

## Objetivo

Este documento define o preflight mecânico do staging interno do JPN Pro Kit. O objetivo é comprovar que as fontes declaradas no manifesto existem, que apenas arquivos diretamente distribuíveis são copiados nesta fase e que cada cópia staged é byte a byte equivalente à sua fonte por SHA-256.

Este gate não congela release, não cria manifesto final e não autoriza publicação.

## Comandos

```bash
npm run check:pro-kit-staging
npm run stage:pro-kit
```

`check:pro-kit-staging` executa o mesmo contrato de staging em diretório temporário e remove o resultado ao final. Ele serve para CI/preflight sem deixar um pacote persistente em `dist/`.

`stage:pro-kit` cria `dist/pro-kit-staging/` para revisão interna.

## Regras de integridade

O processo:

1. lê `MANIFEST.template.json`;
2. rejeita caminhos absolutos ou com travessia `..`;
3. rejeita `delivery_path` duplicado;
4. exige que os hashes finais do template continuem `null`;
5. verifica a existência de todas as fontes declaradas;
6. classifica como diretamente stageable somente `.xlsx`, `.json` e `.txt` que não estejam em `pending-final-artifact`;
7. copia somente esses arquivos;
8. calcula SHA-256 da fonte e da cópia;
9. falha se qualquer hash divergir;
10. produz `STAGING_REPORT.json` apenas no modo persistente.

## Rastreabilidade

O relatório de staging registra:

- `template_sha256`: identidade do manifesto-template usado;
- `source_state_digest`: digest determinístico do estado das fontes e cópias;
- `source_sha256` e `staged_sha256` por item;
- bytes staged;
- quantidade de fontes presentes, itens stageable, cópias realizadas e cópias verificadas;
- estados explícitos `release_ready: false`, `final_manifest: false` e `publication_authorized: false`.

`generated_at` serve apenas como metadado de execução e não participa do `source_state_digest`.

## O que este gate não comprova

Passar neste preflight não significa que:

- os PDFs pendentes foram gerados ou aprovados;
- o Prompt Builder possui bundle final congelado;
- GF-QA-10 da Gestão Fácil foi concluído;
- revisão editorial ou visual foi concluída;
- hashes finais de release podem ser preenchidos;
- o Pro Kit está pronto para venda ou publicação.

## Regra de promoção

O staging interno pode ser regenerado quantas vezes forem necessárias enquanto os artefatos finais não estiverem congelados. Somente após todos os gates de produto e QA aplicáveis passarem com evidência real poderá existir um manifesto final separado do template.
