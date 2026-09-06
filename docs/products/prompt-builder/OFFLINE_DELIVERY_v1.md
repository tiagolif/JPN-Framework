# JPN Prompt Builder — Entrega offline v1

Status: **modo de entrega interno definido**. Este documento não publica o produto e não cria URL pública.

## Decisão reversível

Para destravar a composição do JPN Pro Kit sem depender de hospedagem, conta externa ou gasto, o Prompt Builder será preparado como **bundle offline servido por HTTP local**.

Essa decisão é reversível: uma publicação web futura pode ser adicionada separadamente, mas não é requisito para o staging interno do Pro Kit.

## Conteúdo do bundle

O comando `npm run stage:prompt-builder` recria `dist/prompt-builder-offline/` com:

- `product-site/index.html`;
- `product-site/app.js`;
- `product-site/styles.css`;
- `product-site/README.md`;
- `dist/browser/index.js`, o bundle browser oficial do SDK;
- `INSTRUCOES_DE_ACESSO.txt`;
- `STAGING_MANIFEST.json` com tamanho e SHA-256 de cada arquivo rastreado.

## Uso local

A pasta deve ser servida por HTTP local para preservar o carregamento de módulos ES. A instrução gerada sugere `python -m http.server 8000` apenas como exemplo quando Python já estiver instalado; nenhuma instalação paga ou criação de conta é necessária.

## Critérios para promover a artefato de entrega

Antes de congelar o Prompt Builder dentro do Pro Kit:

1. executar o build completo do SDK;
2. executar `npm run stage:prompt-builder`;
3. abrir o Builder pelo servidor HTTP local;
4. confirmar que criação de rascunho, validação, prontidão e geração do prompt funcionam com o bundle oficial;
5. revisar as instruções de acesso;
6. somente depois congelar o bundle e registrar hashes finais no manifesto do Pro Kit.

## Guardrails

- nenhuma URL pública é declarada;
- nenhum checkout ou anúncio é criado;
- nenhuma credencial é embutida;
- nenhuma API paga é necessária para o modo offline;
- nenhum dado financeiro real é usado;
- nenhum termo legal é aceito em nome do usuário.

## Estado que esta decisão resolve

O gate `prompt-builder-release-decision` deixa de depender de uma escolha entre hospedagem e entrega local: **a entrega local é o modo interno escolhido para v1**. Isso não equivale a dizer que o bundle final já foi congelado ou revisado; essa validação permanece parte do fechamento do Pro Kit.
