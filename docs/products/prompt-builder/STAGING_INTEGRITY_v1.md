# JPN Prompt Builder — integridade do staging offline v1

## Objetivo

Garantir que o bundle offline interno do JPN Prompt Builder possa ser preparado e verificado de forma determinística, sem confundir staging técnico com release final ou publicação.

## Comandos

- `npm run check:prompt-builder-staging` executa o staging em diretório temporário e remove o resultado ao final.
- `npm run stage:prompt-builder` cria o staging persistente em `dist/prompt-builder-offline/`.

O preflight depende do bundle browser já construído em `dist/browser/index.js`, portanto o fluxo normal de `npm run build` continua executando `build:browser` antes da verificação.

## Arquivos rastreados

O manifesto de staging acompanha:

1. `product-site/index.html`
2. `product-site/app.js`
3. `product-site/styles.css`
4. `product-site/README.md`
5. `dist/browser/index.js`
6. `INSTRUCOES_DE_ACESSO.txt`

Para cada arquivo, o staging compara bytes e SHA-256 entre a fonte e a cópia entregue. Qualquer divergência interrompe o processo.

## Manifesto

`STAGING_MANIFEST.json` registra:

- produto e modo de entrega;
- estado `internal-staging`;
- `release_ready: false`;
- `final_bundle: false`;
- `publication_authorized: false`;
- ausência de URL pública e de dependência de conta externa;
- bytes e SHA-256 por arquivo;
- confirmação `source_matches_staged: true`;
- `source_state_digest`, calculado deterministicamente a partir dos arquivos rastreados.

O digest identifica o estado técnico das fontes usadas no staging. Ele não é hash final de release e não substitui revisão funcional, visual ou CI do head definitivo.

## Condições de falha

O preflight falha se:

- algum arquivo obrigatório do site estiver ausente;
- o bundle browser não existir;
- as instruções de acesso não existirem;
- bytes ou SHA-256 da cópia staged divergirem da fonte.

## O que este gate não aprova

Passar neste preflight não significa que:

- o bundle está congelado para distribuição;
- o Prompt Builder passou por QA final de navegador/dispositivo;
- a revisão visual final foi concluída;
- o head definitivo passou em CI;
- existe URL pública;
- publicação, anúncio, venda ou checkout estão autorizados.

A promoção para bundle final deve ocorrer apenas quando os gates formais de release tiverem evidência suficiente e o estado congelado estiver identificado por hashes finais separados.

## Guardrails

Este fluxo é local e interno. Não cria conta, não usa credenciais, não acessa dados financeiros, não aceita termos externos e não publica qualquer artefato comercial.
