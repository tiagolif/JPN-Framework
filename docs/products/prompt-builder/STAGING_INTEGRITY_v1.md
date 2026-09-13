# JPN Prompt Builder — integridade do staging offline v1

## Objetivo

Garantir que o bundle offline interno do JPN Prompt Builder possa ser preparado e verificado de forma determinística, sem confundir staging técnico com release final ou publicação.

## Comandos

- `npm run check:prompt-builder-staging` executa o staging em diretório temporário e remove o resultado ao final.
- `npm run stage:prompt-builder` cria o staging persistente em `dist/prompt-builder-offline/`.

O preflight depende do bundle browser já construído em `dist/browser/index.js`, portanto o fluxo normal de `npm run build` continua executando `build:browser` antes da verificação.

## Arquivos copiados e verificados byte a byte

O manifesto de staging acompanha:

1. `product-site/index.html`
2. `product-site/app.js`
3. `product-site/styles.css`
4. `product-site/README.md`
5. `dist/browser/index.js`
6. `INSTRUCOES_DE_ACESSO.txt`

Para cada um desses arquivos, o staging compara bytes e SHA-256 entre a fonte e a cópia entregue. Qualquer divergência interrompe o processo.

## Documentos candidatos gerados

O staging também gera quatro documentos em `customer-docs-candidate/` para antecipar a estrutura do futuro pacote ao cliente:

1. `LEIA-ME.md`
2. `GUIA_RAPIDO.md`
3. `BACKUP_E_EXPORTACAO.md`
4. `PRIVACIDADE_E_LIMITES.md`

Esses documentos são derivados apenas de fontes canônicas existentes. Todos recebem aviso explícito de **CANDIDATO INTERNO — NÃO É RELEASE FINAL**.

O manifesto registra bytes e SHA-256 de cada documento gerado, além de `final_slot_materialized: false`. Assim, é possível comparar o staging entre execuções sem confundir esses hashes com checksums finais de distribuição.

## Manifesto

`STAGING_MANIFEST.json` registra:

- produto e modo de entrega;
- estado `internal-staging`;
- `release_ready: false`;
- `final_bundle: false`;
- `publication_authorized: false`;
- ausência de URL pública e de dependência de conta externa;
- bytes e SHA-256 dos arquivos copiados;
- confirmação `source_matches_staged: true` para cópias byte a byte;
- `distribution_projection.status: candidate-only`;
- os quatro nomes previstos para os slots documentais finais;
- os gates obrigatórios `qa-fisico-contextual-celular`, `ci-final` e `pacote-offline-final`;
- bytes e SHA-256 dos documentos candidatos gerados;
- `source_state_digest`, calculado deterministicamente sobre arquivos copiados e documentos candidatos.

O digest identifica o estado técnico do staging. Ele não é hash final de release e não substitui revisão funcional, visual, física ou CI do head definitivo.

## Condições de falha

O preflight falha se:

- algum arquivo obrigatório do site estiver ausente;
- o bundle browser não existir;
- qualquer fonte documental necessária estiver ausente;
- bytes ou SHA-256 de uma cópia staged divergirem da fonte;
- a geração de qualquer documento candidato não puder ser concluída.

## O que este gate não aprova

Passar neste preflight não significa que:

- o bundle está congelado para distribuição;
- `JPN_Prompt_Builder_Offline.zip` existe como release final;
- os quatro documentos candidatos estão editorialmente aprovados;
- o Prompt Builder passou por QA físico/contextual em celular real;
- a revisão visual final foi concluída;
- o head definitivo passou em CI;
- existe URL pública;
- publicação, anúncio, venda ou checkout estão autorizados.

A promoção para bundle final deve ocorrer apenas quando os gates formais de release tiverem evidência suficiente, os documentos candidatos forem revisados e o estado congelado estiver identificado por hashes finais separados.

## Guardrails

Este fluxo é local e interno. Não cria conta, não usa credenciais, não acessa dados financeiros, não aceita termos externos e não publica qualquer artefato comercial.
